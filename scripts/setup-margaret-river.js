
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '0bf327c1-4e50-4f4b-97b6-13628a0c3387';

// ============================================================
// SURFER DATA from updated value sheet (values in millions)
// ============================================================
const surfersData = [
  // --- TIER A ---
  { name: 'Miguel Pupo', country: 'Brazil', tier: 'A', value: 22.0, stance: 'Goofy' },
  { name: 'Yago Dora', country: 'Brazil', tier: 'A', value: 20.0, stance: 'Goofy' },
  { name: 'Griffin Colapinto', country: 'USA', tier: 'A', value: 18.5, stance: 'Natural' },
  { name: 'Gabriel Medina', country: 'Brazil', tier: 'A', value: 17.0, stance: 'Goofy' },
  { name: 'Samuel Pupo', country: 'Brazil', tier: 'A', value: 16.0, stance: 'Natural' },
  { name: 'Kanoa Igarashi', country: 'Japan', tier: 'A', value: 15.0, stance: 'Natural' },
  { name: 'Leonardo Fioravanti', country: 'Italy', tier: 'A', value: 14.5, stance: 'Natural' },
  { name: 'Barron Mamiya', country: 'USA', tier: 'A', value: 14.0, stance: 'Natural' },
  { name: 'George Pittar', country: 'Australia', tier: 'A', value: 13.5, stance: 'Natural' },
  { name: 'Filipe Toledo', country: 'Brazil', tier: 'A', value: 13.0, stance: 'Natural' },
  // --- TIER B ---
  { name: 'Italo Ferreira', country: 'Brazil', tier: 'B', value: 10.0, stance: 'Goofy' },
  { name: 'Jordy Smith', country: 'South Africa', tier: 'B', value: 9.5, stance: 'Natural' },
  { name: 'Rio Waida', country: 'Indonesia', tier: 'B', value: 9.0, stance: 'Natural' },
  { name: 'Marco Mignot', country: 'France', tier: 'B', value: 8.5, stance: 'Natural' },
  { name: 'Jake Marshall', country: 'USA', tier: 'B', value: 8.0, stance: 'Natural' },
  { name: 'Alejo Muniz', country: 'Brazil', tier: 'B', value: 7.8, stance: 'Natural' },
  { name: 'Luke Thompson', country: 'South Africa', tier: 'B', value: 7.5, stance: 'Natural' },
  { name: 'Ethan Ewing', country: 'Australia', tier: 'B', value: 7.2, stance: 'Natural' },
  { name: 'Mateus Herdy', country: 'Brazil', tier: 'B', value: 7.0, stance: 'Natural' },
  { name: "Connor O'Leary", country: 'Japan', tier: 'B', value: 6.8, stance: 'Goofy' },
  { name: 'Joel Vaughan', country: 'Australia', tier: 'B', value: 6.5, stance: 'Natural' },
  { name: 'Kauli Vaast', country: 'France', tier: 'B', value: 6.2, stance: 'Goofy' },
  { name: 'Morgan Cibilic', country: 'Australia', tier: 'B', value: 6.0, stance: 'Natural' },
  // --- TIER C ---
  { name: 'Joao Chianca', country: 'Brazil', tier: 'C', value: 4.5, stance: 'Natural' },
  { name: 'Crosby Colapinto', country: 'USA', tier: 'C', value: 4.0, stance: 'Natural' },
  { name: 'Eli Hannerman', country: 'USA', tier: 'C', value: 3.8, stance: 'Natural' },
  { name: 'Seth Moniz', country: 'USA', tier: 'C', value: 3.5, stance: 'Natural' },
  { name: 'Cole Houshmand', country: 'USA', tier: 'C', value: 3.2, stance: 'Goofy' },
  { name: 'Jack Robinson', country: 'Australia', tier: 'C', value: 3.0, stance: 'Natural' },
  { name: 'Alan Cleland', country: 'Mexico', tier: 'C', value: 2.8, stance: 'Natural' },
  { name: "Liam O'Brien", country: 'Australia', tier: 'C', value: 2.5, stance: 'Natural' },
  { name: 'Ramzi Boukhiam', country: 'Morocco', tier: 'C', value: 2.2, stance: 'Goofy' },
  { name: 'Callum Robson', country: 'Australia', tier: 'C', value: 2.0, stance: 'Natural' },
  { name: 'Oscar Berry', country: 'Australia', tier: 'C', value: 1.8, stance: 'Natural' },
  { name: 'Jacob Willcox', country: 'Australia', tier: 'C', value: 1.5, stance: 'Goofy' },
  { name: 'Jack Thomas', country: 'Australia', tier: 'C', value: 1.0, stance: 'Goofy' },
];

