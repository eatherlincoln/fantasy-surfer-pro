
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const brainDir = '/Users/lincolneather/.gemini/antigravity/brain/32b93648-55bc-465f-9e2b-5e501336ccff';

async function finalFixes() {
  console.log("--- Final Storage Fixes ---");

  // 1. Rename liam-o'brien.png to liam-o-brien.png
  console.log("Renaming Liam's file...");
  const { data: fileData, error: downloadError } = await supabase.storage.from('avatars').download('surfers/liam-o\'brien.png');
  if (fileData) {
    const buffer = Buffer.from(await fileData.arrayBuffer());
    await supabase.storage.from('avatars').upload('surfers/liam-o-brien.png', buffer, { upsert: true, contentType: 'image/png' });
    // await supabase.storage.from('avatars').remove(['surfers/liam-o\'brien.png']); // Keep old just in case
  }

  // 2. Process Batch 9
  const batch9 = [
    { file: 'media__1773562957159.png', name: 'Seth Moniz' },
    { file: 'media__1773562957167.png', name: 'Alejo Muniz' }
  ];

  for (const m of batch9) {
    console.log(`Processing ${m.name}...`);
    const filePath = `${brainDir}/${m.file}`;
    const fileBuffer = fs.readFileSync(filePath);
    const slug = m.name.toLowerCase().replace(/['\s]/g, '-').replace(/-+/g, '-');
    const storagePath = `surfers/${slug}.png`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(storagePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });

    if (uploadError) console.error(`Upload error for ${m.name}:`, uploadError);
    else console.log(`Success: ${m.name} uploaded to ${storagePath}`);
  }
}

finalFixes().catch(console.error);
