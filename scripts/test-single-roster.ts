import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';

const supabase = createClient(PROD_URL, PROD_KEY);

const USER_ID = '7c30e2ca-4263-46ab-88e1-82edd5e43d78'; // From user's screenshot
const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

async function testQuery() {
    console.log(`Testing roster fetch for user ${USER_ID} event ${EVENT_ID}...`);
    
    const { data, error } = await supabase
        .from('user_teams')
        .select(`
      surfer_id,
      points,
      surfers (
        id,
        name,
        tier,
        value,
        country,
        image
      )
    `)
        .eq('user_id', USER_ID)
        .eq('event_id', EVENT_ID);

    if (error) {
        console.error("QUERY ERROR:", error);
    } else {
        console.log(`Success! Found ${data?.length} surfers.`);
        console.log("Sample row:", JSON.stringify(data?.[0], null, 2));
    }

    // Try without the join
    console.log("\nTesting WITHOUT join...");
    const { data: raw, error: rErr } = await supabase
        .from('user_teams')
        .select('*')
        .eq('user_id', USER_ID)
        .eq('event_id', EVENT_ID);
    
    if (rErr) console.error("RAW ERROR:", rErr);
    else console.log(`Raw success! Found ${raw?.length} rows.`);
}

testQuery().catch(console.error);
