import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';

const supabase = createClient(PROD_URL, PROD_KEY);
const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

async function findEliminated() {
    console.log("--- Identifying Eliminated Surfers ---");

    // 1. Fetch all completed heats for this event
    const { data: heats } = await supabase
        .from('heats')
        .select('id, round_number, heat_number')
        .eq('event_id', EVENT_ID)
        .eq('status', 'COMPLETED');

    if (!heats || heats.length === 0) {
        console.log("No completed heats found.");
        return;
    }

    const heatIds = heats.map(h => h.id);

    // 2. Fetch all assignments for these heats
    const { data: assignments } = await supabase
        .from('heat_assignments')
        .select(`
            surfer_id,
            heat_id,
            heat_score,
            surfers ( name )
        `)
        .in('heat_id', heatIds);

    if (!assignments) return;

    // 3. Group by heat and calculate ranks
    const heatGroups: Record<string, any[]> = {};
    assignments.forEach(a => {
        if (!heatGroups[a.heat_id]) heatGroups[a.heat_id] = [];
        heatGroups[a.heat_id].push(a);
    });

    const eliminatedSurferIds = new Set<string>();
    const eliminatedNames: string[] = [];

    for (const heatId in heatGroups) {
        const sorted = heatGroups[heatId].sort((a, b) => (b.heat_score || 0) - (a.heat_score || 0));
        const heat = heats.find(h => h.id === heatId);
        
        sorted.forEach((a, index) => {
            const rank = index + 1;
            // Rule: 3rd or 4th is knocked out
            // EXCEPT in Round 1 where sometimes they advance or go to Round 2
            // But let's follow user's simple rule for now: 3rd/4th = OUT
            if (rank >= 3) {
                eliminatedSurferIds.add(a.surfer_id);
                eliminatedNames.push(`${a.surfers.name} (Rank ${rank} in R${heat?.round_number} H${heat?.heat_number})`);
            }
        });
    }

    console.log(`Found ${eliminatedSurferIds.size} unique eliminated surfers.`);
    console.log("Samples:", eliminatedNames.slice(0, 10));
}

findEliminated().catch(console.error);
