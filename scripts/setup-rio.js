
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '0cbed25f-e36e-4c83-bd8f-20659e4b5a33'; // Rio Pro

// ============================================================
// UPDATED SURFER VALUES & TIERS (post-El Salvador) — 12 A / 12 B / 12 C
// ============================================================
const surferUpdates = [
  // A TIER (12 surfers)
  { name: 'Italo Ferreira',      value: 18.50, tier: 'A' },
  { name: 'Gabriel Medina',      value: 15.00, tier: 'A' },
  { name: 'Leonardo Fioravanti', value: 14.00, tier: 'A' },  // El Salvador winner 🏆
  { name: 'Yago Dora',           value: 12.00, tier: 'A' },
  { name: 'Miguel Pupo',         value: 10.00, tier: 'A' },
  { name: 'Samuel Pupo',         value: 10.00, tier: 'A' },
  { name: 'George Pittar',       value:  9.50, tier: 'A' },
  { name: 'Kanoa Igarashi',      value:  9.50, tier: 'A' },  // El Salvador finalist
  { name: 'Ethan Ewing',         value:  9.50, tier: 'A' },
  { name: 'Griffin Colapinto',   value:  9.00, tier: 'A' },
  { name: "Liam O'Brien",        value:  8.50, tier: 'A' },
  { name: 'Filipe Toledo',       value:  8.50, tier: 'A' },
  // B TIER (12 surfers)
  { name: 'Jack Robinson',       value:  7.50, tier: 'B' },
  { name: 'Marco Mignot',        value:  7.00, tier: 'B' },
  { name: "Connor O'Leary",      value:  7.00, tier: 'B' },
  { name: 'Crosby Colapinto',    value:  6.50, tier: 'B' },
  { name: 'Kauli Vaast',         value:  6.50, tier: 'B' },
  { name: 'Rio Waida',           value:  6.00, tier: 'B' },
  { name: 'Morgan Cibilic',      value:  5.00, tier: 'B' },
  { name: 'Barron Mamiya',       value:  4.50, tier: 'B' },
  { name: 'Jake Marshall',       value:  4.00, tier: 'B' },
  { name: 'Joao Chianca',        value:  3.50, tier: 'B' },
  { name: 'Callum Robson',       value:  3.00, tier: 'B' },
  { name: 'Alejo Muniz',         value:  2.00, tier: 'B' },
  // C TIER (12 surfers — incl. 2 wildcards)
  { name: 'Jordy Smith',         value:  4.50, tier: 'C' },
  { name: 'Joel Vaughan',        value:  4.00, tier: 'C' },
  { name: 'Mateus Herdy',        value:  3.50, tier: 'C' },
  { name: 'Cole Houshmand',      value:  3.00, tier: 'C' },
  { name: 'Seth Moniz',          value:  2.00, tier: 'C' },
  { name: 'Alan Cleland',        value:  1.50, tier: 'C' },
  { name: 'Eli Hannerman',       value:  1.50, tier: 'C' },
  { name: 'Luke Thompson',       value:  1.50, tier: 'C' },
  { name: 'Ramzi Boukhiam',      value:  1.00, tier: 'C' },
  { name: 'Oscar Berry',         value:  1.00, tier: 'C' },
  { name: 'Matthew McGillivray', value:  0.50, tier: 'C' },  // wildcard
  { name: 'Weslley Dantas',      value:  0.50, tier: 'C' },  // NEW wildcard
];

const aliases = {
  'ramzi boukhiam': ['ramzi boukhiam', 'ramzi boukhaim'],
  "liam o'brien":   ["liam o'brien"],
  'cole houshmand': ['cole houshmand', 'cole houshman'],
  'eli hannerman':  ['eli hannerman', 'eli hanneman'],
  "connor o'leary": ["connor o'leary"],
  'italo ferreira': ['italo ferreira', 'italo ferriera'],
  'weslley dantas': ['weslley dantas', 'wesley dantas'],
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
  { heat: 1, surfers: ['Ramzi Boukhiam'],                       advanceTo: { round: 2, heat: 9  } }, // + event seed #36 (TBD)
  { heat: 2, surfers: ['Luke Thompson', 'Matthew McGillivray'], advanceTo: { round: 2, heat: 6  } },
  { heat: 3, surfers: ['Seth Moniz', 'Weslley Dantas'],         advanceTo: { round: 2, heat: 3  } },
  { heat: 4, surfers: ['Eli Hannerman', 'Oscar Berry'],         advanceTo: { round: 2, heat: 13 } },
];

// ============================================================
// ROUND 2 DRAW (16 heats — pre-seeded)
// ============================================================
const round2Draw = [
  { heat:  1, surfers: ['Jack Robinson', 'Rio Waida'] },
  { heat:  2, surfers: ['Samuel Pupo', 'Alan Cleland'] },
  { heat:  3, surfers: ['Leonardo Fioravanti'] },      // + R1H3 winner
  { heat:  4, surfers: ["Liam O'Brien", 'Jake Marshall'] },
  { heat:  5, surfers: ["Connor O'Leary", 'Morgan Cibilic'] },
  { heat:  6, surfers: ['Gabriel Medina'] },           // + R1H2 winner
  { heat:  7, surfers: ['Griffin Colapinto', 'Joao Chianca'] },
  { heat:  8, surfers: ['George Pittar', 'Joel Vaughan'] },
  { heat:  9, surfers: ['Italo Ferreira'] },           // + R1H1 winner
  { heat: 10, surfers: ['Crosby Colapinto', 'Kauli Vaast'] },
  { heat: 11, surfers: ['Ethan Ewing', 'Alejo Muniz'] },
  { heat: 12, surfers: ['Kanoa Igarashi', 'Cole Houshmand'] },
  { heat: 13, surfers: ['Yago Dora'] },                // + R1H4 winner
  { heat: 14, surfers: ['Marco Mignot', 'Barron Mamiya'] },
  { heat: 15, surfers: ['Filipe Toledo', 'Callum Robson'] },
  { heat: 16, surfers: ['Miguel Pupo', 'Mateus Herdy'] },
];

async function setup() {
  console.log("=== Setting Up Rio Pro ===\n");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // --------------------------------------------------------
  // STEP 1: Create new wildcards
  // --------------------------------------------------------
  console.log("--- Creating new wildcards ---");
  const newSurfers = [
    { name: 'Weslley Dantas', country: 'Brazil', value: 0.50, tier: 'C' },
  ];
  for (const ns of newSurfers) {
    if (!findSurferId(ns.name, surferMap)) {
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
  console.log("\n--- Clearing Rio user_teams ---");
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
    const label = h.surfers.join(' vs ') + (h.heat === 1 ? ' + Event Seed #36 (TBD)' : '');
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

  // Tier counts
  const { data: tierCounts } = await supabase.from('surfers')
    .select('tier').eq('is_on_tour', true).eq('status', 'active');
  const counts = {};
  tierCounts?.forEach(s => counts[s.tier] = (counts[s.tier] || 0) + 1);
  console.log(`\nActive tier counts: A=${counts.A||0}, B=${counts.B||0}, C=${counts.C||0}`);

  console.log("\n=== Done ===");
}

setup().catch(console.error);
