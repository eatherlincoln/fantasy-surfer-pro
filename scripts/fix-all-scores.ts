
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

const r32Scores = [
    { heat: 1, surfers: [
        { name: 'Bronson Meydi', waves: [4.60, 3.87], status: 'ELIMINATED' },
        { name: 'Jorgann Couzinet', waves: [6.00, 3.20], status: 'ELIMINATED' },
        { name: 'Imaikalani deVault', waves: [6.67, 5.23], status: 'active' },
        { name: 'Carlos Munoz', waves: [8.83, 5.20], status: 'active' }
    ]},
    { heat: 2, surfers: [
        { name: 'Dakoda Walters', waves: [6.67, 4.57], status: 'active' },
        { name: 'Mihimana Braye', waves: [5.30, 4.83], status: 'ELIMINATED' },
        { name: 'Caleb Tancred', waves: [7.83, 5.33], status: 'active' },
        { name: 'Luke Thompson', waves: [6.00, 4.80], status: 'ELIMINATED' }
    ]},
    { heat: 3, surfers: [
        { name: 'Mateus Herdy', waves: [8.07, 6.83], status: 'ELIMINATED' },
        { name: 'Finn McGill', waves: [8.30, 8.00], status: 'active' },
        { name: 'Alister Reginato', waves: [8.60, 6.33], status: 'active' },
        { name: 'Ian Gentil', waves: [5.50, 0.93], status: 'ELIMINATED' }
    ]},
    { heat: 4, surfers: [
        { name: 'Adur Amatriain', waves: [5.00, 3.10], status: 'ELIMINATED' },
        { name: 'Dylan Moffat', waves: [5.77, 5.50], status: 'active' },
        { name: 'Oliver Zietz', waves: [5.93, 2.83], status: 'ELIMINATED' },
        { name: 'Eli Hanneman', waves: [4.67, 4.50], status: 'active' }
    ]},
    { heat: 5, surfers: [
        { name: 'Ocean Lancaster', waves: [6.57, 6.00], status: 'ELIMINATED' },
        { name: 'Makana Franzmann', waves: [6.70, 1.60], status: 'ELIMINATED' },
        { name: 'Morgan Cibilic', waves: [7.50, 6.60], status: 'active' },
        { name: 'Shion Crawford', waves: [6.50, 6.40], status: 'active' }
    ]},
    { heat: 6, surfers: [
        { name: 'Kauli Vaast', waves: [6.73, 2.33], status: 'active' },
        { name: 'Levi Slawson', waves: [7.17, 6.33], status: 'active' },
        { name: 'Reef Heazlewood', waves: [4.47, 3.57], status: 'ELIMINATED' },
        { name: 'Keoni Lasa', waves: [5.33, 3.50], status: 'ELIMINATED' }
    ]},
    { heat: 7, surfers: [
        { name: 'Oscar Berry', waves: [4.40, 3.87], status: 'ELIMINATED' },
        { name: 'Callum Robson', waves: [5.73, 5.33], status: 'active' },
        { name: 'Dimitri Poulos', waves: [7.17, 7.07], status: 'active' },
        { name: 'Ben Lorentson', waves: [5.67, 4.43], status: 'ELIMINATED' }
    ]},
    { heat: 8, surfers: [
        { name: 'Mikey McDonagh', waves: [6.77, 5.93], status: 'ELIMINATED' },
        { name: 'Jackson Bunch', waves: [7.50, 7.50], status: 'active' },
        { name: 'Lucas Cassity', waves: [6.90, 6.30], status: 'active' },
        { name: 'Lucas Silveira', waves: [5.77, 5.67], status: 'ELIMINATED' }
    ]}
];

const r16Scores = [
    { heat: 1, surfers: [{ name: 'Carlos Munoz', total: 10.87, status: 'ELIMINATED' }, { name: 'Dakoda Walters', total: 11.13, status: 'active' }] },
    { heat: 2, surfers: [{ name: 'Caleb Tancred', total: 14.06, status: 'active' }, { name: 'Imaikalani deVault', total: 9.67, status: 'ELIMINATED' }] },
    { heat: 3, surfers: [{ name: 'Finn McGill', total: 9.14, status: 'ELIMINATED' }, { name: 'Eli Hanneman', total: 6.27, status: 'ELIMINATED' }] }, // Eli eliminated earlier? No, McGill wins.
    { heat: 4, surfers: [{ name: 'Dylan Moffat', total: 13.10, status: 'ELIMINATED' }, { name: 'Alister Reginato', total: 14.30, status: 'active' }] },
    { heat: 5, surfers: [{ name: 'Morgan Cibilic', total: 13.50, status: 'ELIMINATED' }, { name: 'Kauli Vaast', total: 14.00, status: 'active' }] },
    { heat: 6, surfers: [{ name: 'Levi Slawson', total: 12.84, status: 'active' }, { name: 'Shion Crawford', total: 12.33, status: 'ELIMINATED' }] },
    { heat: 7, surfers: [{ name: 'Dimitri Poulos', total: 11.43, status: 'ELIMINATED' }, { name: 'Lucas Cassity', total: 14.73, status: 'active' }] },
    { heat: 8, surfers: [{ name: 'Jackson Bunch', total: 12.83, status: 'ELIMINATED' }, { name: 'Callum Robson', total: 13.17, status: 'active' }] }
];

const qfScores = [
    { heat: 1, surfers: [{ name: 'Dakoda Walters', total: 14.00, status: 'active' }, { name: 'Caleb Tancred', total: 8.00, status: 'ELIMINATED' }] },
    { heat: 2, surfers: [{ name: 'Finn McGill', total: 7.33, status: 'ELIMINATED' }, { name: 'Alister Reginato', total: 9.84, status: 'active' }] },
    { heat: 3, surfers: [{ name: 'Kauli Vaast', total: 13.16, status: 'active' }, { name: 'Levi Slawson', total: 11.90, status: 'ELIMINATED' }] },
    { heat: 4, surfers: [{ name: 'Lucas Cassity', total: 13.33, status: 'active' }, { name: 'Callum Robson', total: 11.00, status: 'ELIMINATED' }] }
];

