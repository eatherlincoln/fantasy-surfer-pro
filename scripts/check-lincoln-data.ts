import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';

const supabase = createClient(PROD_URL, PROD_KEY);
const LINCOLN_ID = '11961dcb-20de-4b23-846f-a1a1567baa43';
const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

async function checkLincoln() {
    console.log(`Checking data for Lincoln (${LINCOLN_ID}) and event ${EVENT_ID}...`);
    
    const { data: teams, error } = await supabase
        .from('user_teams')
        .select('id, user_id, event_id, surfer_id, created_at')
        .eq('user_id', LINCOLN_ID)
        .eq('event_id', EVENT_ID);
    
    if (error) {
        console.error(error);
        return;
    }

    console.log(`Total rows for Lincoln: ${teams?.length}`);
    if (teams && teams.length > 0) {
        console.log("Unique surfer IDs:", new Set(teams.map(t => t.surfer_id)).size);
        console.log("Sample creation times:", teams.slice(0, 5).map(t => t.created_at));
    }

    // Check others
    const { data: others } = await supabase
        .from('user_teams')
        .select('user_id')
        .eq('event_id', EVENT_ID)
        .neq('user_id', LINCOLN_ID)
        .limit(10);
    console.log("Other users with teams (sample):", [...new Set(others?.map(o => o.user_id))]);
}

checkLincoln().catch(console.error);
