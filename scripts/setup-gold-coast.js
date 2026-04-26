
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '368c4321-1a4e-441d-b3b9-3ab2e5e45e57'; // Bonsoy Gold Coast Pro

// ============================================================
// SURFER VALUES & TIERS (post-Margaret River updated sheet)
// ============================================================
const surferUpdates = [
  { name: 'Gabriel Medina',      value: 18.50, tier: 'A' },
  { name: 'George Pittar',       value: 15.00, tier: 'A' },
  { name: 'Miguel Pupo',         value: 12.50, tier: 'A' },
  { name: 'Yago Dora',           value: 10.00, tier: 'A' },
  { name: 'Samuel Pupo',         value:  8.50, tier: 'A' },
  { name: 'Griffin Colapinto',   value:  7.50, tier: 'A' },
  { name: 'Italo Ferreira',      value:  6.50, tier: 'A' },
  { name: 'Kanoa Igarashi',      value:  5.50, tier: 'A' },
  { name: 'Leonardo Fioravanti', value:  5.00, tier: 'A' },
  { name: 'Crosby Colapinto',    value:  4.50, tier: 'A' },
  { name: 'Barron Mamiya',       value:  4.00, tier: 'A' },
  { name: 'Joel Vaughan',        value:  3.80, tier: 'B' },
  { name: 'Ethan Ewing',         value:  3.60, tier: 'B' },
  { name: 'Filipe Toledo',       value:  3.40, tier: 'B' },
  { name: 'Rio Waida',           value:  3.20, tier: 'B' },
  { name: 'Jordy Smith',         value:  3.00, tier: 'B' },
  { name: 'Marco Mignot',        value:  2.80, tier: 'B' },
  { name: 'Joao Chianca',        value:  2.60, tier: 'B' },
  { name: 'Jake Marshall',       value:  2.40, tier: 'B' },
  { name: "Connor O'Leary",      value:  2.20, tier: 'B' },
  { name: 'Jack Robinson',       value:  2.00, tier: 'B' },
  { name: 'Alejo Muniz',         value:  1.80, tier: 'B' },
  { name: "Liam O'Brien",        value:  1.60, tier: 'B' },
  { name: 'Kauli Vaast',         value:  1.50, tier: 'B' },
  { name: 'Eli Hannerman',       value:  1.40, tier: 'B' },
  { name: 'Seth Moniz',          value:  1.30, tier: 'B' },
  { name: 'Cole Houshmand',      value:  1.20, tier: 'C' },
  { name: 'Morgan Cibilic',      value:  1.10, tier: 'C' },
  { name: 'Alan Cleland',        value:  1.00, tier: 'C' },
  { name: 'Ramzi Boukhiam',      value:  1.00, tier: 'C' },
  { name: 'Luke Thompson',       value:  1.00, tier: 'C' },
  { name: 'Mateus Herdy',        value:  1.00, tier: 'C' },
  { name: 'Callum Robson',       value:  1.00, tier: 'C' },
  { name: 'Oscar Berry',         value:  1.00, tier: 'C' },
  { name: 'Winter Vincet',       value:  1.00, tier: 'C' },
  { name: 'Reef Hazelwood',      value:  1.00, tier: 'C' },
];

