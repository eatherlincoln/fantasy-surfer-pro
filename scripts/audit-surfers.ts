
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

async function auditSurfers() {
    // 1. Get all surfers in user_teams for this event
    const { data: teamSurfers } = await supabase
        .from('user_teams')
        .select('surfer_id, surfers(name)')
        .eq('event_id', EVENT_ID);

    const teamSurferIds = new Set(teamSurfers?.map(ts => ts.surfer_id));
    console.log(`Unique surfers in teams for this event: ${teamSurferIds.size}`);

    // 2. Get all surfers in heat_assignments for any heat in this event
    const { data: heats } = await supabase.from('heats').select('id').eq('event_id', EVENT_ID);
    const heatIds = heats?.map(h => h.id) || [];

    const { data: assignedSurfers } = await supabase
        .from('heat_assignments')
        .select('surfer_id')
        .in('heat_id', heatIds);

    const assignedIds = new Set(assignedSurfers?.map(as => as.surfer_id));
    console.log(`Unique surfers in heat assignments for this event: ${assignedIds.size}`);

    // 3. Find surfers in teams but not in heats
    const missingFromHeats = [];
    for (const id of teamSurferIds) {
        if (!assignedIds.has(id)) {
            const name = teamSurfers?.find(ts => ts.surfer_id === id)?.surfers?.name;
            missingFromHeats.push({ id, name });
        }
    }

    if (missingFromHeats.length > 0) {
        console.log(`\nFound ${missingFromHeats.length} surfers in teams who are MISSING from all heat assignments:`);
        missingFromHeats.forEach(s => console.log(`- ${s.name} (${s.id})`));
        console.log("\nThese surfers will NEVER be marked as eliminated by the current logic.");
    } else {
        console.log("\nAll surfers in teams have heat assignments.");
    }
}

auditSurfers().catch(console.error);
