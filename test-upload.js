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
    if (authErr) return console.error("Auth Error:", authErr);
    console.log("Logged in:", authData.user.id);

    // Get an event to test with
    const { data: events } = await supabase.from('events').select().limit(1);
    if (!events || events.length === 0) return console.log("No events");
    const eventId = events[0].id;
    console.log("Using event:", eventId);

    // Create a surfer and a heat
    const { data: surfer } = await supabase.from('surfers').insert({ name: 'Del Test Surfer', flag: '🏳️' }).select().single();
    const { data: heat } = await supabase.from('heats').insert({ event_id: eventId, round_number: 99, heat_number: 99 }).select().single();

    // Create an assignment
    await supabase.from('heat_assignments').insert({ heat_id: heat.id, surfer_id: surfer.id });
    // Create a score
    await supabase.from('scores').insert({ heat_id: heat.id, surfer_id: surfer.id, wave_score: 9.99 });
    console.log("Created heat with assignment and score:", heat.id);

    // Attempt to delete heat
    const { data: delHeat, error: delHeatErr } = await supabase.from('heats').delete().eq('id', heat.id).select();

    if (delHeatErr) {
        console.error("Heat Delete Error:", delHeatErr);
    } else {
        console.log("Heat Deleted Successfully:", delHeat);
    }
}

run();
