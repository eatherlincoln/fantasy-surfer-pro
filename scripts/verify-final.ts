import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';

const supabase = createClient(PROD_URL, PROD_KEY);
const LINCOLN_ID = '11961dcb-20de-4b23-846f-a1a1567baa43';
const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

async function verify() {
    console.log("--- Post-SQL Verification ---");
    
    // 1. Check Lincoln's count
    const { count: lCount } = await supabase
        .from('user_teams')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', LINCOLN_ID)
        .eq('event_id', EVENT_ID);
    
    console.log(`Lincoln's team count: ${lCount} (Should be 10)`);

    // 2. Check total counts Map for some users
    const { data: teams } = await supabase
        .from('user_teams')
        .select('user_id')
        .eq('event_id', EVENT_ID);
    
    const counts: Record<string, number> = {};
    teams?.forEach(t => {
        counts[t.user_id] = (counts[t.user_id] || 0) + 1;
    });

    console.log(`Total users with teams: ${Object.keys(counts).length}`);
    console.log("Sample user counts:", Object.entries(counts).slice(0, 5));
}

verify().catch(console.error);
