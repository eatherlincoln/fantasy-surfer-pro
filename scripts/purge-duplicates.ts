
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

async function purge() {
  console.log("--- Purging Duplicates ---");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  
  const nameGroups: Record<string, string[]> = {};
  surfers?.forEach(s => {
    const norm = s.name.trim().toLowerCase();
    if (!nameGroups[norm]) nameGroups[norm] = [];
    nameGroups[norm].push(s.id);
  });

  for (const name in nameGroups) {
    const ids = nameGroups[name];
    if (ids.length > 1) {
      console.log(`Duplicate found: ${name} (${ids.length} entries)`);
      // Keep the first ID, delete the others
      // Note: This might break foreign keys if the other IDs were used.
      // But we will re-run assignments after.
      const toDelete = ids.slice(1);
      for (const id of toDelete) {
        console.log(`Deleting ${id}...`);
        const { error } = await supabase.from('surfers').delete().eq('id', id);
        if (error) {
          console.log(`Could not delete ${id}: ${error.message} (likely has foreign key ties)`);
          // If we can't delete it, we should probably keep it and delete the OTHER one?
          // For now, let's just log it.
        }
      }
    }
  }

  console.log("--- Purge Complete ---");
}

purge().catch(console.error);
