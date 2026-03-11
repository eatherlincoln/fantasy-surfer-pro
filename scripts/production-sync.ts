
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const PROD_URL = process.env.SUPABASE_URL;
const PROD_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!PROD_URL || !PROD_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment');
}

const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

const round2ParsedData = [
    {
        heat_number: 1,
        surfers: [
            { name: 'Samuel Pupo', waves: [6.47, 5.83] },
            { name: 'Bronson Meydi', waves: [7.53, 7.33] },
            { name: 'Shohei Kato', waves: [6.03, 4.83] },
            { name: 'Dakoda Walters', waves: [7.07, 6.67] }
        ]
    },
    {
        heat_number: 2,
        surfers: [
            { name: 'Jorgann Couzinet', waves: [6.87, 6.67] },
            { name: 'Hiroto Ohhara', waves: [6.10, 5.67] },
            { name: 'Ryan Huckabee', waves: [4.57, 4.53] },
            { name: 'Mihimana Braye', waves: [6.63, 5.50] }
        ]
    },
    {
        heat_number: 3,
        surfers: [
            { name: 'Winter Vincent', waves: [5.50, 5.00] },
            { name: 'Michael Rodrigues', waves: [5.57, 5.00] },
            { name: 'Imaikalani deVault', waves: [5.73, 5.70] },
            { name: 'Caleb Tancred', waves: [6.50, 5.10] }
        ]
    },
    {
        heat_number: 4,
        surfers: [
            { name: 'Luke Thompson', waves: [5.93, 5.93] },
            { name: 'Lucca Mesinas', waves: [5.33, 5.17] },
            { name: 'Carlos Munoz', waves: [6.17, 5.00] },
            { name: 'Lennix Smith', waves: [4.83, 2.70] }
        ]
    },
    {
        heat_number: 5,
        surfers: [
            { name: 'Mateus Herdy', waves: [6.40, 6.00] },
            { name: 'Adur Amatriain', waves: [6.67, 5.17] },
            { name: 'Edgard Groggia', waves: [3.57, 3.33] },
            { name: 'Eden Hasson', waves: [7.00, 4.70] }
        ]
    },
    {
        heat_number: 6,
        surfers: [
            { name: 'Liam O\'Brien', waves: [4.83, 3.93] },
            { name: 'Nolan Rapoza', waves: [6.07, 3.90] },
            { name: 'Finn McGill', waves: [5.63, 5.50] },
            { name: 'Dylan Moffat', waves: [7.33, 3.73] }
        ]
    },
    {
        heat_number: 7,
        surfers: [
            { name: 'Jordan Lawler', waves: [5.57, 4.50] },
            { name: 'Xavier Huxtable', waves: [5.67, 4.90] },
            { name: 'Oliver Zietz', waves: [6.93, 6.17] },
            { name: 'Alister Reginato', waves: [6.60, 4.93] }
        ]
    },
    {
        heat_number: 8,
        surfers: [
            { name: 'Eli Hanneman', waves: [7.00, 6.43] },
            { name: 'Riaru Ito', waves: [6.17, 4.67] },
            { name: 'Ian Gentil', waves: [6.77, 5.00] },
            { name: 'Willem Watson', waves: [4.40, 4.37] }
        ]
    },
    {
        heat_number: 9,
        surfers: [
            { name: 'Kauli Vaast', waves: [7.00, 6.50] },
            { name: 'Ryan Callinan', waves: [6.10, 5.67] },
            { name: 'Kyuss King', waves: [6.00, 3.67] },
            { name: 'Ocean Lancaster', waves: [8.33, 6.83] }
        ]
    }
];

