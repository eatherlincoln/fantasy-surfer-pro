
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

function slugify(name: string) {
  return name.toLowerCase().replace(/['\s]/g, '-').replace(/-+/g, '-');
}

async function audit() {
  console.log("--- Surfer Image Audit ---");
  const { data: surfers, error } = await supabase
    .from('surfers')
    .select('id, name, image')
    .eq('is_on_tour', true);

  if (error) throw error;

  const mismatches = [];
  const fine = [];

  for (const s of surfers) {
    if (!s.image || s.image.includes('ui-avatars')) {
      mismatches.push({ name: s.name, reason: 'No custom image' });
      continue;
    }

    const expectedSlug = slugify(s.name);
    const filename = s.image.split('/').pop()?.replace('.png', '') || '';

    if (filename !== expectedSlug) {
      // Allow for things like 'samuel-pupo' vs 'samuel-pupo-1' if we had versioning, but here it's simple
      mismatches.push({ name: s.name, currentImage: filename, expected: expectedSlug });
    } else {
      fine.push(s.name);
    }
  }

  console.log(`Fine (${fine.length}):`, fine.join(', '));
  console.log("\n--- Issues / Mismatches ---");
  console.table(mismatches);
}

audit().catch(console.error);
