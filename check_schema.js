
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
);
async function run() {
  const { data, error } = await supabase.from("site_settings").select("*").limit(1);
  if (error) console.error(error);
  else if (data && data.length > 0) console.log(Object.keys(data[0]));
  else {
    // try to insert an empty row to see what fails or returns
    const { data: d2, error: e2 } = await supabase.from("site_settings").insert({}).select();
    if (e2) console.error(e2);
    else console.log(Object.keys(d2[0]));
  }
}
run();

