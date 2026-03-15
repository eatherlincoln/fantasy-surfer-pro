
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

async function checkStorage() {
  console.log("--- Supabase Storage Scan (avatars/surfers) ---");
  const { data: files, error } = await supabase.storage.from('avatars').list('surfers', { limit: 100 });

  if (error) throw error;

  console.log("Files Found:", files.map(f => f.name).join(', '));
  
  const { data: surfers } = await supabase.from('surfers').select('id, name, image').not('image', 'is', null);
  
  surfers.forEach(s => {
    if (s.image && !s.image.includes('ui-avatars')) {
      console.log(`DB Link: ${s.name} -> ${s.image}`);
    }
  });
}

checkStorage().catch(console.error);