// Aliases for DB name matching
const aliases = {
  'ramzi boukhiam':  ['ramzi boukhiam', 'ramzi boukhaim'],
  "liam o'brien":    ["liam o'brien"],
  'jacob willcox':   ['jacob willcox', 'jacob wilcox'],
  'mateus herdy':    ['mateus herdy', 'matues herdy'],
  'cole houshmand':  ['cole houshmand', 'cole houshman'],
  'eli hannerman':   ['eli hannerman', 'eli hanneman'],
  "connor o'leary":  ["connor o'leary"],
  'italo ferreira':  ['italo ferreira', 'italo ferriera'],
  'winter vincet':   ['winter vincet', 'winter vincent'],
  'reef hazelwood':  ['reef hazelwood', 'reef hazlewood'],
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
// ROUND 1 DRAW (4 heats)
// ============================================================
const round1Draw = [
  { heat: 1, surfers: ['Callum Robson', 'Oscar Berry'],         advanceWinnerTo: { round: 2, heat: 9  } },
  { heat: 2, surfers: ['Mateus Herdy', 'Reef Hazelwood'],       advanceWinnerTo: { round: 2, heat: 6  } },
  { heat: 3, surfers: ['Luke Thompson', 'Winter Vincet'],        advanceWinnerTo: { round: 2, heat: 3  } },
  { heat: 4, surfers: ['Morgan Cibilic', 'Ramzi Boukhiam'],     advanceWinnerTo: { round: 2, heat: 13 } },
];

// ============================================================
// ROUND 2 DRAW (16 heats)
// surfers listed are pre-seeded; R1 winner slots left empty
// ============================================================
const round2Draw = [
  { heat:  1, surfers: ['Barron Mamiya', 'Marco Mignot'] },
  { heat:  2, surfers: ['Jordy Smith', 'Kauli Vaast'] },
  { heat:  3, surfers: ['Italo Ferreira'] },          // + R1H3 winner
  { heat:  4, surfers: ['Ethan Ewing', 'Rio Waida'] },
  { heat:  5, surfers: ['Crosby Colapinto', 'Jake Marshall'] },
  { heat:  6, surfers: ['Griffin Colapinto'] },        // + R1H2 winner
  { heat:  7, surfers: ['George Pittar', 'Alejo Muniz'] },
  { heat:  8, surfers: ['Kanoa Igarashi', "Liam O'Brien"] },
  { heat:  9, surfers: ['Yago Dora'] },                // + R1H1 winner
  { heat: 10, surfers: ["Connor O'Leary", 'Joel Vaughan'] },
  { heat: 11, surfers: ['Jack Robinson', 'Alan Cleland'] },
  { heat: 12, surfers: ['Leonardo Fioravanti', 'Seth Moniz'] },
  { heat: 13, surfers: ['Gabriel Medina'] },           // + R1H4 winner
  { heat: 14, surfers: ['Filipe Toledo', 'Cole Houshmand'] },
  { heat: 15, surfers: ['Samuel Pupo', 'Joao Chianca'] },
  { heat: 16, surfers: ['Miguel Pupo', 'Eli Hannerman'] },
];

async function setup() {
  console.log("=== Setting Up Gold Coast Pro ===\n");

  // Load surfer map
  const { data: surfers, error: sErr } = await supabase.from('surfers').select('id, name');
  if (sErr) { console.error('Failed to load surfers:', sErr); return; }
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // --------------------------------------------------------
  // STEP 1: Reset all surfers to ACTIVE, update values/tiers
  // --------------------------------------------------------
  console.log("--- Updating surfer values, tiers and resetting status ---");
  let notFound = [];
  for (const s of surferUpdates) {
    const id = findSurferId(s.name, surferMap);
    if (!id) { notFound.push(s.name); continue; }
    const { error } = await supabase.from('surfers')
      .update({ status: 'active', value: s.value, tier: s.tier })
      .eq('id', id);
    if (error) console.error(`  ERROR updating ${s.name}:`, error.message);
    else console.log(`  ✓ ${s.name} → $${s.value}M ${s.tier}`);
  }
  if (notFound.length) console.warn(`\n  ⚠️  NOT FOUND IN DB:`, notFound.join(', '));

  // Also reset any surfers NOT in the update list (safety net)
  await supabase.from('surfers').update({ status: 'active' }).eq('is_on_tour', true);

  // --------------------------------------------------------
  // STEP 2: Clear user_teams for this event
  // --------------------------------------------------------
  console.log("\n--- Clearing existing Gold Coast user_teams ---");
  const { error: delErr } = await supabase.from('user_teams').delete().eq('event_id', EVENT_ID);
  if (delErr) console.error('  ERROR clearing teams:', delErr.message);
  else console.log('  ✓ user_teams cleared for Gold Coast');

  // --------------------------------------------------------
  // STEP 3: Clear existing heats for this event
  // --------------------------------------------------------
  console.log("\n--- Clearing existing heats ---");
  const { data: existingHeats } = await supabase.from('heats').select('id').eq('event_id', EVENT_ID);
  if (existingHeats && existingHeats.length > 0) {
    const heatIds = existingHeats.map(h => h.id);
    await supabase.from('scores').delete().in('heat_id', heatIds);
    await supabase.from('heat_assignments').delete().in('heat_id', heatIds);
    await supabase.from('heats').delete().in('id', heatIds);
    console.log(`  ✓ Cleared ${existingHeats.length} existing heats`);
  } else {
    console.log('  ✓ No existing heats to clear');
  }

  // --------------------------------------------------------
  // STEP 4: Create Round 1 heats
  // --------------------------------------------------------
  console.log("\n--- Creating Round 1 Heats ---");
  for (const h of round1Draw) {
    const { data: newHeat, error: hErr } = await supabase.from('heats')
      .insert({ event_id: EVENT_ID, round_number: 1, heat_number: h.heat, status: 'UPCOMING' })
      .select().single();
    if (hErr) { console.error(`  ERROR creating R1H${h.heat}:`, hErr.message); continue; }

    for (const sName of h.surfers) {
      const sId = findSurferId(sName, surferMap);
      if (sId) {
        await supabase.from('heat_assignments').insert({ heat_id: newHeat.id, surfer_id: sId });
      } else {
        console.error(`  SURFER NOT FOUND: ${sName}`);
      }
    }
    console.log(`  R1H${h.heat}: ${h.surfers.join(' vs ')} → winner to R2H${h.advanceWinnerTo.heat}`);
  }

  // --------------------------------------------------------
  // STEP 5: Create Round 2 heats (pre-seed known surfers)
  // --------------------------------------------------------
  console.log("\n--- Creating Round 2 Heats ---");
  for (const h of round2Draw) {
    const { data: newHeat, error: hErr } = await supabase.from('heats')
      .insert({ event_id: EVENT_ID, round_number: 2, heat_number: h.heat, status: 'UPCOMING' })
      .select().single();
    if (hErr) { console.error(`  ERROR creating R2H${h.heat}:`, hErr.message); continue; }

    for (const sName of h.surfers) {
      const sId = findSurferId(sName, surferMap);
      if (sId) {
        await supabase.from('heat_assignments').insert({ heat_id: newHeat.id, surfer_id: sId });
      } else {
        console.error(`  SURFER NOT FOUND: ${sName}`);
      }
    }
    const label = h.surfers.length === 1
      ? `${h.surfers[0]} + R1 winner`
      : h.surfers.join(' vs ');
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
    const names = h.heat_assignments?.map(a => a.surfers?.name).join(' vs ');
    console.log(`  R1H${h.heat_number}: ${names}`);
  });

  const { data: r2 } = await supabase.from('heats')
    .select('heat_number, heat_assignments(surfers(name))')
    .eq('event_id', EVENT_ID).eq('round_number', 2).order('heat_number');
  console.log("\nRound 2 (pre-seeded):");
  r2?.forEach(h => {
    const names = h.heat_assignments?.map(a => a.surfers?.name).join(' vs ') || '(empty)';
    console.log(`  R2H${h.heat_number}: ${names}`);
  });

  console.log("\n=== Done ===");
}

setup().catch(console.error);
