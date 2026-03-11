import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';

const supabase = createClient(PROD_URL, PROD_KEY);

async function check() {
    const { data: events } = await supabase.from('events').select('id, name, status, is_current, start_date');
    console.log("All Events:", JSON.stringify(events, null, 2));

    const { data: teamStats } = await supabase.rpc('get_team_event_counts');
    // If we don't have RPC, let's just group by event_id in user_teams manually
    const { data: allTeams } = await supabase.from('user_teams').select('event_id').limit(1000);
    const groups: Record<string, number> = {};
    allTeams?.forEach(t => {
      groups[t.event_id] = (groups[t.event_id] || 0) + 1;
    });
    console.log("User Teams distribution:", groups);
}

check().catch(console.error);
