import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use service role key if available to list auth users
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log("Checking profiles...");
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('*');
    console.log("Profiles in DB:", profiles?.length);
    if (pErr) console.error("Profile Error:", pErr);

    // Need service role key to list users directly from auth. If we only have anon key, this will fail.
    // Test if we can list users:
    if (process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
        const { data: users, error: uErr } = await supabase.auth.admin.listUsers();
        console.log("Auth Users:", users?.users?.length);
        if (uErr) console.error("Auth Error:", uErr);
    } else {
        console.log("No service role key found. Cannot list auth.users directly.");
    }
}
run();
