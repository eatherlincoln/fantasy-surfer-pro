import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: leagues, error: lError } = await supabase.from('leagues').select('*');
  console.log("Leagues:", leagues?.length, "Error:", lError);

  const { data: members, error: mError } = await supabase.from('league_members').select('*');
  console.log("League Members:", members?.length, "Error:", mError);

  const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
  console.log("Profiles:", profiles?.length, "Error:", pError);
}
run();