const sfScores = [
    { heat: 1, surfers: [{ name: 'Dakoda Walters', total: 11.23, status: 'ELIMINATED' }, { name: 'Alister Reginato', total: 16.27, status: 'active' }] },
    { heat: 2, surfers: [{ name: 'Kauli Vaast', total: 11.67, status: 'active' }, { name: 'Lucas Cassity', total: 8.10, status: 'ELIMINATED' }] }
];

const finalsScores = [
    { heat: 1, surfers: [{ name: 'Alister Reginato', total: 16.00, status: 'active' }, { name: 'Kauli Vaast', total: 9.57, status: 'ELIMINATED' }] }
];

async function updateAllScores() {
    console.log('--- STARTING COMPREHENSIVE SCORE UPDATE ---');

    // Fetch Surfer Mapping
    const { data: surferData } = await supabase.from('surfers').select('id, name');
    const surferMap: Record<string, string> = {};
    surferData?.forEach(s => surferMap[s.name] = s.id);

    const updateRound = async (roundNumber: number, scores: any[]) => {
        console.log(`Updating Round ${roundNumber}...`);
        
        // 1. Ensure heats exist
        for (const sData of scores) {
            let { data: heat } = await supabase.from('heats')
                .select('id')
                .eq('event_id', EVENT_ID)
                .eq('round_number', roundNumber)
                .eq('heat_number', sData.heat)
                .single();
            
            if (!heat) {
                console.log(`Creating Heat ${sData.heat} for Round ${roundNumber}...`);
                const { data: newHeat } = await supabase.from('heats').insert({
                    event_id: EVENT_ID,
                    round_number: roundNumber,
                    heat_number: sData.heat,
                    status: 'UPCOMING'
                }).select().single();
                heat = newHeat;
            }

            if (!heat) continue;

            // Clear existing assignments and scores for this heat to avoid duplicates
            await supabase.from('heat_assignments').delete().eq('heat_id', heat.id);
            await supabase.from('scores').delete().eq('heat_id', heat.id);

            for (const s of sData.surfers) {
                const surferId = surferMap[s.name];
                if (!surferId) {
                    console.error(`Surfer not found: ${s.name}`);
                    continue;
                }

                const totalScore = s.total || s.waves.reduce((a: number, b: number) => a + b, 0);

                // Insert assignment
                await supabase.from('heat_assignments').insert({
                    heat_id: heat.id,
                    surfer_id: surferId,
                    heat_score: totalScore
                });

                // Insert scores
                const waves = s.waves || [totalScore / 2, totalScore / 2]; // Split if not provided
                await supabase.from('scores').insert(waves.map((w: number) => ({
                    heat_id: heat.id,
                    surfer_id: surferId,
                    wave_score: w
                })));

                // Update surfer status
                await supabase.from('surfers').update({ status: s.status }).eq('id', surferId);
            }

            // Mark heat as COMPLETED
            await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heat.id);
        }
    };

    await updateRound(3, r32Scores);
    await updateRound(4, r16Scores);
    await updateRound(5, qfScores);
    await updateRound(6, sfScores);
    await updateRound(7, finalsScores);

    // Recalculate Points (Simplified: sum of all COMPLETED heat scores for each surfer in this event)
    console.log('Recalculating Points for event...');
    
    // Get all completed heats for this event
    const { data: eventHeats } = await supabase.from('heats').select('id').eq('event_id', EVENT_ID).eq('status', 'COMPLETED');
    const heatIds = eventHeats?.map(h => h.id) || [];

    const { data: allScores } = await supabase.from('heat_assignments').select('surfer_id, heat_score').in('heat_id', heatIds);
    
    const surferTotals: Record<string, number> = {};
    allScores?.forEach(s => {
        surferTotals[s.surfer_id] = (surferTotals[s.surfer_id] || 0) + (Number(s.heat_score) || 0);
    });

    // Update surfers' current_season_points
    for (const [id, total] of Object.entries(surferTotals)) {
        await supabase.from('surfers').update({ current_season_points: total }).eq('id', id);
    }

    // Update user_teams points
    const { data: allTeams } = await supabase.from('user_teams').select('id, user_id, surfer_id').eq('event_id', EVENT_ID);
    const userTotals: Record<string, number> = {};

    for (const team of allTeams || []) {
        const surferPoints = surferTotals[team.surfer_id] || 0;
        await supabase.from('user_teams').update({ points: surferPoints }).eq('id', team.id);
        userTotals[team.user_id] = (userTotals[team.user_id] || 0) + surferPoints;
    }

    // Update profiles total_fantasy_points
    // Note: This might need to sum ACROSS all events if there are multiple.
    // For now, let's assume we are just updating based on this event's contributions.
    // Actually, a safer way is to re-sum everything from user_teams for each user.
    const { data: allUserTeams } = await supabase.from('user_teams').select('user_id, points');
    const globalUserTotals: Record<string, number> = {};
    allUserTeams?.forEach(t => {
        globalUserTotals[t.user_id] = (globalUserTotals[t.user_id] || 0) + (t.points || 0);
    });

    for (const [uid, total] of Object.entries(globalUserTotals)) {
        await supabase.from('profiles').update({ total_fantasy_points: total }).eq('id', uid);
    }

    console.log('--- SCORE UPDATE COMPLETE ---');
}

updateAllScores().catch(console.error);