// ============================================================
// HEAT DRAW
// ============================================================
const heatDraw = {
  round1: [
    { heat: 1, surfers: ['Oscar Berry', 'Jacob Willcox'] },        // Winner → R2H9
    { heat: 2, surfers: ['Mateus Herdy', 'Jack Thomas'] },          // Winner → R2H6
    { heat: 3, surfers: ['Callum Robson', "Liam O'Brien"] },        // Winner → R2H3
    { heat: 4, surfers: ['Luke Thompson', 'Ramzi Boukhiam'] },      // Winner → R2H13
  ],
  round2: [
    { heat: 1, surfers: ['Cole Houshmand', 'Samuel Pupo'] },
    { heat: 2, surfers: ['Kanoa Igarashi', 'Eli Hannerman'] },
    { heat: 3, surfers: ['Jordy Smith'] },                          // + R1H3 Winner
    { heat: 4, surfers: ['Barron Mamiya', 'Joel Vaughan'] },
    { heat: 5, surfers: ['Marco Mignot', 'Crosby Colapinto'] },
    { heat: 6, surfers: ['Griffin Colapinto'] },                     // + R1H2 Winner
    { heat: 7, surfers: ['Gabriel Medina', 'Alan Cleland'] },
    { heat: 8, surfers: ['Jack Robinson', 'Kauli Vaast'] },
    { heat: 9, surfers: ['Yago Dora'] },                            // + R1H1 Winner
    { heat: 10, surfers: ["Connor O'Leary", 'Rio Waida'] },
    { heat: 11, surfers: ['Filipe Toledo', 'George Pittar'] },
    { heat: 12, surfers: ['Leonardo Fioravanti', 'Seth Moniz'] },
    { heat: 13, surfers: ['Italo Ferreira'] },                      // + R1H4 Winner
    { heat: 14, surfers: ['Jake Marshall', 'Joao Chianca'] },
    { heat: 15, surfers: ['Ethan Ewing', 'Alejo Muniz'] },
    { heat: 16, surfers: ['Miguel Pupo', 'Morgan Cibilic'] },
  ]
};

// ============================================================
// Name aliases: CSV/draw name → known DB name variations
// ============================================================
const NAME_ALIASES = {
  'italo ferreira': ['italo ferreira', 'italo ferriera'],
  'ramzi boukhiam': ['ramzi boukhiam', 'ramzi boukhaim'],
  'cole houshmand': ['cole houshmand', 'cole houshman'],
  'mateus herdy': ['mateus herdy', 'matues herdy'],
  'eli hannerman': ['eli hannerman', 'eli hanneman'],
  'jacob willcox': ['jacob willcox', 'jacob wilcox'],
};

