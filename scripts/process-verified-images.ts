
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const brainDir = '/Users/lincolneather/.gemini/antigravity/brain/32b93648-55bc-465f-9e2b-5e501336ccff';

const verifiedMappings = [
  { file: 'media__1773561664394.png', name: 'Liam O\'Brien' },
  { file: 'media__1773561653504.png', name: 'Callum Robson' },
  { file: 'media__1773562291652.png', name: 'Luke Thompson' },
  { file: 'media__1773561653531.png', name: 'Rio Waida' },
  { file: 'media__1773561664407.png', name: 'Jake Marshall' },
  { file: 'media__1773561653515.png', name: 'Ramzi Boukhiam' },
  { file: 'media__1773561664366.png', name: 'Jack Robinson' },
  { file: 'media__1773561664391.png', name: 'Gabriel Medina' },
  { file: 'media__1773562291668.png', name: 'Leonardo Fioravanti' }
];

function slugify(name: string) {
  return name.toLowerCase().replace(/['\s]/g, '-').replace(/-+/g, '-');
}

async function processVerified() {
  console.log("--- Processing 9 Verified Surfer Images ---");

  for (const m of verifiedMappings) {
    console.log(`Processing ${m.name}...`);
    const filePath = `${brainDir}/${m.file}`;
    
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found at ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const slug = slugify(m.name);
    const storagePath = `surfers/${slug}.png`;

    console.log(`Uploading ${m.name} to storage...`);
    const { error: uploadError } = await supabase.storage.from('avatars').upload(storagePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });

    if (uploadError) {
      console.error(`Upload error for ${m.name}:`, uploadError);
      continue;
    }

    const publicUrl = `${PROD_URL}/storage/v1/object/public/avatars/${storagePath}`;
    console.log(`Updating database for ${m.name}...`);
    
    const { error: dbError } = await supabase
      .from('surfers')
      .update({ image: publicUrl })
      .ilike('name', m.name);

    if (dbError) console.error(`DB error for ${m.name}:`, dbError);
    else console.log(`Success: ${m.name} linked to ${publicUrl}`);
  }

  console.log("--- Verified Processing Complete ---");
}

processVerified().catch(console.error);
