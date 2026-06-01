
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '2b7fea50-4f44-40a7-828b-65caf6bbbb7b'; // El Salvador Pro

// ============================================================
// UPDATED SURFER VALUES & TIERS (post-NZ)
// ============================================================
const surferUpdates = [
  // A TIER (10 surfers)
  { name: 'Italo Ferreira',      value: 18.50, tier: 'A' },  // NZ winner 🏆
  { name: 'Miguel Pupo',         value: 15.50, tier: 'A' },
  { name: 'Gabriel Medina',      value: 14.50, tier: 'A' },
  { name: 'Yago Dora',           value: 11.00, tier: 'A' },
  { name: 'George Pittar',       value: 10.50, tier: 'A' },
  { name: 'Ethan Ewing',         value:  9.50, tier: 'A' },
  { name: 'Samuel Pupo',         value:  8.50, tier: 'A' },
  { name: 'Griffin Colapinto',   value:  6.50, tier: 'A' },  // back to A
  { name: 'Leonardo Fioravanti', value:  7.50, tier: 'A' },  // up to A
  { name: 'Filipe Toledo',       value:  6.50, tier: 'A' },
  // B TIER (12 surfers)
  { name: "Liam O'Brien",        value:  7.50, tier: 'B' },
  { name: "Connor O'Leary",      value:  7.00, tier: 'B' },  // A→B
  { name: 'Kanoa Igarashi',      value:  5.00, tier: 'B' },
  { name: 'Marco Mignot',        value:  3.50, tier: 'B' },
  { name: 'Jack Robinson',       value:  4.50, tier: 'B' },
  { name: 'Morgan Cibilic',      value:  2.50, tier: 'B' },  // NZ finalist
  { name: 'Rio Waida',           value:  3.50, tier: 'B' },
  { name: 'Crosby Colapinto',    value:  4.00, tier: 'B' },
  { name: 'Jake Marshall',       value:  4.00, tier: 'B' },
  { name: 'Alejo Muniz',         value:  2.00, tier: 'B' },
  { name: 'Cole Houshmand',      value:  3.00, tier: 'B' },
  { name: 'Kauli Vaast',         value:  4.00, tier: 'B' },
  // C TIER (14 surfers)
  { name: 'Barron Mamiya',       value:  4.50, tier: 'C' },  // B→C
  { name: 'Joel Vaughan',        value:  4.00, tier: 'C' },  // B→C
  { name: 'Mateus Herdy',        value:  3.50, tier: 'C' },
  { name: 'Jordy Smith',         value:  4.50, tier: 'C' },  // B→C
  { name: 'Joao Chianca',        value:  3.50, tier: 'C' },
  { name: 'Callum Robson',       value:  2.50, tier: 'C' },
  { name: 'Seth Moniz',          value:  2.00, tier: 'C' },
  { name: 'Eli Hannerman',       value:  1.50, tier: 'C' },
  { name: 'Alan Cleland',        value:  1.50, tier: 'C' },
  { name: 'Luke Thompson',       value:  1.50, tier: 'C' },
  { name: 'Ramzi Boukhiam',      value:  1.00, tier: 'C' },
  { name: 'Oscar Berry',         value:  1.00, tier: 'C' },
  { name: 'Matthew McGillivray', value:  0.50, tier: 'C' },  // NEW wildcard
  { name: 'Bryan Perez',         value:  0.50, tier: 'C' },  // NEW wildcard
];

