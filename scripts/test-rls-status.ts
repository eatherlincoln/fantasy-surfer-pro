import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';

const supabase = createClient(PROD_URL, PROD_KEY);

async function listPolicies() {
    console.log("--- Listing All Policies on user_teams ---");
    
    // We can't query pg_policies directly via supabase-js REST,
    // but we can try to find them by looking at common metadata Or 
    // simply testing if we can see other users data via service role (should always work)
    // and then as anon.

    // Let's check for any RPC that might list policies
    const { data: policies, error } = await supabase.rpc('get_policies_verbose', { target_table: 'user_teams' });
    if (error) {
        console.log("RPC get_policies_verbose not found. Checking if we have common Postgres functions...");
    } else {
        console.log("Policies:", JSON.stringify(policies, null, 2));
    }

    // Since we don't know the exact RPC name, let's try a different approach:
    // Check if the anon user can see Lincoln's team.
    const LINCOLN_ID = '11961dcb-20de-4b23-846f-a1a1567baa43';
    const ANON_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'; // verified earlier
    const anonSupabase = createClient(PROD_URL, ANON_KEY);

    console.log(`Checking if ANON can see Lincoln's team (ID: ${LINCOLN_ID})...`);
    const { data: anonData, error: anonErr } = await anonSupabase
        .from('user_teams')
        .select('user_id')
        .eq('user_id', LINCOLN_ID)
        .limit(1);
    
    if (anonErr) console.error("ANON Error:", anonErr);
    else if (anonData && anonData.length > 0) console.log("SUCCESS: ANON can see Lincoln's team. RLS is likely open.");
    else console.log("FAILURE: ANON cannot see Lincoln's team. RLS is still blocking.");

    // Check if service role can see it
    const { data: srData } = await supabase
        .from('user_teams')
        .select('user_id')
        .limit(1);
    console.log("Service Role check:", srData?.length ? "Success" : "Empty");
}

listPolicies().catch(console.error);
