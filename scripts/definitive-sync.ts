
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const driveMapping = [
  { name: 'Yago Dora', tier: 'A', country: 'Brazil', flag: '🇧🇷', stance: 'Goofy', driveId: '1lQr25C7_xiD7khQwq41-9mARd_PVVlbn', value: 11.0 },
  { name: 'Griffin Colapinto', tier: 'A', country: 'USA', flag: '🇺🇸', stance: 'Natural', driveId: '1VJyXEyWrq5bkAmOmKLJ7dE7cghoxUW3l', value: 10.5 },
  { name: 'Jordy Smith', tier: 'A', country: 'South Africa', flag: '🇿🇦', stance: 'Natural', driveId: '1ZM22FjP11R11AvBAbCESMKi6-xzXhC4c', value: 10.0 },
  { name: 'Italo Ferreira', tier: 'A', country: 'Brazil', flag: '🇧🇷', stance: 'Goofy', driveId: '1v3u1w4s560Bo7XkGua_Z93E3NGVcvxRI', value: 9.0 },
  { name: 'Jack Robinson', tier: 'A', country: 'Australia', flag: '🇦🇺', stance: 'Natural', driveId: '15onuveCxdUcceF3hYt4I45lwKsGlJM9u', value: 9.0 },
  { name: 'Ethan Ewing', tier: 'A', country: 'Australia', flag: '🇦🇺', stance: 'Natural', driveId: '1Or_NmgCOs3QFJJBK4_AqwozL1Ia2NgYY', value: 8.5 },
  { name: 'Kanoa Igarashi', tier: 'A', country: 'Japan', flag: '🇯🇵', stance: 'Natural', driveId: '1B_730yImolJM-W2P4RgW4ebOcbLINj2M', value: 8.0 },
  { name: 'Filipe Toledo', tier: 'A', country: 'Brazil', flag: '🇧🇷', stance: 'Natural', driveId: '1rQummpviBkfXIGJ76l2NW52Q11qRqwCk', value: 8.0 },
  { name: 'Leonardo Fioravanti', tier: 'A', country: 'Italy', flag: '🇮🇹', stance: 'Natural', driveId: '1NzfqJ0dPbrezsixrfvpewh42YYiFTwqQ', value: 8.0 },
  { name: 'Cole Houshman', tier: 'A', country: 'USA', flag: '🇺🇸', stance: 'Goofy', driveId: '1Lg8KhuwIen22W73UDYrs7iLMGz9Lbgf4', value: 7.5 },
  { name: 'Barron Mamiya', tier: 'B', country: 'Hawaii', flag: '🇺🇸', stance: 'Natural', driveId: '1NlygddPgl7QeUouJr8Y0JCGIiZtAkVL2', value: 7.5 },
  { name: 'Connor O\'Leary', tier: 'B', country: 'Japan', flag: '🇯🇵', stance: 'Goofy', driveId: '1QmPqD2_tu1s55h5rFv9uPSRK-PL89Njl', value: 7.5 },
  { name: 'Miguel Pupo', tier: 'B', country: 'Brazil', flag: '🇧🇷', stance: 'Goofy', driveId: '1i5syDc1twDPt60lBWD1NuvDW3d8uHROf', value: 7.0 },
  { name: 'Jake Marshall', tier: 'B', country: 'USA', flag: '🇺🇸', stance: 'Natural', driveId: '1uR2xSRFAjecKr2PVJfG4mHNokESxVcqH', value: 7.0 },
  { name: 'Crosby Colapinto', tier: 'B', country: 'USA', flag: '🇺🇸', stance: 'Natural', driveId: '1y0dkQgZ-Ia4_PQdjClPEWfrmyST35aWE', value: 6.5 },
  { name: 'Marco Mignot', tier: 'B', country: 'France', flag: '🇫🇷', stance: 'Natural', driveId: '1zRtt8p_YuJ4AMttKxsgZIRNNluX3X9UX', value: 6.0 },
  { name: 'Joao Chianca', tier: 'B', country: 'Brazil', flag: '🇧🇷', stance: 'Natural', driveId: '1l9zeL5YKcdKr86qgc--vMFd54nKer3Ua', value: 6.5 },
  { name: 'Joel Vaughan', tier: 'B', country: 'Australia', flag: '🇦🇺', stance: 'Natural', driveId: '1yfLmwNq-vR-6sBlPFOSO7XexOcocAfiP', value: 6.5 },
  { name: 'Alan Cleland', tier: 'B', country: 'Mexico', flag: '🇲🇽', stance: 'Natural', driveId: '10i5qSuWCYzbYgaxBHUZEXBmWlWnqQ1ls', value: 6.5 },
  { name: 'Rio Waida', tier: 'B', country: 'Indonesia', flag: '🇮🇩', stance: 'Natural', driveId: '1xyewPdszPkGg4xd7javnjXxHsUQTGiqh', value: 6.0 },
  { name: 'Seth Moniz', tier: 'B', country: 'Hawaii', flag: '🇺🇸', stance: 'Natural', driveId: '1SxWQtFlCmXReCAA_sssCAYMSBTXoTLYE', value: 5.5 },
  { name: 'Alejo Muniz', tier: 'B', country: 'Brazil', flag: '🇧🇷', stance: 'Natural', driveId: '1teWrMAmaIRUEs88pRD4kKVRF_RdMRU0p', value: 3.0 },
  { name: 'Kauli Vaast', tier: 'B', country: 'France', flag: '🇫🇷', stance: 'Goofy', driveId: '1I598uQJLgWID0jWMqu8I8wNKtymTeouI', value: 6.0 },
  { name: 'Eli Hannerman', tier: 'B', country: 'Hawaii', flag: '🇺🇸', stance: 'Natural', driveId: '1Tc6EXUTW5jcEDd38YES6ftdT4h2-kvtp', value: 5.5 },
  { name: 'Morgan Cibilic', tier: 'B', country: 'Australia', flag: '🇦🇺', stance: 'Natural', driveId: '1_ceM8PapWhfLQpsersKmKl0k8gGkQy-N', value: 5.0 },
  { name: 'George Pittar', tier: 'B', country: 'Australia', flag: '🇦🇺', stance: 'Natural', driveId: '1MUy3mosPF8cDO5LAwhcpss4PLPgFvmWQ', value: 5.0 },
  { name: 'Samuel Pupo', tier: 'C', country: 'Brazil', flag: '🇧🇷', stance: 'Natural', driveId: '1VTQsNSV5WtGPeNisX5skqTaeEcVVQ5ib', value: 4.0 },
  { name: 'Callum Robson', tier: 'C', country: 'Australia', flag: '🇦🇺', stance: 'Natural', driveId: '1mH5R01K6fqKCGZgC808SjbAjjS3Abntd', value: 4.0 },
  { name: 'Luke Thompson', tier: 'C', country: 'South Africa', flag: '🇿🇦', stance: 'Natural', driveId: '1G-UyqFAq1OAojoX-u33FBV9Y-QDOnhLi', value: 2.0 },
  { name: 'Oscar Berry', tier: 'C', country: 'Australia', flag: '🇦🇺', stance: 'Natural', driveId: '1q9_QC86KVKN-KlKQ154rT8NGwLk4bSt5', value: 2.0 },
  { name: 'Mateus Herdy', tier: 'C', country: 'Brazil', flag: '🇧🇷', stance: 'Natural', driveId: '16MrJcBsN6AXoYwR2HfujJHoMJ5sql67k', value: 3.0 },
  { name: 'Liam O\'Brien', tier: 'C', country: 'Australia', flag: '🇦🇺', stance: 'Natural', driveId: '1FtGdGAeBNbTjQpoVtuZ9RRpv3GZ_cxM7', value: 4.0 },
  { name: 'Gabriel Medina', tier: 'C', country: 'Brazil', flag: '🇧🇷', stance: 'Goofy', driveId: '1K_cZ3suVZlZofyXOxeVVPcyL0WqahLJB', value: 5.0 },
  { name: 'Ramzi Boukhaim', tier: 'C', country: 'Morocco', flag: '🇲🇦', stance: 'Goofy', driveId: '14u62NLmVMYNnMpviqt8n-hOOjE2A5sUH', value: 2.0 }
];

