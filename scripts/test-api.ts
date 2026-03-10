import { supabase } from '../services/supabase.ts';
import { getEventSurfers } from '../services/adminService.ts';

async function test() {
    console.log("Fetching live surfers...");
    try {
        const { data: events } = await supabase.from('events').select('id').limit(1);
        if (!events || events.length === 0) return;

        const eventId = events[0].id;
        const liveSurfers = await getEventSurfers(eventId);

        const walters = liveSurfers.find((s: any) => s.name === 'Dakoda Walters');
        console.log("Dakoda Walters payload:", JSON.stringify(walters, null, 2));

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

        console.log("Admin Heat 1 Payload:", JSON.stringify(heats?.[0] || {}, null, 2));

    } catch (e) {
        console.error(e);
    }
}

test();
