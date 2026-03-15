
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

async function resetAll() {
  console.log("--- Resetting All Surfer Images to Placeholders ---");
  
  const { data: surfers, error: fetchError } = await supabase
    .from('surfers')
    .select('id, name');

  if (fetchError) throw fetchError;

  for (const s of surfers) {
    const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random&size=200`;
    process.stdout.write(`Resetting ${s.name}... `);
    const { error: updateError } = await supabase
      .from('surfers')
      .update({ image: placeholder })
      .eq('id', s.id);
    
    if (updateError) console.log("Error:", updateError.message);
    else console.log("Done");
  }

  console.log("--- Reset Complete ---");
}

resetAll().catch(console.error);
