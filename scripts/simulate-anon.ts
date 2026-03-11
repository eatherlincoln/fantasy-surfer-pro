import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const ANON_KEY = 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH'; // From .env.local

const supabase = createClient(PROD_URL, ANON_KEY);
const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

async function simulateAnon() {
    console.log("--- Simulating ANON Data Fetch ---");
    
    // 1. Fetch some profiles
    console.log("Fetching profiles...");
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, username').limit(5);
    if (pErr) {
        console.error("Profiles Error:", pErr);
        if (pErr.message.includes('Invalid API key')) {
            console.log("CRITICAL: The ANON key in .env.local does NOT match the PROD_URL project.");
        }
    } else {
        console.log("Profiles Accessible:", profiles.length);
    }

    // 2. Fetch team counts for these profiles
    if (profiles && profiles.length > 0) {
        const ids = profiles.map(p => p.id);
        console.log(`Fetching team counts for ${ids.length} users...`);
        const { data: teams, error: tErr } = await supabase
            .from('user_teams')
            .select('user_id')
            .eq('event_id', EVENT_ID)
            .in('user_id', ids);
        
        if (tErr) console.error("Teams Error:", tErr);
        else console.log(`Found ${teams?.length || 0} user_teams rows.`);
    }

    // 3. Try to fetch a roster for one of the users who HAS a team (Lincoln: 11961dcb-20de-4b23-846f-a1a1567baa43)
    const lincolnId = '11961dcb-20de-4b23-846f-a1a1567baa43';
    console.log(`Simulating roster fetch for Lincoln (${lincolnId})...`);
    const { data: roster, error: rErr } = await supabase
        .from('user_teams')
        .select(`
          surfer_id,
          surfers (
            id,
            name
          )
        `)
        .eq('user_id', lincolnId)
        .eq('event_id', EVENT_ID);
    
    if (rErr) console.error("Roster Error:", rErr);
    else console.log(`Roster for Lincoln: ${roster?.length || 0} surfers.`);
}

simulateAnon().catch(console.error);