async function sync() {
  console.log("--- GOOGLE DRIVE SYNC (Granular Values) ---");

  for (const s of driveMapping) {
    console.log(`\nSyncing ${s.name}...`);
    
    try {
      const slug = s.name.toLowerCase().replace(/['\s]/g, '-').replace(/-+/g, '-');
      const imagePath = `surfers/${slug}.png`;
      const publicUrl = `${PROD_URL}/storage/v1/object/public/avatars/${imagePath}`;
      
      // 1. Download image from Google Drive
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${s.driveId}`;
      console.log(`Downloading binary from Drive ID: ${s.driveId}...`);
      
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(`Binary size: ${buffer.length} bytes`);

      // 2. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from('avatars').upload(imagePath, buffer, {
        contentType: 'image/png',
        upsert: true
      });
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      // 3. Update Database
      const { data: existing } = await supabase
        .from('surfers')
        .select('id')
        .ilike('name', s.name)
        .maybeSingle();

      if (existing) {
        console.log(`Updating existing record (ID: ${existing.id})...`);
        const { error: updateError } = await supabase
          .from('surfers')
          .update({
            name: s.name,
            tier: s.tier,
            value: s.value,
            country: s.country,
            flag: s.flag,
            stance: s.stance,
            image: publicUrl,
            is_on_tour: true,
            status: 'ACTIVE',
            gender: 'Male'
          })
          .eq('id', existing.id);
        
        if (updateError) console.error("Update Error:", updateError.message);
        else console.log(`Success: Updated ${s.name} (Value: $${s.value}M)`);
      } else {
        console.log(`Inserting new...`);
        const { error: insertError } = await supabase
          .from('surfers')
          .insert({
            name: s.name,
            tier: s.tier,
            value: s.value,
            country: s.country,
            flag: s.flag,
            stance: s.stance,
            image: publicUrl,
            is_on_tour: true,
            status: 'ACTIVE',
            gender: 'Male'
          });
        
        if (insertError) console.error("Insert Error:", insertError.message);
        else console.log(`Success: Inserted ${s.name} (Value: $${s.value}M)`);
      }

    } catch (err: any) {
      console.error(`FAILED ${s.name}:`, err.message);
    }
  }

  // Deactivate everyone else
  const masterNames = driveMapping.map(m => m.name);
  console.log('\nPruning inactive...');
  const { data: golfers } = await supabase.from('surfers').select('id, name').eq('is_on_tour', true);
  const toDeactivate = golfers?.filter(g => !masterNames.includes(g.name)) || [];
  for (const sur of toDeactivate) {
    if (sur.name === 'Dane Henry' || sur.name === 'Wildcard') continue;
    console.log(`Deactivating ${sur.name}`);
    await supabase.from('surfers').update({ is_on_tour: false, status: 'INACTIVE' }).eq('id', sur.id);
  }
  
  console.log("\n--- Google Drive Sync Complete ---");
}

sync().catch(console.error);
