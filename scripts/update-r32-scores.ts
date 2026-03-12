import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

const results = [
    { name: "Bronson Meydi", w1: 4.60, w2: 3.87, status: 'Eliminated' },
    { name: "Jorgann Couzinet", w1: 6.00, w2: 3.20, status: 'Eliminated' },
    { name: "Imaikalani deVault", w1: 6.67, w2: 5.23, status: 'active' },
    { name: "Carlos Munoz", w1: 8.83, w2: 5.20, status: 'active' },
    { name: "Dakoda Walters", w1: 6.67, w2: 4.57, status: 'active' },
    { name: "Mihimana Braye", w1: 5.30, w2: 4.83, status: 'Eliminated' },
    { name: "Caleb Tancred", w1: 7.83, w2: 5.33, status: 'active' },
    { name: "Luke Thompson", w1: 6.00, w2: 4.80, status: 'Eliminated' },
    { name: "Mateus Herdy", w1: 8.07, w2: 6.83, status: 'Eliminated' },
    { name: "Finn McGill", w1: 8.30, w2: 8.00, status: 'active' },
    { name: "Alister Reginato", w1: 8.60, w2: 6.33, status: 'active' },
    { name: "Ian Gentil", w1: 5.50, w2: 0.93, status: 'Eliminated' },
    { name: "Adur Amatriain", w1: 5.00, w2: 3.10, status: 'Eliminated' },
    { name: "Dylan Moffat", w1: 5.77, w2: 5.50, status: 'active' },
    { name: "Oliver Zietz", w1: 5.93, w2: 2.83, status: 'Eliminated' },
    { name: "Eli Hanneman", w1: 4.67, w2: 4.50, status: 'active' },
    { name: "Ocean Lancaster", w1: 6.57, w2: 6.00, status: 'Eliminated' },
    { name: "Makana Franzmann", w1: 6.70, w2: 1.60, status: 'Eliminated' },
    { name: "Morgan Cibilic", w1: 7.50, w2: 6.60, status: 'active' },
    { name: "Shion Crawford", w1: 6.50, w2: 6.40, status: 'active' },
    { name: "Kauli Vaast", w1: 6.73, w2: 2.33, status: 'active' },
    { name: "Levi Slawson", w1: 7.17, w2: 6.33, status: 'active' },
    { name: "Reef Heazlewood", w1: 4.47, w2: 3.57, status: 'Eliminated' },
    { name: "Keoni Lasa", w1: 5.33, w2: 3.50, status: 'Eliminated' },
    { name: "Oscar Berry", w1: 4.40, w2: 3.87, status: 'Eliminated' },
    { name: "Callum Robson", w1: 5.73, w2: 5.33, status: 'active' },
    { name: "Dimitri Poulos", w1: 7.17, w2: 7.07, status: 'active' },
    { name: "Ben Lorentson", w1: 5.67, w2: 4.43, status: 'Eliminated' },
    { name: "Mikey McDonagh", w1: 6.77, w2: 5.93, status: 'Eliminated' },
    { name: "Jackson Bunch", w1: 7.50, w2: 7.50, status: 'active' },
    { name: "Lucas Cassity", w1: 6.90, w2: 6.30, status: 'active' },
    { name: "Lucas Silveira", w1: 5.77, w2: 5.67, status: 'Eliminated' }
];

async function updateScores() {
    const eventId = '79fb2722-23b5-45b2-b88b-79177f2b8199';
    console.log("Matching surfers and updating scores...");

    const resultsMap = new Map(results.map(r => [r.name.toLowerCase(), r]));
    const heatIdsToComplete = new Set<string>();

    const { data: assignments, error: assError } = await supabase
        .from('heat_assignments')
        .select(`
            id,
            heat_id,
            surfer_id,
            surfers (name)
        `)
        .eq('surfers.is_on_tour', true); // Filter if possible, otherwise just get all

    if (assError) throw assError;

    for (const assignment of (assignments as any[])) {
        const surferName = assignment.surfers?.name;
        if (!surferName) continue;

        const res = resultsMap.get(surferName.toLowerCase());
        if (!res) continue;

        const totalScore = res.w1 + res.w2;
        heatIdsToComplete.add(assignment.heat_id);

        console.log(`Updating ${surferName} - Score: ${totalScore.toFixed(2)}, Status: ${res.status}`);

        // 1. Update heat_assignments
        await supabase
            .from('heat_assignments')
            .update({ heat_score: totalScore })
            .eq('id', assignment.id);

        // 2. Insert into scores
        await supabase.from('scores').delete().eq('heat_id', assignment.heat_id).eq('surfer_id', assignment.surfer_id); // Clean old
        await supabase.from('scores').insert([
            { heat_id: assignment.heat_id, surfer_id: assignment.surfer_id, wave_score: res.w1 },
            { heat_id: assignment.heat_id, surfer_id: assignment.surfer_id, wave_score: res.w2 }
        ]);

        // 3. Update surfer
        await supabase.from('surfers')
            .update({ status: res.status })
            .eq('id', assignment.surfer_id);

        // 4. Update points for user teams
        const { data: userTeams } = await supabase.from('user_teams').select('id, user_id, points').eq('surfer_id', assignment.surfer_id).eq('event_id', eventId);
        if (userTeams) {
            for (const team of userTeams) {
                // IMPORTANT: In a real system we'd check if points were already added. 
                // For this migration/update, we'll just set it to the total score (assuming this is their first round scoring).
                // Or better, add the score.
                await supabase.from('user_teams').update({ points: totalScore }).eq('id', team.id);

                // Update profile
                const { data: profile } = await supabase.from('profiles').select('total_fantasy_points').eq('id', team.user_id).single();
                const newProfilePoints = (profile?.total_fantasy_points || 0) + totalScore;
                await supabase.from('profiles').update({ total_fantasy_points: newProfilePoints }).eq('id', team.user_id);
            }
        }
    }

    // Mark updated heats as COMPLETED
    console.log(`Marking ${heatIdsToComplete.size} heats as COMPLETED...`);
    for (const hId of heatIdsToComplete) {
        await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', hId);
    }

    console.log("Done!");
}

updateScores().catch(console.error);
