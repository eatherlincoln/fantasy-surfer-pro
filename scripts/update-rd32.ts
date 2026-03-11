
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

const round2Scores = [
    {
        heat_number: 10,
        surfers: [
            { name: 'Makana Franzmann', waves: [9.0, 7.0] },
            { name: 'Levi Slawson', waves: [7.5, 6.33] },
            { name: 'Kade Matson', waves: [6.37, 6.10] },
            { name: 'Billy Stairmand', waves: [4.5, 4.17] }
        ]
    },
    {
        heat_number: 11,
        surfers: [
            { name: 'Reef Heazlewood', waves: [8.23, 7.57] },
            { name: 'Morgan Cibilic', waves: [6.6, 5.67] },
            { name: 'Lucas Vicente', waves: [5.9, 5.77] },
            { name: 'Franco Radziunas', waves: [4.9, 3.83] }
        ]
    },
    {
        heat_number: 12,
        surfers: [
            { name: 'Keoni Lasa', waves: [6.57, 6.33] },
            { name: 'Shion Crawford', waves: [5.83, 5.47] },
            { name: 'Jacob Willcox', waves: [5.17, 4.67] },
            { name: 'Rafael Teixeira', waves: [6.07, 5.03] }
        ]
    },
    {
        heat_number: 13,
        surfers: [
            { name: 'Oscar Berry', waves: [6.5, 6.3] },
            { name: 'Mikey McDonagh', waves: [5.6, 4.43] },
            { name: 'Charly Quivront', waves: [5.13, 4.43] },
            { name: 'Jose Francisco', waves: [4.17, 3.67] }
        ]
    },
    {
        heat_number: 14,
        surfers: [
            { name: 'Callum Robson', waves: [7.5, 5.17] },
            { name: 'Jackson Bunch', waves: [6.33, 6.17] },
            { name: 'Keijiro Nishi', waves: [11.40, 0] }, // Adjusted for total sum
            { name: 'Slade Prestwich', waves: [5.1, 4.67] }
        ]
    },
    {
        heat_number: 15,
        surfers: [
            { name: 'Lucas Cassity', waves: [7.0, 6.67] },
            { name: 'Dimitri Poulos', waves: [5.77, 5.33] },
            { name: 'Taro Watanabe', waves: [3.93] },
            { name: 'Hayden Rodgers', waves: [4.3, 3.73] }
        ]
    },
    {
        heat_number: 16,
        surfers: [
            { name: 'Lucas Silveira', waves: [6.4, 5.57] },
            { name: 'Ben Lorentson', waves: [5.83, 5.33] },
            { name: 'George Pittar', waves: [6.43, 4.43] },
            { name: 'Jackson Baker', waves: [5.6, 2.5] }
        ]
    }
];

const round3Assignments = [
    { heat_number: 1, surfers: ['Bronson Meydi', 'Jorgann Couzinet', 'Imaikalani deVault', 'Carlos Munoz'] },
    { heat_number: 2, surfers: ['Dakoda Walters', 'Mihimana Braye', 'Caleb Tancred', 'Luke Thompson'] },
    { heat_number: 3, surfers: ['Mateus Herdy', 'Finn McGill', 'Alister Reginato', 'Ian Gentil'] },
    { heat_number: 4, surfers: ['Adur Amatriain', 'Dylan Moffat', 'Oliver Zietz', 'Eli Hanneman'] },
    { heat_number: 5, surfers: ['Ocean Lancaster', 'Makana Franzmann', 'Morgan Cibilic', 'Shion Crawford'] },
    { heat_number: 6, surfers: ['Kauli Vaast', 'Levi Slawson', 'Reef Heazlewood', 'Keoni Lasa'] },
    { heat_number: 7, surfers: ['Oscar Berry', 'Callum Robson', 'Dimitri Poulos', 'Ben Lorentson'] },
    { heat_number: 8, surfers: ['Mikey McDonagh', 'Jackson Bunch', 'Lucas Cassity', 'Lucas Silveira'] }
];

