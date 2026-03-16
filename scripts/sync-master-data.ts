
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const masterData = [
  { name: 'Yago Dora', tier: 'A', country: 'Brazil', stance: 'Goofy', url: 'https://www.dropbox.com/scl/fi/fq95su7qmifmh4t2z8zk0/Yago-Dora.png?rlkey=qls546wtv1rj8jallk1v38klh&dl=1' },
  { name: 'Griffin Colapinto', tier: 'A', country: 'USA', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/h0qj5e6w176giltenc7in/Griffin-Colapinto.png?rlkey=xk5u0e54jrte7ito0iat2ki1o&dl=1' },
  { name: 'Jordy Smith', tier: 'A', country: 'South Africa', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/n33a4quctulpmyktgnxvp/Jordy-Smith.png?rlkey=k9athcvo7glrvtu5wp6db1oqo&dl=1' },
  { name: 'Italo Ferreira', tier: 'A', country: 'Brazil', stance: 'Goofy', url: 'https://www.dropbox.com/scl/fi/d4joruyzzku4c4w2w300c/Italo-Ferraria.png?rlkey=mfe4jbbekmi80cjpru4l7nng&dl=1' },
  { name: 'Jack Robinson', tier: 'A', country: 'Australia', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/tn8a797hu94fbzowo4ald/Jack-Robinson.png?rlkey=s1rz88y5q16dpnqmghj7y1viw&dl=1' },
  { name: 'Ethan Ewing', tier: 'A', country: 'Australia', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/j4crl7f793jnaz9bk4dyg/Ethan-Ewing.png?rlkey=gnfxao16fzdifq3vjo8rsjqz0&dl=1' },
  { name: 'Kanoa Igarashi', tier: 'A', country: 'Japan', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/zx1peyqx9ri57hqqxh65g/kanoa-Igarashi.png?rlkey=fz6sizorh5xh7w2wan0n8izmu&dl=1' },
  { name: 'Filipe Toledo', tier: 'A', country: 'Brazil', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/pqbwa5l3c6r6eu9i7qzci/Filipe-Toledo.png?rlkey=4fa9aifspwdaqtxgbf1nfjysb&dl=1' },
  { name: 'Leonardo Fioravanti', tier: 'A', country: 'Italy', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/825vkwb2t1h4d0zdbkb3g/Leo-Fioravanti.png?rlkey=miakcatobqqni2dliwgsq5inot&dl=1' },
  { name: 'Cole Houshman', tier: 'A', country: 'USA', stance: 'Goofy', url: 'https://www.dropbox.com/scl/fi/xdqg64f72ygx69mzyeeiy/Cole-Houshmand.png?rlkey=u9x4rp3rogio7xf7jz3v8jg6j&dl=1' },
  { name: 'Barron Mamiya', tier: 'B', country: 'Hawaii', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/v5xeaxb7l6irng1vngkc7/Barron-Mamiya.png?rlkey=4x67fae3a0zq4kaca9yxlbdw6&dl=1' },
  { name: 'Connor O\'Leary', tier: 'B', country: 'Japan', stance: 'Goofy', url: 'https://www.dropbox.com/scl/fi/yb5pi4pjwvakbj5v6ty6g/Connor-Oleary.png?rlkey=sm8nis074fwidr4f069y6jyh5&dl=1' },
  { name: 'Miguel Pupo', tier: 'B', country: 'Brazil', stance: 'Goofy', url: 'https://www.dropbox.com/scl/fi/tp8fv61nl5n3wbcb6aktu/Miggy-Pupo.png?rlkey=z0i33vi9l8dismoy6xdqnp3r8&dl=1' },
  { name: 'Jake Marshall', tier: 'B', country: 'USA', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/g794afvh5j3mbjwbwy76o6/Jake-Marshall.png?rlkey=wixqozcwp3kk455neicmbp1hh&dl=1' },
  { name: 'Crosby Colapinto', tier: 'B', country: 'USA', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/j86tu2w4zx8zjweqd9vj3/Crosby-Colapinto.png?rlkey=m6o74xzbynmcmccje4fhw6a48&dl=1' },
  { name: 'Marco Mignot', tier: 'B', country: 'France', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/poox5477zbbsyh4pl0uzr/Marco-Mignot.png?rlkey=sir21yyvfzs7680u1chgy5ftf&dl=1' },
  { name: 'Joao Chianca', tier: 'B', country: 'Brazil', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/e69h2r5mregdfu9lh8quv/Joao-Chianca.png?rlkey=dgtaxflxwjzwv4vk730tstk&dl=1' },
  { name: 'Joel Vaughan', tier: 'B', country: 'Australia', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/wrxpeki67ug68112f79di/Joel-Vaughan.png?rlkey=8x0ksnm4dak8dqlvxa5wav1vh&dl=1' },
  { name: 'Alan Cleland', tier: 'B', country: 'Mexico', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/amhi1bbzlpp8oa8wthdh/Al-Cleland.png?rlkey=pqjijqbg7rkgtshf9lhtbqvs3&dl=1' },
  { name: 'Rio Waida', tier: 'B', country: 'Indonesia', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/sc2km9kfu0evn0ze622fotc6rv/Rio-M.png?rlkey=utzjxnvn25zi2b5enxgrci7l&dl=1' },
  { name: 'Seth Moniz', tier: 'B', country: 'Hawaii', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/abajeoypu4lh02dr2mozt/Seth-Moniz.png?rlkey=057bez79x5rshqw6mmnmdtbw1&dl=1' },
  { name: 'Alejo Muniz', tier: 'B', country: 'Brazil', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/qn6kv9x7y7yxgzvgz4w8/Alejo-Munoz.png?rlkey=m3tccwv6qh0j701fo7c54v35&dl=1' },
  { name: 'Kauli Vaast', tier: 'B', country: 'France', stance: 'Goofy', url: 'https://www.dropbox.com/scl/fi/4wvqw7z3okl92tddf6opj/kauli-vaast.png?rlkey=l7dfnj7531bittg4ku0uk8bq7&dl=1' },
  { name: 'Eli Hannerman', tier: 'B', country: 'Hawaii', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/1w2qvfodbifm5dymqtkfy/eli-hannerman.png?rlkey=7baoj6ftxezr8mxkddyixceca&dl=1' },
  { name: 'Morgan Cibilic', tier: 'B', country: 'Australia', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/ono27jb7ny1zr48b1qhjn/Morgan-Cibilic.png?rlkey=pjjksl3ugav3g91mv1p882i7e&dl=1' },
  { name: 'George Pittar', tier: 'B', country: 'Australia', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/miz6xkxpovmqlnx85li0c/George-Pittar.png?rlkey=kynte0dxa5mzzfng5cnnc3ay2&dl=1' },
  { name: 'Samuel Pupo', tier: 'C', country: 'Brazil', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/y9vgjayme8la8m9okcqa0/Sammy-Pupo.png?rlkey=vsa6pt6mm4sxt6hvz990fl5rn&dl=1' },
  { name: 'Callum Robson', tier: 'C', country: 'Australia', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/kql7z73afrlbvxnbbbhnz/callum-robson.png?rlkey=nbkn4phjtay1ugp1efz5qowa&dl=1' },
  { name: 'Luke Thompson', tier: 'C', country: 'South Africa', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/w2tl2i4bnj12bmybwyru7/luke-thompson.png?rlkey=emr7nvfcbfjyt8jsqoaj9uzme&dl=1' },
  { name: 'Oscar Berry', tier: 'C', country: 'Australia', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/tho11vytiustbaucldol/oscar-berry.png?rlkey=pgz1ku5oqrvbvc6kxuva4bp4&dl=1' },
  { name: 'Mateus Herdy', tier: 'C', country: 'Brazil', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/uih56i1lnspapje0gc4i5/Mateus-Herdy.png?rlkey=7tlaemyekxdjz8cq1xg3vhqaf&dl=1' },
  { name: 'Liam O\'Brien', tier: 'C', country: 'Australia', stance: 'Natural', url: 'https://www.dropbox.com/scl/fi/9a7q75u2k0lci7osnl9pn/Liam-Obrien.png?rlkey=ih9it9ptxjz69s6vz3tqgtn&dl=1' },
  { name: 'Gabriel Medina', tier: 'C', country: 'Brazil', stance: 'Goofy', url: 'https://www.dropbox.com/scl/fi/7egs1pjshfmquouw4i8w1/Gabby-Medina.png?rlkey=ma9zror27ckmil03psf8tkfxl&dl=1' },
  { name: 'Ramzi Boukhaim', tier: 'C', country: 'Morocco', stance: 'Goofy', url: 'https://www.dropbox.com/scl/fi/54ai3a1886kbkkwg6b4au/Ramzi-Boukhaim.png?rlkey=yciwtot686jgf3ftzm97syylk&dl=1' }
];

function slugify(name: string) {
  return name.toLowerCase().replace(/['\s]/g, '-').replace(/-+/g, '-');
}

async function sync() {
  console.log("--- Starting Master Data Sync (V2: Full Update) ---");

  for (const s of masterData) {
    console.log(`\nSyncing ${s.name}...`);
    
    try {
      // 1. Download image (if needed or forced)
      const response = await fetch(s.url);
      if (!response.ok) throw new Error(`Download failed with status ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const slug = slugify(s.name);
      const storagePath = `surfers/${slug}.png`;

      // 2. Upload to Supabase Storage
      console.log(`Uploading to Supabase: ${storagePath}`);
      const { error: uploadError } = await supabase.storage.from('avatars').upload(storagePath, buffer, {
        contentType: 'image/png',
        upsert: true
      });
      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const publicUrl = `${PROD_URL}/storage/v1/object/public/avatars/${storagePath}`;

      // 3. Calculated fields
      const value = s.tier === 'A' ? 10 : s.tier === 'B' ? 7.5 : 5;

      // 4. Update Database
      let searchName = s.name;
      if (s.name === 'Cole Houshman') searchName = 'Cole Houshmand';
      if (s.name === 'Ramzi Boukhaim') searchName = 'Ramzi Boukhiam';

      const { data: existing } = await supabase
        .from('surfers')
        .select('id')
        .ilike('name', searchName)
        .maybeSingle();

      if (existing) {
        console.log(`Updating existing record (ID: ${existing.id})...`);
        const { error: updateError } = await supabase
          .from('surfers')
          .update({
            name: s.name,
            tier: s.tier,
            value: value,
            country: s.country,
            stance: s.stance,
            image: publicUrl,
            is_on_tour: true,
            status: 'ACTIVE',
            gender: 'Male'
          })
          .eq('id', existing.id);
        
        if (updateError) console.error("Update Error:", updateError.message);
        else console.log(`Success: Updated ${s.name} (Value: ${value})`);
      } else {
        console.log(`No record found for ${searchName}. Inserting new...`);
        const { error: insertError } = await supabase
          .from('surfers')
          .insert({
            name: s.name,
            tier: s.tier,
            value: value,
            country: s.country,
            stance: s.stance,
            image: publicUrl,
            is_on_tour: true,
            status: 'ACTIVE',
            gender: 'Male'
          });
        
        if (insertError) console.error("Insert Error:", insertError.message);
        else console.log(`Success: Inserted ${s.name} (Value: ${value})`);
      }

    } catch (err: any) {
      console.error(`FAILED ${s.name}:`, err.message);
    }
  }

  console.log("\n--- Master Sync V2 Complete ---");
}

sync().catch(console.error);
