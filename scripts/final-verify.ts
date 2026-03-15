
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

async function finalVerification() {
  console.log("--- Final Verification ---");
  const { data: files } = await supabase.storage.from('avatars').list('surfers', { limit: 100 });
  const existingFiles = new Set(files.map(f => f.name));

  const { data: surfers } = await supabase.from('surfers').select('id, name, image').eq('is_on_tour', true);

  for (const s of surfers) {
    const filename = s.image?.split('/').pop() || '';
    if (!existingFiles.has(filename)) {
      if (s.image?.includes('irtlqpjyohydkcwbcgny')) {
        console.log(`WARNING: Missing file for ${s.name}: ${filename}. Reverting to UI-avatar.`);
        const placeholder = `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random&size=200`;
        await supabase.from('surfers').update({ image: placeholder }).eq('id', s.id);
      }
    } else {
      console.log(`OK: ${s.name}`);
    }
  }
}

finalVerification().catch(console.error);
