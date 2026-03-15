
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

function slugify(name: string) {
  return name.toLowerCase().replace(/['\s]/g, '-').replace(/-+/g, '-');
}

async function finalAudit() {
  console.log("--- Comprehensive Alignment Audit ---");
  const { data: surfers } = await supabase.from('surfers').select('name, image').eq('is_on_tour', true);
  
  const results = surfers.map(s => {
    const filename = s.image ? s.image.split('/').pop() : 'none';
    const expected = slugify(s.name) + '.png';
    const match = filename === expected;
    return { name: s.name, filename, expected, match };
  });

  console.table(results.filter(r => !r.match));
  console.log("\n--- Correct Alignments ---");
  console.table(results.filter(r => r.match));
}

finalAudit().catch(console.error);