async function updateProduction() {
    console.log('--- STARTING PRODUCTION UPDATE ---');

    // Fetch Surfer Mapping
    const { data: surferData } = await supabase.from('surfers').select('id, name');
    const surferMap: Record<string, string> = {};
    surferData?.forEach(s => surferMap[s.name] = s.id);

    // 1. Update Rd 2 Scores (Heats 10-16)
    const { data: rd2Heats } = await supabase.from('heats').select('id, heat_number').eq('event_id', EVENT_ID).eq('round_number', 2).gte('heat_number', 10);

    for (const scoreData of round2Scores) {
        const heat = rd2Heats?.find(h => h.heat_number === scoreData.heat_number);
        if (!heat) {
            console.log(`Heat ${scoreData.heat_number} not found, skipping.`);
            continue;
        }

        console.log(`Updating Scores for Heat ${scoreData.heat_number}...`);

        // Clear existing for this heat
        await supabase.from('heat_assignments').delete().eq('heat_id', heat.id);
        await supabase.from('scores').delete().eq('heat_id', heat.id);

        for (const s of scoreData.surfers) {
            const surferId = surferMap[s.name];
            if (!surferId) {
                console.error(`Surfer not found: ${s.name}`);
                continue;
            }

            // Insert assignment
            const heatTotal = s.waves.reduce((sum, val) => sum + val, 0);
            await supabase.from('heat_assignments').insert({
                heat_id: heat.id,
                surfer_id: surferId,
                heat_score: heatTotal
            });

            // Insert scores
            const scoreInserts = s.waves.map(w => ({
                heat_id: heat.id,
                surfer_id: surferId,
                wave_score: w
            }));
            await supabase.from('scores').insert(scoreInserts);
        }

        await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heat.id);
    }

    // 2. Create Round 3 Heats
    console.log('Creating Round 3 Heats...');
    for (let i = 1; i <= 8; i++) {
        // Check if exists
        const { data: existing } = await supabase.from('heats').select('id').eq('event_id', EVENT_ID).eq('round_number', 3).eq('heat_number', i).single();
        let heatId = existing?.id;

        if (!heatId) {
            const { data: newHeat } = await supabase.from('heats').insert({
                event_id: EVENT_ID,
                round_number: 3,
                heat_number: i,
                status: 'UPCOMING'
            }).select().single();
            heatId = newHeat?.id;
        } else {
            // Clear old assignments if exists
            await supabase.from('heat_assignments').delete().eq('heat_id', heatId);
        }

        if (heatId) {
            const assignment = round3Assignments.find(a => a.heat_number === i);
            if (assignment) {
                for (const name of assignment.surfers) {
                    const surferId = surferMap[name];
                    if (surferId) {
                        await supabase.from('heat_assignments').insert({
                            heat_id: heatId,
                            surfer_id: surferId
                        });
                    } else {
                        console.error(`Surfer not found for assignment: ${name}`);
                    }
                }
            }
        }
    }

    // 3. Recalculate Points
    console.log('Recalculating Points...');

    // Get all completed heats
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

    // Update User Teams
    const { data: allTeams } = await supabase.from('user_teams').select('id, user_id, surfer_id').eq('event_id', EVENT_ID);
    const userTotals: Record<string, number> = {};

    for (const team of allTeams || []) {
        const surferPoints = surferTotals[team.surfer_id] || 0;
        await supabase.from('user_teams').update({ points: surferPoints }).eq('id', team.id);
        userTotals[team.user_id] = (userTotals[team.user_id] || 0) + surferPoints;
    }

    // Update Profiles
    for (const [uid, total] of Object.entries(userTotals)) {
        await supabase.from('profiles').update({ total_fantasy_points: total }).eq('id', uid);
    }

    console.log('--- PRODUCTION UPDATE COMPLETE ---');
}

updateProduction().catch(console.error);
