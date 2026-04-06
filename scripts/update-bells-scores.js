
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = 'fd9db346-de83-46ee-9331-036c8d8ce89d';

const results = {
    round1: [
        { heat: 1, surfers: [
            { name: "Mateus Herdy", total: 13.80, w1: 7.17, w2: 6.63, status: 'active' },
            { name: "Liam O'Brien", total: 13.24, w1: 7.17, w2: 6.07, status: 'active' }
        ]},
        { heat: 2, surfers: [
            { name: "Oscar Berry", total: 6.30, w1: 3.50, w2: 2.80, status: 'active' },
            { name: "Dane Henry", total: 13.66, w1: 7.83, w2: 5.83, status: 'active' }
        ]},
        { heat: 3, surfers: [
            { name: "Luke Thompson", total: 14.67, w1: 7.67, w2: 7.00, status: 'active' },
            { name: "Ramzi Boukhaim", total: 12.00, w1: 6.17, w2: 5.83, status: 'active' }
        ]},
        { heat: 4, surfers: [
            { name: "Callum Robson", total: 10.27, w1: 6.47, w2: 3.80, status: 'active' },
            { name: "Xavier Huxtable", total: 12.94, w1: 6.77, w2: 6.17, status: 'active' }
        ]}
    ],
    round2: [
        { heat: 1, surfers: [
            { name: "Miguel Pupo", total: 14.17, status: 'active' },
            { name: "Joel Vaughan", total: 12.07, status: 'ELIMINATED' }
        ]},
        { heat: 2, surfers: [
            { name: "Ethan Ewing", total: 12.34, status: 'ELIMINATED' },
            { name: "George Pittar", total: 14.57, status: 'active' }
        ]},
        { heat: 3, surfers: [
            { name: "Jordy Smith", total: 14.80, status: 'active' },
            { name: "Luke Thompson", total: 12.33, status: 'ELIMINATED' }
        ]},
        { heat: 4, surfers: [
            { name: "Barron Mamiya", total: 11.16, status: 'active' },
            { name: "Seth Moniz", total: 9.93, status: 'ELIMINATED' }
        ]},
        { heat: 5, surfers: [
            { name: "Jake Marshall", total: 10.83, status: 'active' },
            { name: "Joao Chianca", total: 10.64, status: 'ELIMINATED' }
        ]},
        { heat: 6, surfers: [
            { name: "Griffin Colapinto", total: 15.26, status: 'active' },
            { name: "Dane Henry", total: 15.00, status: 'ELIMINATED' }
        ]},
        { heat: 7, surfers: [
            { name: "Cole Houshman", total: 7.63, status: 'ELIMINATED' },
            { name: "Alejo Muniz", total: 11.56, status: 'active' }
        ]}
    ]
};

async function updateScores() {
    console.log("--- Updating Bells Beach Scores ---");

    const { data: surfers } = await supabase.from('surfers').select('id, name');
    const surferMap = new Map(surfers.map(s => [s.name.toLowerCase(), s.id]));

    for (const round of ['round1', 'round2']) {
        const roundNum = round === 'round1' ? 1 : 2;
        
        for (const h of results[round]) {
            console.log(`Processing R${roundNum} Heat ${h.heat}...`);
            
            // Get or create heat
            let { data: heat } = await supabase.from('heats')
                .select('id')
                .eq('event_id', EVENT_ID)
                .eq('round_number', roundNum)
                .eq('heat_number', h.heat)
                .single();

            if (!heat) {
                 const { data: newHeat } = await supabase.from('heats')
                    .insert({ event_id: EVENT_ID, round_number: roundNum, heat_number: h.heat, status: 'UPCOMING' })
                    .select().single();
                 heat = newHeat;
            }

            // Clean assignments first
            await supabase.from('heat_assignments').delete().eq('heat_id', heat.id);

            for (const s of h.surfers) {
                const surferId = surferMap.get(s.name.toLowerCase());
                if (!surferId) {
                    console.error(`Surfer not found: ${s.name}`);
                    continue;
                }

                // Insert assignment
                await supabase.from('heat_assignments').insert({
                    heat_id: heat.id,
                    surfer_id: surferId,
                    heat_score: s.total
                });

                // Insert scores
                await supabase.from('scores').delete().eq('heat_id', heat.id).eq('surfer_id', surferId);
                let w1 = s.w1 || s.total / 2;
                let w2 = s.w2 || s.total / 2;
                await supabase.from('scores').insert([
                    { heat_id: heat.id, surfer_id: surferId, wave_score: w1 },
                    { heat_id: heat.id, surfer_id: surferId, wave_score: w2 }
                ]);

                // Update status
                await supabase.from('surfers').update({ status: s.status }).eq('id', surferId);
                
                // Update team points
                await updatePointsForSurfer(surferId);
            }

            // Mark heat as COMPLETED
            await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heat.id);
        }
    }
    console.log("Done!");
}

async function updatePointsForSurfer(surferId) {
    // Get total points from all assignments in this event
    const { data: assignments } = await supabase.from('heat_assignments')
        .select('heat_score, heat:heats!inner(event_id)')
        .eq('surfer_id', surferId)
        .eq('heats.event_id', EVENT_ID);
    
    const totalPoints = assignments?.reduce((sum, a) => sum + (a.heat_score || 0), 0) || 0;

    const { data: teams } = await supabase.from('user_teams')
        .select('id, user_id')
        .eq('surfer_id', surferId)
        .eq('event_id', EVENT_ID);
        
    if (teams && teams.length > 0) {
        for (const team of teams) {
            await supabase.from('user_teams').update({ points: totalPoints }).eq('id', team.id);
            
            // Recalculate full profile points based on all user_teams
            const { data: allTeams } = await supabase.from('user_teams').select('points').eq('user_id', team.user_id);
            const profileTotal = allTeams?.reduce((sum, t) => sum + (t.points || 0), 0) || 0;
            await supabase.from('profiles').update({ total_fantasy_points: profileTotal }).eq('id', team.user_id);
        }
    }
}

updateScores().catch(console.error);
