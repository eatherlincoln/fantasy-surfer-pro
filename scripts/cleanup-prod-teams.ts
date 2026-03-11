
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const PROD_URL = process.env.SUPABASE_URL;
const PROD_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!PROD_URL || !PROD_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}

const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

async function cleanupAndRecalc() {
    console.log('--- STARTING LARGE-SCALE CLEANUP AND RECALC ---');

    let allTeams: any[] = [];
    let from = 0;
    const step = 1000;
    let hasMore = true;

    while (hasMore) {
        console.log(`Fetching records from ${from}...`);
        const { data, error } = await supabase
            .from('user_teams')
            .select('id, user_id, surfer_id, created_at')
            .eq('event_id', EVENT_ID)
            .range(from, from + step - 1);

        if (error) throw error;
        if (data.length === 0) {
            hasMore = false;
        } else {
            allTeams = [...allTeams, ...data];
            from += step;
        }
    }

    console.log(`Fetched ${allTeams.length} total team records for event.`);

    // 2. Identify duplicates
    const keepIds: string[] = [];
    const deleteIds: string[] = [];
    const seenCombos = new Set<string>();

    // Sort by created_at to keep the oldest
    allTeams.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    allTeams.forEach(team => {
        const combo = `${team.user_id}-${team.surfer_id}`;
        if (seenCombos.has(combo)) {
            deleteIds.push(team.id);
        } else {
            seenCombos.add(combo);
            keepIds.push(team.id);
        }
    });

    console.log(`Unique records to keep: ${keepIds.length}`);
    console.log(`Duplicate records to delete: ${deleteIds.length}`);

    // 3. Delete duplicates (in batches to avoid timeouts)
    const batchSize = 100;
    for (let i = 0; i < deleteIds.length; i += batchSize) {
        const batch = deleteIds.slice(i, i + batchSize);
        console.log(`Deleting batch ${i / batchSize + 1} of ${Math.ceil(deleteIds.length / batchSize)}...`);
        const { error } = await supabase.from('user_teams').delete().in('id', batch);
        if (error) console.error('Delete error:', error);
    }

    // 4. Recalculate Points from COMPLETED heats only
    console.log('Recalculating Points...');
    const { data: allDoneHeats } = await supabase.from('heats').select('id').eq('event_id', EVENT_ID).eq('status', 'COMPLETED');
    const heatIds = allDoneHeats?.map(h => h.id) || [];

    const { data: allScores } = await supabase.from('heat_assignments').select('surfer_id, heat_score').in('heat_id', heatIds);

    // Sum points per surfer
    const surferTotals: Record<string, number> = {};
    allScores?.forEach(s => {
        surferTotals[s.surfer_id] = (surferTotals[s.surfer_id] || 0) + (Number(s.heat_score) || 0);
    });

    // Update surfers
    for (const [id, total] of Object.entries(surferTotals)) {
        await supabase.from('surfers').update({ current_season_points: total }).eq('id', id);
    }

    // Update User Teams (Remaining unique ones)
    const { data: remainingTeams } = await supabase.from('user_teams').select('id, user_id, surfer_id').eq('event_id', EVENT_ID);
    const userTotals: Record<string, number> = {};

    for (const team of remainingTeams || []) {
        const surferPoints = surferTotals[team.surfer_id] || 0;
        await supabase.from('user_teams').update({ points: surferPoints }).eq('id', team.id);
        userTotals[team.user_id] = (userTotals[team.user_id] || 0) + surferPoints;
    }

    // Update Profiles
    for (const [uid, total] of Object.entries(userTotals)) {
        await supabase.from('profiles').update({ total_fantasy_points: total }).eq('id', uid);
    }

    console.log('--- CLEANUP AND RECALC COMPLETE ---');
}

cleanupAndRecalc().catch(console.error);
