
import { createClient } from '@supabase/supabase-js';
const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

async function research() {
    console.log("--- Researching Bells Beach Event Data ---");

    // 1. Get Event
    const { data: events, error: eventError } = await supabase
        .from('events')
        .select('id, name, slug')
        .ilike('name', '%Bells Beach%');

    if (eventError || !events || events.length === 0) {
        console.error("Error finding event:", eventError || "No event found.");
        return;
    }
    const event = events[0];
    console.log(`Event Found: ${event.name} (${event.id})`);

    // 2. Get Heats
    const { data: heats, error: heatsError } = await supabase
        .from('heats')
        .select('id, round_number, heat_number, status')
        .eq('event_id', event.id)
        .order('round_number', { ascending: true })
        .order('heat_number', { ascending: true });

    if (heatsError) {
        console.error("Error finding heats:", heatsError);
        return;
    }
    console.log(`Found ${heats.length} heats.`);

    // 3. Get Assignments
    const { data: assignments, error: assError } = await supabase
        .from('heat_assignments')
        .select(`
            id,
            heat_id,
            surfer_id,
            heat_score,
            heats (round_number, heat_number),
            surfers (name)
        `)
        .in('heat_id', heats.map(h => h.id));

    if (assError) {
        console.error("Error finding assignments:", assError);
        return;
    }

    console.log("Assignments summary (first 20):");
    assignments?.sort((a, b) => {
        if (a.heats.round_number !== b.heats.round_number) return a.heats.round_number - b.heats.round_number;
        return a.heats.heat_number - b.heats.heat_number;
    }).slice(0, 20).forEach(a => {
        console.log(`Round ${a.heats.round_number} Heat ${a.heats.heat_number}: ${a.surfers.name} (Score: ${a.heat_score || 'N/A'})`);
    });

    // 4. Check for Xavier Huxtable
    const { data: xavier } = await supabase.from('surfers').select('id, name').ilike('name', '%Xavier Huxtable%');
    if (xavier && xavier.length > 0) {
        console.log(`Xavier Huxtable found: ${xavier[0].id}`);
    } else {
        console.log("Xavier Huxtable NOT found.");
    }
}

research().catch(console.error);
