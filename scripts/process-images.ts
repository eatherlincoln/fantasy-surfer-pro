
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const imageDirectory = '/Users/lincolneather/.gemini/antigravity/brain/32b93648-55bc-465f-9e2b-5e501336ccff';

// Manual matching based on visual identification
const mappings = [
  { file: 'media__1773562957159.png', name: 'Seth Moniz' },
  { file: 'media__1773562957167.png', name: 'Yago Dora' }
];

async function processImages() {
  console.log("--- Processing Surfer Images ---");

  for (const m of mappings) {
    const filePath = path.join(imageDirectory, m.file);
    if (!fs.existsSync(filePath)) {
      console.error(`File missing: ${m.file}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `${m.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    const storagePath = `surfers/${fileName}`;

    console.log(`Uploading ${m.name}...`);
    
    // Upload to 'avatars' bucket
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (uploadError) {
      console.error(`Upload error for ${m.name}:`, uploadError);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(storagePath);

    console.log(`Updating database for ${m.name}...`);
    const { error: updateError } = await supabase
      .from('surfers')
      .update({ image: publicUrl })
      .ilike('name', m.name);

    if (updateError) {
      console.error(`Update error for ${m.name}:`, updateError);
    } else {
      console.log(`Success: ${m.name} updated to ${publicUrl}`);
    }
  }

  console.log("--- Batch Complete ---");
}

processImages().catch(console.error);
