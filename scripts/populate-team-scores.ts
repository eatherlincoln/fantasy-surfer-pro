import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function populateUserTeamScores() {
    const eventId = '79fb2722-23b5-45b2-b88b-79177f2b8199';
    console.log("Populating scores for all user teams based on heat results...");

    // 1. Get all scored assignments for this event
    const { data: assignments } = await supabase
        .from('heat_assignments')
        .select('surfer_id, heat_score')
        .gt('heat_score', 0);

    if (!assignments) {
        console.log("No scored assignments found.");
        return;
    }

    // Map surfer_id -> total scores in this event
    const surferScores = new Map<number, number>();
    assignments.forEach(a => {
        const current = surferScores.get(a.surfer_id) || 0;
        surferScores.set(a.surfer_id, current + a.heat_score);
    });

    console.log(`Found scores for ${surferScores.size} surfers.`);

    // 2. Get all user teams for this event
    const { data: userTeams } = await supabase
        .from('user_teams')
        .select('id, surfer_id')
        .eq('event_id', eventId);

    if (!userTeams || userTeams.length === 0) {
        console.log("No user teams found to update.");
        return;
    }

    console.log(`Updating ${userTeams.length} user team entries...`);

    for (const team of userTeams) {
        const score = surferScores.get(team.surfer_id);
        if (score !== undefined) {
            await supabase
                .from('user_teams')
                .update({ points: score })
                .eq('id', team.id);
        }
    }

    // 3. Update profiles total_fantasy_points
    console.log("Updating profile totals...");
    const { data: profiles } = await supabase.from('profiles').select('id');
    if (profiles) {
        for (const profile of profiles) {
            const { data: teams } = await supabase.from('user_teams').select('points').eq('user_id', profile.id);
            const total = (teams || []).reduce((acc, t) => acc + (t.points || 0), 0);
            await supabase.from('profiles').update({ total_fantasy_points: total }).eq('id', profile.id);
        }
    }

    console.log("Done!");
}

populateUserTeamScores().catch(console.error);