const aliases = {
  'ramzi boukhiam': ['ramzi boukhiam', 'ramzi boukhaim'],
  "liam o'brien":   ["liam o'brien"],
  'cole houshmand': ['cole houshmand', 'cole houshman'],
  'eli hannerman':  ['eli hannerman', 'eli hanneman'],
  "connor o'leary": ["connor o'leary"],
  'italo ferreira': ['italo ferreira', 'italo ferriera'],
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

// ============================================================
// ROUND 1 DRAW (4 wildcard heats)
// ============================================================
const round1Draw = [
  { heat: 1, surfers: ['Ramzi Boukhiam', 'Matthew McGillivray'], advanceTo: { round: 2, heat: 9  } },
  { heat: 2, surfers: ['Luke Thompson'],                          advanceTo: { round: 2, heat: 6  } }, // + event seed #36 (TBD)
  { heat: 3, surfers: ['Eli Hannerman', 'Bryan Perez'],           advanceTo: { round: 2, heat: 3  } },
  { heat: 4, surfers: ['Seth Moniz', 'Oscar Berry'],              advanceTo: { round: 2, heat: 13 } },
];

// ============================================================
// ROUND 2 DRAW (16 heats — pre-seeded)
// ============================================================
const round2Draw = [
  { heat:  1, surfers: ["Liam O'Brien", 'Jake Marshall'] },
  { heat:  2, surfers: ['Ethan Ewing', 'Callum Robson'] },
  { heat:  3, surfers: ['Miguel Pupo'] },              // + R1H3 winner
  { heat:  4, surfers: ['Kanoa Igarashi', 'Alejo Muniz'] },
  { heat:  5, surfers: ['Marco Mignot', 'Rio Waida'] },
  { heat:  6, surfers: ['Yago Dora'] },                // + R1H2 winner
  { heat:  7, surfers: ['Samuel Pupo', 'Joel Vaughan'] },
  { heat:  8, surfers: ['Leonardo Fioravanti', 'Mateus Herdy'] },
  { heat:  9, surfers: ['Italo Ferreira'] },           // + R1H1 winner
  { heat: 10, surfers: ['Crosby Colapinto', 'Morgan Cibilic'] },
  { heat: 11, surfers: ['Filipe Toledo', 'Kauli Vaast'] },
  { heat: 12, surfers: ['George Pittar', 'Joao Chianca'] },
  { heat: 13, surfers: ['Gabriel Medina'] },           // + R1H4 winner
  { heat: 14, surfers: ['Jack Robinson', 'Cole Houshmand'] },
  { heat: 15, surfers: ["Connor O'Leary", 'Barron Mamiya'] },
  { heat: 16, surfers: ['Griffin Colapinto', 'Alan Cleland'] },
];

async function setup() {
  console.log("=== Setting Up El Salvador Pro ===\n");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // --------------------------------------------------------
  // STEP 1: Create new wildcards
  // --------------------------------------------------------
  console.log("--- Creating new wildcards ---");
  const newSurfers = [
    { name: 'Matthew McGillivray', country: 'South Africa', value: 0.50, tier: 'C' },
    { name: 'Bryan Perez',         country: 'El Salvador',  value: 0.50, tier: 'C' },
  ];
  for (const ns of newSurfers) {
    if (!surferMap.has(ns.name.toLowerCase())) {
      const { data, error } = await supabase.from('surfers')
        .insert({ name: ns.name, country: ns.country, is_on_tour: true, status: 'active', value: ns.value, tier: ns.tier })
        .select().single();
      if (error) console.error(`  ERROR creating ${ns.name}:`, error.message);
      else {
        surferMap.set(ns.name.toLowerCase(), data.id);
        console.log(`  ✓ Created ${ns.name} (${ns.country})`);
      }
    } else {
      console.log(`  ℹ️  ${ns.name} already exists`);
    }
  }

  // --------------------------------------------------------
  // STEP 2: Reset all surfers to ACTIVE, update values/tiers
  // --------------------------------------------------------
  console.log("\n--- Updating surfer values, tiers & resetting status ---");
  await supabase.from('surfers').update({ status: 'active' }).eq('is_on_tour', true);

  let notFound = [];
  for (const s of surferUpdates) {
    const id = findSurferId(s.name, surferMap);
    if (!id) { notFound.push(s.name); continue; }
    const { error } = await supabase.from('surfers')
      .update({ status: 'active', value: s.value, tier: s.tier }).eq('id', id);
    if (error) console.error(`  ERROR: ${s.name}`);
    else console.log(`  ✓ ${s.name} → $${s.value}M [${s.tier}]`);
  }
  if (notFound.length) console.warn(`\n  ⚠️  NOT FOUND:`, notFound.join(', '));

  // --------------------------------------------------------
  // STEP 3: Clear user_teams for this event
  // --------------------------------------------------------
  console.log("\n--- Clearing El Salvador user_teams ---");
  const { error: delErr } = await supabase.from('user_teams').delete().eq('event_id', EVENT_ID);
  if (delErr) console.error('  ERROR:', delErr.message);
  else console.log('  ✓ user_teams cleared');

  // --------------------------------------------------------
  // STEP 4: Clear existing heats
  // --------------------------------------------------------
  console.log("\n--- Clearing existing heats ---");
  const { data: existingHeats } = await supabase.from('heats').select('id').eq('event_id', EVENT_ID);
  if (existingHeats && existingHeats.length > 0) {
    const ids = existingHeats.map(h => h.id);
    await supabase.from('scores').delete().in('heat_id', ids);
    await supabase.from('heat_assignments').delete().in('heat_id', ids);
    await supabase.from('heats').delete().in('id', ids);
    console.log(`  ✓ Cleared ${existingHeats.length} heats`);
  } else {
    console.log('  ✓ No existing heats to clear');
  }

  // --------------------------------------------------------
  // STEP 5: Create Round 1 heats
  // --------------------------------------------------------
  console.log("\n--- Creating Round 1 Heats ---");
  for (const h of round1Draw) {
    const { data: newHeat } = await supabase.from('heats')
      .insert({ event_id: EVENT_ID, round_number: 1, heat_number: h.heat, status: 'UPCOMING' })
      .select().single();
    for (const sName of h.surfers) {
      const sId = findSurferId(sName, surferMap);
      if (sId) await supabase.from('heat_assignments').insert({ heat_id: newHeat.id, surfer_id: sId });
      else console.error(`  ⚠️  NOT FOUND: ${sName}`);
    }
    const label = h.surfers.join(' vs ') + (h.heat === 2 ? ' + Event Seed #36' : '');
    console.log(`  R1H${h.heat}: ${label} → R2H${h.advanceTo.heat}`);
  }

  // --------------------------------------------------------
  // STEP 6: Create Round 2 heats
  // --------------------------------------------------------
  console.log("\n--- Creating Round 2 Heats ---");
  for (const h of round2Draw) {
    const { data: newHeat } = await supabase.from('heats')
      .insert({ event_id: EVENT_ID, round_number: 2, heat_number: h.heat, status: 'UPCOMING' })
      .select().single();
    for (const sName of h.surfers) {
      const sId = findSurferId(sName, surferMap);
      if (sId) await supabase.from('heat_assignments').insert({ heat_id: newHeat.id, surfer_id: sId });
      else console.error(`  ⚠️  NOT FOUND: ${sName}`);
    }
    const label = h.surfers.length === 1 ? `${h.surfers[0]} + R1 winner` : h.surfers.join(' vs ');
    console.log(`  R2H${h.heat}: ${label}`);
  }

  // --------------------------------------------------------
  // VERIFICATION
  // --------------------------------------------------------
  console.log("\n=== Verification ===");
  const { data: r1 } = await supabase.from('heats')
    .select('heat_number, heat_assignments(surfers(name))')
    .eq('event_id', EVENT_ID).eq('round_number', 1).order('heat_number');
  console.log("\nRound 1:");
  r1?.forEach(h => {
    const names = h.heat_assignments?.map(a => a.surfers?.name).join(' vs ') || '(empty)';
    console.log(`  R1H${h.heat_number}: ${names}`);
  });

  const { data: r2 } = await supabase.from('heats')
    .select('heat_number, heat_assignments(surfers(name))')
    .eq('event_id', EVENT_ID).eq('round_number', 2).order('heat_number');
  console.log("\nRound 2 (pre-seeded):");
  r2?.forEach(h => {
    const names = h.heat_assignments?.map(a => a.surfers?.name).join(' vs ') || '(+ R1 winner)';
    console.log(`  R2H${h.heat_number}: ${names}`);
  });

  console.log("\n=== Done ===");
}

setup().catch(console.error);
