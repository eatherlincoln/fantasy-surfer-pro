
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

async function debugElimination() {
    // 1. Fetch completed heats
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

    // 2. Fetch assignments
    const { data: assignments } = await supabase
        .from('heat_assignments')
        .select('surfer_id, heat_id, heat_score, surfers(name)')
        .in('heat_id', heatIds);

    if (!assignments) {
        console.log("No assignments found.");
        return;
    }

    // 3. Calculate ranks
    const heatGroups: Record<string, any[]> = {};
    assignments.forEach(a => {
        if (!heatGroups[a.heat_id]) heatGroups[a.heat_id] = [];
        heatGroups[a.heat_id].push(a);
    });

    const eliminated = new Set<string>();
    for (const hId in heatGroups) {
        const sorted = heatGroups[hId].sort((a, b) => (Number(b.heat_score) || 0) - (Number(a.heat_score) || 0));
        const numSurfers = sorted.length;
        
        sorted.forEach((a, index) => {
            const rank = index + 1;
            if (numSurfers === 4) {
                if (rank >= 3) eliminated.add(a.surfer_id);
            } else if (numSurfers === 2) {
                if (rank >= 2) eliminated.add(a.surfer_id);
            } else if (numSurfers === 3) {
                if (rank >= 2) eliminated.add(a.surfer_id);
            }
        });
    }

    console.log(`Total eliminated surfers found: ${eliminated.size}`);

    // Get all surfers in the event
    const { data: eventTeams } = await supabase.from('user_teams').select('surfer_id, surfers(name)').eq('event_id', EVENT_ID);
    const uniqueEventSurfers = new Map();
    eventTeams?.forEach(t => {
        if (t.surfer_id) uniqueEventSurfers.set(t.surfer_id, t.surfers?.name);
    });

    console.log(`Total unique surfers in event teams: ${uniqueEventSurfers.size}`);

    const notEliminated = [];
    for (const [id, name] of uniqueEventSurfers.entries()) {
        if (!eliminated.has(id)) {
            notEliminated.push(name);
        }
    }

    console.log("Surfers NOT marked as eliminated (should be just the winner):");
    console.log(notEliminated);
}

debugElimination().catch(console.error);
