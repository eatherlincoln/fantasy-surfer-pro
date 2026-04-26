
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const surferUpdates = [
  // A TIER
  { name: 'Gabriel Medina',      value: 18.50, tier: 'A' },
  { name: 'George Pittar',       value: 15.50, tier: 'A' },
  { name: 'Miguel Pupo',         value: 12.50, tier: 'A' },
  { name: 'Yago Dora',           value: 11.00, tier: 'A' },
  { name: 'Samuel Pupo',         value: 10.50, tier: 'A' },
  { name: 'Griffin Colapinto',   value: 10.00, tier: 'A' },
  { name: 'Italo Ferreira',      value: 10.00, tier: 'A' },
  { name: 'Kanoa Igarashi',      value:  9.50, tier: 'A' },
  { name: 'Leonardo Fioravanti', value:  9.50, tier: 'A' },
  { name: 'Crosby Colapinto',    value:  9.00, tier: 'A' },
  { name: 'Barron Mamiya',       value:  9.00, tier: 'A' },
  // B TIER
  { name: 'Joel Vaughan',        value:  8.00, tier: 'B' },
  { name: 'Ethan Ewing',         value:  8.50, tier: 'B' },
  { name: 'Filipe Toledo',       value:  8.50, tier: 'B' },
  { name: 'Rio Waida',           value:  7.00, tier: 'B' },
  { name: 'Jordy Smith',         value:  8.00, tier: 'B' },
  { name: 'Marco Mignot',        value:  6.00, tier: 'B' },
  { name: 'Joao Chianca',        value:  6.50, tier: 'B' },
  { name: 'Jake Marshall',       value:  6.00, tier: 'B' },
  { name: "Connor O'Leary",      value:  6.00, tier: 'B' },
  { name: 'Jack Robinson',       value:  5.00, tier: 'B' },
  { name: 'Alejo Muniz',         value:  3.50, tier: 'B' },
  { name: "Liam O'Brien",        value:  5.00, tier: 'B' },
  { name: 'Kauli Vaast',         value:  5.00, tier: 'B' },
  { name: 'Eli Hannerman',       value:  4.50, tier: 'B' },
  // C TIER
  { name: 'Seth Moniz',          value:  4.00, tier: 'C' },
  { name: 'Cole Houshmand',      value:  4.00, tier: 'C' },
  { name: 'Morgan Cibilic',      value:  3.50, tier: 'C' },
  { name: 'Alan Cleland',        value:  3.50, tier: 'C' },
  { name: 'Ramzi Boukhiam',      value:  3.00, tier: 'C' },
  { name: 'Luke Thompson',       value:  3.00, tier: 'C' },
  { name: 'Mateus Herdy',        value:  2.50, tier: 'C' },
  { name: 'Callum Robson',       value:  2.50, tier: 'C' },
  { name: 'Oscar Berry',         value:  1.00, tier: 'C' },
  { name: 'Winter Vincet',       value:  1.00, tier: 'C' },
  { name: 'Reef Hazelwood',      value:  0.50, tier: 'C' },
];

const aliases = {
  'ramzi boukhiam': ['ramzi boukhiam', 'ramzi boukhaim'],
  "liam o'brien":   ["liam o'brien"],
  'cole houshmand': ['cole houshmand', 'cole houshman'],
  'eli hannerman':  ['eli hannerman', 'eli hanneman'],
  "connor o'leary": ["connor o'leary"],
  'italo ferreira': ['italo ferreira', 'italo ferriera'],
  'winter vincet':  ['winter vincet', 'winter vincent'],
};

function findSurferId(name, surferMap) {
  const lower = name.toLowerCase().trim();
  if (surferMap.has(lower)) return surferMap.get(lower);
  for (const [canonical, aliasList] of Object.entries(aliases)) {
    if (aliasList.includes(lower) || canonical === lower) {
      for (const alias of aliasList) {
        if (surferMap.has(alias)) return surferMap.get(alias);
      }
    }
  }
  return null;
}

async function update() {
  console.log("=== Updating Gold Coast Surfer Values ===\n");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  let notFound = [];
  for (const s of surferUpdates) {
    const id = findSurferId(s.name, surferMap);
    if (!id) { notFound.push(s.name); continue; }
    await supabase.from('surfers').update({ value: s.value, tier: s.tier }).eq('id', id);
    console.log(`  ✓ ${s.name} → $${s.value}M [${s.tier}]`);
  }

  if (notFound.length) console.warn(`\n⚠️  Not found:`, notFound.join(', '));
  console.log("\n=== Done ===");
}

update().catch(console.error);
