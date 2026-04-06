
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function research() {
    console.log("--- Researching Bells Beach Event Data ---");

    // 1. Get Event
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id, name, slug')
        .ilike('name', '%Bells Beach%')
        .single();

    if (eventError || !event) {
        console.error("Error finding event:", eventError);
        return;
    }
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

    // 3. Get Assignments for first few heats to verify
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

    console.log("Assignments summary (first 10):");
    assignments?.slice(0, 10).forEach(a => {
        console.log(`Round ${a.heats.round_number} Heat ${a.heats.heat_number}: ${a.surfers.name} (Score: ${a.heat_score || 'N/A'})`);
    });

    // 4. Check for Xavier Huxtable
    const { data: xavier } = await supabase.from('surfers').select('id, name').ilike('name', '%Xavier Huxtable%').single();
    if (xavier) {
        console.log(`Xavier Huxtable found: ${xavier.id}`);
    } else {
        console.log("Xavier Huxtable NOT found. We might need to add him or replace 'Wildcard'.");
    }
}

research().catch(console.error);
