import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321',
    process.env.VITE_SUPABASE_ANON_KEY || ''
);

async function test() {
    try {
        const { data: events } = await supabase.from('events').select('id').limit(1);
        if (!events || events.length === 0) return;

        const eventId = events[0].id;

        console.log("Fetching Admin Heats payload...");
        const { data: heats, error } = await supabase
            .from('heats')
            .select(`
                *,
                heat_assignments (
                    surfer_id,
                    surfers (
                        id,
                        name
                    )
                ),
                scores (
                    surfer_id,
                    wave_score
                )
            `)
            .eq('event_id', eventId)
            .eq('heat_number', 1)
            .limit(1);

        console.log("Admin Heat 1 Payload:");
        console.log(JSON.stringify(heats?.[0] || {}, null, 2));

    } catch (e) {
        console.error(e);
    }
}

test();
