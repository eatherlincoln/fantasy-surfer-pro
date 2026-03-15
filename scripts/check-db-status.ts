
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

async function checkStatus() {
    const { data: events } = await supabase.from('events').select('*').order('start_date', { ascending: false }).limit(5);
    console.log("Recent Events:");
    events?.forEach(e => console.log(`${e.id}: ${e.name} (${e.status})`));

    if (events && events.length > 0) {
        const eventId = events[0].id; // Most recent
        console.log(`\nChecking Heats for event: ${events[0].name} (${eventId})`);
        
        const { data: heats } = await supabase.from('heats')
            .select('id, round_number, heat_number, status')
            .eq('event_id', eventId)
            .order('round_number', { ascending: true })
            .order('heat_number', { ascending: true });
        
        heats?.forEach(h => {
            console.log(`Rd ${h.round_number} Heat ${h.heat_number}: ${h.status}`);
        });
    }
}

checkStatus().catch(console.error);
