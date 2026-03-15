
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

async function verifySecurity() {
    console.log("--- Security Verification ---");
    
    // 1. Check if we can find an admin
    const { data: admins } = await supabase.from('profiles').select('username').eq('is_admin', true);
    console.log("Admins found:", admins?.length || 0);

    // 2. Check for public data visibility
    const { data: surfers } = await supabase.from('surfers').select('name').limit(3);
    console.log("Public data (surfers) visible:", !!surfers);

    // 3. Check for any leaking fields in profiles (like emails or something else sensitive)
    const { data: profiles } = await supabase.from('profiles').select('*').limit(1);
    const leakedFields = Object.keys(profiles?.[0] || {}).filter(k => k.includes('email') || k.includes('password'));
    console.log("Sensitive field leaks in profiles:", leakedFields.length > 0 ? leakedFields : "None");
}

verifySecurity().catch(console.error);