async function syncToProduction() {
    console.log('--- STARTING PRODUCTION SYNC ---');

    // 1. Set Event Active
    await supabase.from('events').update({ is_current: false }).neq('id', EVENT_ID);
    await supabase.from('events').update({ is_current: true, status: 'LIVE' }).eq('id', EVENT_ID);
    console.log('Event activated.');

    // 2. Fetch Surfer Mapping
    const { data: surferData } = await supabase.from('surfers').select('id, name');
    const surferMap: Record<string, string> = {};
    surferData?.forEach(s => surferMap[s.name] = s.id);

    // 3. Finalize Round 1 (Heats 1-8)
    const { data: r1Heats } = await supabase.from('heats').select('id, heat_number').eq('event_id', EVENT_ID).eq('round_number', 1);
    for (const heat of r1Heats || []) {
        console.log(`Finalizing Round 1 Heat ${heat.heat_number}...`);
        const { data: scores } = await supabase.from('scores').select('*').eq('heat_id', heat.id);
        const { data: assignments } = await supabase.from('heat_assignments').select('surfer_id').eq('heat_id', heat.id);

        for (const assign of assignments || []) {
            const surferId = assign.surfer_id;
            const surferScores = scores?.filter(s => s.surfer_id === surferId).map(s => Number(s.wave_score)) || [];
            const heatTotal = surferScores.sort((a, b) => b - a).slice(0, 2).reduce((sum, val) => sum + val, 0);

            await supabase.from('heat_assignments').update({ heat_score: heatTotal }).eq('heat_id', heat.id).eq('surfer_id', surferId);
            await distributePoints(surferId, heatTotal);
        }
        await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heat.id);
    }

    // 4. Update and Finalize Round 2 (Heats 1-9)
    const { data: r2Heats } = await supabase.from('heats').select('id, heat_number').eq('event_id', EVENT_ID).eq('round_number', 2);
    for (const heat of r2Heats || []) {
        const parsed = round2ParsedData.find(p => p.heat_number === heat.heat_number);
        if (!parsed) continue;

        console.log(`Updating and Finalizing Round 2 Heat ${heat.heat_number}...`);

        // Clear old assignments/scores for these heats
        await supabase.from('heat_assignments').delete().eq('heat_id', heat.id);
        await supabase.from('scores').delete().eq('heat_id', heat.id);

        for (const s of parsed.surfers) {
            const surferId = surferMap[s.name];
            if (!surferId) {
                console.error(`Surfer not found: ${s.name}`);
                continue;
            }

            await supabase.from('heat_assignments').insert({ heat_id: heat.id, surfer_id: surferId });

            const scoreInserts = s.waves.map(w => ({ heat_id: heat.id, surfer_id: surferId, wave_score: w }));
            await supabase.from('scores').insert(scoreInserts);

            const heatTotal = s.waves.reduce((sum, val) => sum + val, 0);
            await supabase.from('heat_assignments').update({ heat_score: heatTotal }).eq('heat_id', heat.id).eq('surfer_id', surferId);

            await distributePoints(surferId, heatTotal);
        }
        await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heat.id);
    }

    // 5. Final Surfer Points Update
    console.log('Recalculating all surfer season points...');
    for (const sName in surferMap) {
        const surferId = surferMap[sName];
        const { data: allScores } = await supabase.from('scores').select('heat_id, wave_score').eq('surfer_id', surferId);
        const heatScores: Record<string, number[]> = {};
        allScores?.forEach(sc => {
            if (!heatScores[sc.heat_id]) heatScores[sc.heat_id] = [];
            heatScores[sc.heat_id].push(Number(sc.wave_score));
        });
        let seasonTotal = 0;
        for (const hId in heatScores) {
            const topWaves = heatScores[hId].sort((a, b) => b - a).slice(0, 2);
            seasonTotal += topWaves.reduce((sum, val) => sum + val, 0);
        }
        await supabase.from('surfers').update({ current_season_points: seasonTotal }).eq('id', surferId);
    }

    console.log('--- PRODUCTION SYNC SUCCESSFUL ---');
}

async function distributePoints(surferId: string, points: number) {
    const { data: teams } = await supabase.from('user_teams').select('*').eq('surfer_id', surferId).eq('event_id', EVENT_ID);
    for (const team of teams || []) {
        const newPoints = (Number(team.points) || 0) + points;
        await supabase.from('user_teams').update({ points: newPoints }).eq('id', team.id);

        const { data: profile } = await supabase.from('profiles').select('total_fantasy_points').eq('id', team.user_id).single();
        if (profile) {
            await supabase.from('profiles').update({ total_fantasy_points: (Number(profile.total_fantasy_points) || 0) + points }).eq('id', team.user_id);
        }
    }
}

syncToProduction().catch(console.error);