async function findSurferByName(name, surferMap) {
  const lower = name.toLowerCase().trim();

  // Direct match
  if (surferMap.has(lower)) return surferMap.get(lower);

  // Check aliases
  for (const [canonical, aliases] of Object.entries(NAME_ALIASES)) {
    if (aliases.includes(lower) || canonical === lower) {
      for (const alias of aliases) {
        if (surferMap.has(alias)) return surferMap.get(alias);
      }
    }
  }

  // Fuzzy: check if DB has a name that starts with the same first+last
  const parts = lower.split(' ');
  if (parts.length >= 2) {
    for (const [dbName, id] of surferMap.entries()) {
      const dbParts = dbName.split(' ');
      if (dbParts.length >= 2 &&
        dbParts[0].substring(0, 3) === parts[0].substring(0, 3) &&
        dbParts[dbParts.length - 1].substring(0, 4) === parts[parts.length - 1].substring(0, 4)) {
        return id;
      }
    }
  }

  return null;
}

async function setup() {
  console.log("=== Margaret River Pro Setup ===\n");

  // -------------------------------------------------------
  // STEP 0: Load all surfers from DB
  // -------------------------------------------------------
  const { data: allDbSurfers } = await supabase.from('surfers').select('id, name, status, is_on_tour');
  // Build map: lowercase name → id (prefer surfers that were active/eliminated over INACTIVE duplicates)
  const surferMap = new Map();
  const surferIdToName = new Map();

  // First pass: add INACTIVE surfers
  for (const s of allDbSurfers) {
    surferMap.set(s.name.toLowerCase().trim(), s.id);
    surferIdToName.set(s.id, s.name);
  }
  // Second pass: overwrite with active/eliminated surfers (they were in Bells, so they're "real")
  for (const s of allDbSurfers) {
    if (s.status !== 'INACTIVE') {
      surferMap.set(s.name.toLowerCase().trim(), s.id);
    }
  }

  console.log(`Loaded ${allDbSurfers.length} surfers from DB\n`);

  // -------------------------------------------------------
  // STEP 1: Reset ALL surfer statuses to ACTIVE, clear is_on_tour
  // -------------------------------------------------------
  console.log("Step 1: Resetting all surfer statuses...");
  await supabase.from('surfers').update({ status: 'ACTIVE', is_on_tour: false }).neq('id', '00000000-0000-0000-0000-000000000000');
  console.log("  All surfers reset to ACTIVE, is_on_tour=false\n");

  // -------------------------------------------------------
  // STEP 2: Update surfer values, tiers, and mark as on tour
  // -------------------------------------------------------
  console.log("Step 2: Updating surfer values and tiers...");
  const surferIds = []; // IDs of surfers in this event

  for (const s of surfersData) {
    let dbId = await findSurferByName(s.name, surferMap);

    if (!dbId) {
      // Create new surfer
      console.log(`  Creating new surfer: ${s.name}`);
      const { data: newSurfer, error } = await supabase.from('surfers')
        .insert({
          name: s.name,
          country: s.country,
          tier: s.tier,
          value: s.value,
          stance: s.stance,
          gender: 'Male',
          status: 'ACTIVE',
          is_on_tour: true,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random&size=200`
        })
        .select('id')
        .single();

      if (error) {
        console.error(`  ERROR creating ${s.name}:`, error.message);
        continue;
      }
      dbId = newSurfer.id;
      surferMap.set(s.name.toLowerCase(), dbId);
    } else {
      // Update existing surfer
      const { error } = await supabase.from('surfers')
        .update({
          tier: s.tier,
          value: s.value,
          stance: s.stance,
          status: 'ACTIVE',
          is_on_tour: true,
          country: s.country,
        })
        .eq('id', dbId);

      if (error) {
        console.error(`  ERROR updating ${s.name}:`, error.message);
      } else {
        console.log(`  Updated: ${s.name} → $${s.value}M (${s.tier})`);
      }
    }

    surferIds.push(dbId);
  }
  console.log(`\n  ${surferIds.length} surfers ready for event\n`);

  // -------------------------------------------------------
  // STEP 3: Clear user_teams for Margaret River event
  // -------------------------------------------------------
  console.log("Step 3: Clearing user teams for Margaret River...");
  const { count: deletedTeams, error: deleteErr } = await supabase
    .from('user_teams')
    .delete()
    .eq('event_id', EVENT_ID);

  if (deleteErr) {
    console.error("  ERROR clearing teams:", deleteErr.message);
  } else {
    console.log(`  Cleared user teams for Margaret River event\n`);
  }

  // -------------------------------------------------------
  // STEP 4: Clear any existing heats for this event
  // -------------------------------------------------------
  console.log("Step 4: Clearing existing heats...");
  const { data: existingHeats } = await supabase.from('heats').select('id').eq('event_id', EVENT_ID);
  if (existingHeats && existingHeats.length > 0) {
    for (const h of existingHeats) {
      await supabase.from('scores').delete().eq('heat_id', h.id);
      await supabase.from('heat_assignments').delete().eq('heat_id', h.id);
      await supabase.from('heats').delete().eq('id', h.id);
    }
    console.log(`  Cleared ${existingHeats.length} existing heats\n`);
  } else {
    console.log("  No existing heats to clear\n");
  }

  // -------------------------------------------------------
  // STEP 5: Create heat draws
  // -------------------------------------------------------
  console.log("Step 5: Creating heat draws...");

  // Round 1
  for (const h of heatDraw.round1) {
    const { data: heat, error: heatErr } = await supabase.from('heats')
      .insert({ event_id: EVENT_ID, round_number: 1, heat_number: h.heat, status: 'UPCOMING' })
      .select().single();

    if (heatErr) {
      console.error(`  ERROR creating R1 Heat ${h.heat}:`, heatErr.message);
      continue;
    }

    for (const sName of h.surfers) {
      const sId = await findSurferByName(sName, surferMap);
      if (sId) {
        await supabase.from('heat_assignments').insert({ heat_id: heat.id, surfer_id: sId });
        console.log(`  R1 Heat ${h.heat}: ${sName}`);
      } else {
        console.error(`  SURFER NOT FOUND: ${sName}`);
      }
    }
  }

  // Round 2
  for (const h of heatDraw.round2) {
    const { data: heat, error: heatErr } = await supabase.from('heats')
      .insert({ event_id: EVENT_ID, round_number: 2, heat_number: h.heat, status: 'UPCOMING' })
      .select().single();

    if (heatErr) {
      console.error(`  ERROR creating R2 Heat ${h.heat}:`, heatErr.message);
      continue;
    }

    for (const sName of h.surfers) {
      const sId = await findSurferByName(sName, surferMap);
      if (sId) {
        await supabase.from('heat_assignments').insert({ heat_id: heat.id, surfer_id: sId });
        console.log(`  R2 Heat ${h.heat}: ${sName}`);
      } else {
        console.error(`  SURFER NOT FOUND: ${sName}`);
      }
    }
  }

  // -------------------------------------------------------
  // STEP 6: Set event status to UPCOMING (drafting phase)
  // -------------------------------------------------------
  console.log("\nStep 6: Confirming event status...");
  await supabase.from('events')
    .update({ status: 'UPCOMING' })
    .eq('id', EVENT_ID);
  console.log("  Event set to UPCOMING (drafting open)\n");

  // -------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------
  console.log("=== Setup Complete ===");
  console.log(`Event: Western Australia Margaret River Pro`);
  console.log(`Surfers: ${surferIds.length}`);
  console.log(`Round 1 Heats: ${heatDraw.round1.length}`);
  console.log(`Round 2 Heats: ${heatDraw.round2.length}`);
  console.log(`\nNOTE: R2 Heats 3, 6, 9, 13 only have 1 surfer assigned.`);
  console.log(`The R1 winner will need to be added after R1 completes.`);
  console.log(`\n⚠️  BUDGET CHECK: A-tier values now range $13-22M.`);
  console.log(`The cheapest valid team (3A+4B+3C) costs ~$70M.`);
  console.log(`Current TOTAL_BUDGET in constants.ts is $60M — may need updating.`);
}

setup().catch(console.error);
