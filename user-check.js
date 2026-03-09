import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: authUsers, error: err1 } = await supabase.auth.admin.listUsers();
  console.log("Auth Users:", authUsers?.users?.length, err1?.message);
  
  const { data: profileUsers, error: err2 } = await supabase.from('profiles').select('*');
  console.log("Profile Users:", profileUsers?.length, err2?.message);
}
check();
