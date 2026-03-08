import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const email = `test-${Date.now()}@example.com`;
    const { data: authData, error: authErr } = await supabase.auth.signUp({
        email,
        password: 'password123'
    });
    console.log("Logged in:", authData?.user?.id);

    // Get an event to test with
    const { data: events } = await supabase.from('events').select().limit(1);
    const eventId = events[0].id;
    console.log("Using event:", eventId);

    const { data, error } = await supabase
        .from('heats')
        .select(`
            id,
            heat_assignments (
                surfers (*)
            )
        `)
        .eq('event_id', eventId);

    if (error) {
        console.error("Query Error:", error);
        return;
    }

    // Flatten and deduplicate
    const surfersMap = new Map();
    data.forEach((heat) => {
        heat.heat_assignments?.forEach((ha) => {
            if (ha.surfers) {
                surfersMap.set(ha.surfers.id, ha.surfers);
            }
        });
    });

    const surfers = Array.from(surfersMap.values());
    console.log(`Found ${surfers.length} unique surfers for this event.`);
    console.log("First 3:", surfers.slice(0, 3));
}

run();
