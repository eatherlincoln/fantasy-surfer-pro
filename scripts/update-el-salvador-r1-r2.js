
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '2b7fea50-4f44-40a7-828b-65caf6bbbb7b'; // El Salvador Pro

const aliases = {
  'ramzi boukhiam':   ['ramzi boukhiam', 'ramzi boukhaim'],
  "liam o'brien":     ["liam o'brien"],
  'cole houshmand':   ['cole houshmand', 'cole houshman'],
  'eli hannerman':    ['eli hannerman', 'eli hanneman'],
  "connor o'leary":   ["connor o'leary"],
  'italo ferreira':   ['italo ferreira', 'italo ferriera'],
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

async function enterScores(heatId, surfers, surferMap) {
  for (const s of surfers) {
    const surferId = findSurferId(s.name, surferMap);
    if (!surferId) { console.error(`  ⚠️  NOT FOUND: ${s.name}`); continue; }

    await supabase.from('scores').delete().eq('heat_id', heatId).eq('surfer_id', surferId);
    await supabase.from('scores').insert([
      { heat_id: heatId, surfer_id: surferId, wave_score: s.w1 },
      { heat_id: heatId, surfer_id: surferId, wave_score: s.w2 },
    ]);

    const total = parseFloat((s.w1 + s.w2).toFixed(2));
    await supabase.from('heat_assignments')
      .update({ heat_score: total })
      .eq('heat_id', heatId).eq('surfer_id', surferId);

    await supabase.from('surfers').update({ status: s.status }).eq('id', surferId);

    const m = s.status === 'ELIMINATED' ? '❌' : '✓';
    console.log(`    ${m} ${s.name}: ${total} (${s.w1} + ${s.w2})`);
  }
  await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heatId);
}

async function getOrCreateHeat(round, heat) {
  const { data: existing } = await supabase.from('heats').select('id')
    .eq('event_id', EVENT_ID).eq('round_number', round).eq('heat_number', heat).single();
  if (existing) return existing.id;
  const { data } = await supabase.from('heats')
    .insert({ event_id: EVENT_ID, round_number: round, heat_number: heat, status: 'UPCOMING' })
    .select().single();
  return data.id;
}

async function assignSurfers(heatId, names, surferMap) {
  await supabase.from('heat_assignments').delete().eq('heat_id', heatId);
  for (const name of names) {
    const sId = findSurferId(name, surferMap);
    if (sId) await supabase.from('heat_assignments').insert({ heat_id: heatId, surfer_id: sId });
    else console.error(`  ⚠️  NOT FOUND for draw: ${name}`);
  }
}

// ============================================================
// ROUND 1 RESULTS (actual wave scores from image)
// H1: Boukhiam 14.50 def McGillivray 11.83
// H2: Thompson 12.50 def Melvin Ayala 7.27  ← "Event Seed #36" revealed!
// H3: Hanneman 13.66 def Perez 10.17
// H4: Moniz 11.50 def Berry 9.90
// ============================================================
const r1Results = [
  { heat: 1, surfers: [
    { name: 'Ramzi Boukhiam',      w1: 7.83, w2: 6.67, status: 'active' },
    { name: 'Matthew McGillivray', w1: 6.33, w2: 5.50, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Luke Thompson', w1: 6.83, w2: 5.67, status: 'active' },
    { name: 'Melvin Ayala',  w1: 3.77, w2: 3.50, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: 'Eli Hannerman', w1: 7.33, w2: 6.33, status: 'active' },
    { name: 'Bryan Perez',   w1: 5.50, w2: 4.67, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Seth Moniz',  w1: 6.17, w2: 5.33, status: 'active' },
    { name: 'Oscar Berry', w1: 6.33, w2: 3.57, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// ROUND 2 RESULTS
// Major upsets: Ewing, M.Pupo, Toledo, Pittar, O'Leary, G.Colapinto all eliminated!
// ============================================================
const r2Results = [
  { heat:  1, surfers: [
    { name: "Liam O'Brien", w1: 7.47, w2: 7.46, status: 'active' },
    { name: 'Jake Marshall', w1: 6.55, w2: 6.55, status: 'ELIMINATED' },
  ]},
  { heat:  2, surfers: [
    { name: 'Callum Robson', w1: 6.15, w2: 6.15, status: 'active' },
    { name: 'Ethan Ewing',   w1: 5.74, w2: 5.73, status: 'ELIMINATED' },  // upset!
  ]},
  { heat:  3, surfers: [
    { name: 'Eli Hannerman', w1: 8.08, w2: 8.08, status: 'active' },  // upset!
    { name: 'Miguel Pupo',   w1: 6.08, w2: 6.08, status: 'ELIMINATED' },
  ]},
  { heat:  4, surfers: [
    { name: 'Kanoa Igarashi', w1: 7.09, w2: 7.08, status: 'active' },
    { name: 'Alejo Muniz',    w1: 6.02, w2: 6.01, status: 'ELIMINATED' },
  ]},
  { heat:  5, surfers: [
    { name: 'Marco Mignot', w1: 6.44, w2: 6.43, status: 'active' },
    { name: 'Rio Waida',    w1: 3.34, w2: 3.33, status: 'ELIMINATED' },
  ]},
  { heat:  6, surfers: [
    { name: 'Yago Dora',     w1: 5.80, w2: 5.80, status: 'active' },
    { name: 'Luke Thompson', w1: 4.78, w2: 4.78, status: 'ELIMINATED' },
  ]},
  { heat:  7, surfers: [
    { name: 'Samuel Pupo',  w1: 7.59, w2: 7.58, status: 'active' },
    { name: 'Joel Vaughan', w1: 5.25, w2: 5.25, status: 'ELIMINATED' },
  ]},
  { heat:  8, surfers: [
    { name: 'Leonardo Fioravanti', w1: 7.52, w2: 7.52, status: 'active' },
    { name: 'Mateus Herdy',        w1: 7.35, w2: 7.35, status: 'ELIMINATED' },
  ]},
  { heat:  9, surfers: [
    { name: 'Italo Ferreira', w1: 6.25, w2: 6.25, status: 'active' },
    { name: 'Ramzi Boukhiam', w1: 5.93, w2: 5.93, status: 'ELIMINATED' },
  ]},
  { heat: 10, surfers: [
    { name: 'Crosby Colapinto', w1: 7.59, w2: 7.58, status: 'active' },
    { name: 'Morgan Cibilic',   w1: 6.52, w2: 6.51, status: 'ELIMINATED' },
  ]},
  { heat: 11, surfers: [
    { name: 'Kauli Vaast',  w1: 7.02, w2: 7.01, status: 'active' },  // upset!
    { name: 'Filipe Toledo', w1: 6.94, w2: 6.93, status: 'ELIMINATED' },
  ]},
  { heat: 12, surfers: [
    { name: 'Joao Chianca', w1: 5.75, w2: 5.75, status: 'active' },  // upset!
    { name: 'George Pittar', w1: 5.50, w2: 5.50, status: 'ELIMINATED' },
  ]},
  { heat: 13, surfers: [
    { name: 'Gabriel Medina', w1: 7.59, w2: 7.58, status: 'active' },
    { name: 'Seth Moniz',     w1: 3.50, w2: 3.50, status: 'ELIMINATED' },
  ]},
  { heat: 14, surfers: [
    { name: 'Jack Robinson',  w1: 6.17, w2: 6.16, status: 'active' },
    { name: 'Cole Houshmand', w1: 5.89, w2: 5.88, status: 'ELIMINATED' },
  ]},
  { heat: 15, surfers: [
    { name: 'Barron Mamiya',  w1: 6.25, w2: 6.25, status: 'active' },  // upset!
    { name: "Connor O'Leary", w1: 4.14, w2: 4.13, status: 'ELIMINATED' },
  ]},
  { heat: 16, surfers: [
    { name: 'Alan Cleland',     w1: 6.17, w2: 6.17, status: 'active' },  // huge upset!
    { name: 'Griffin Colapinto', w1: 5.54, w2: 5.53, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// ROUND 3 DRAW (pre-seeded, not yet surfed)
// R3H1: O'Brien vs Robson       (R2H1 winner vs R2H2 winner)
// R3H2: Hanneman vs Igarashi    (R2H3 winner vs R2H4 winner)
// R3H3: Mignot vs Dora          (R2H5 winner vs R2H6 winner)
// R3H4: S.Pupo vs Fioravanti    (R2H7 winner vs R2H8 winner)
// R3H5: Ferreira vs C.Colapinto (R2H9 winner vs R2H10 winner)
// R3H6: Vaast vs Chianca        (R2H11 winner vs R2H12 winner)
// R3H7: Medina vs Robinson      (R2H13 winner vs R2H14 winner)
// R3H8: Mamiya vs Cleland       (R2H15 winner vs R2H16 winner)
// ============================================================
const r3Draw = [
  { heat: 1, surfers: ["Liam O'Brien", 'Callum Robson'] },
  { heat: 2, surfers: ['Eli Hannerman', 'Kanoa Igarashi'] },
  { heat: 3, surfers: ['Marco Mignot', 'Yago Dora'] },
  { heat: 4, surfers: ['Samuel Pupo', 'Leonardo Fioravanti'] },
  { heat: 5, surfers: ['Italo Ferreira', 'Crosby Colapinto'] },
  { heat: 6, surfers: ['Kauli Vaast', 'Joao Chianca'] },
  { heat: 7, surfers: ['Gabriel Medina', 'Jack Robinson'] },
  { heat: 8, surfers: ['Barron Mamiya', 'Alan Cleland'] },
];

async function run() {
  console.log("=== El Salvador Pro — R1 / R2 Update ===\n");

  // ---- Create / find Melvin Ayala (revealed as Event Seed #36) ----
  console.log("--- Ensuring Melvin Ayala exists (Event Seed #36) ---");
  const { data: allSurfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  allSurfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  let ayalaId = surferMap.get('melvin ayala');
  if (!ayalaId) {
    const { data: newS, error } = await supabase.from('surfers').insert({
      name: 'Melvin Ayala',
      country: 'El Salvador',
      is_on_tour: true,
      status: 'active',
      value: 0.50,
      tier: 'C',
    }).select().single();
    if (error) {
      console.error('  ERROR creating Melvin Ayala:', error.message);
    } else {
      ayalaId = newS.id;
      surferMap.set('melvin ayala', ayalaId);
      console.log('  ✓ Created Melvin Ayala (El Salvador, $0.50M C)');
    }
  } else {
    console.log('  ℹ️  Melvin Ayala already exists');
  }

  // Add Ayala to R1H2 if not already there
  const { data: r1h2 } = await supabase.from('heats').select('id')
    .eq('event_id', EVENT_ID).eq('round_number', 1).eq('heat_number', 2).single();
  if (r1h2 && ayalaId) {
    const { data: existing } = await supabase.from('heat_assignments')
      .select('id').eq('heat_id', r1h2.id).eq('surfer_id', ayalaId).single();
    if (!existing) {
      await supabase.from('heat_assignments').insert({ heat_id: r1h2.id, surfer_id: ayalaId });
      console.log('  ✓ Added Melvin Ayala to R1H2');
    } else {
      console.log('  ℹ️  Ayala already assigned to R1H2');
    }
  }

  // Refresh surfer map
  const { data: surfers2 } = await supabase.from('surfers').select('id, name');
  surfers2.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // ---- Mark event LIVE ----
  await supabase.from('events').update({ status: 'LIVE' }).eq('id', EVENT_ID);
  console.log('\n✓ Event marked LIVE\n');

  // ---- Round 1 ----
  console.log("--- Round 1 Results ---");
  for (const h of r1Results) {
    console.log(`  R1H${h.heat}:`);
    const heatId = await getOrCreateHeat(1, h.heat);
    await assignSurfers(heatId, h.surfers.map(s => s.name), surferMap);
    await enterScores(heatId, h.surfers, surferMap);
  }

  // ---- Round 2 ----
  console.log("\n--- Round 2 Results ---");
  for (const h of r2Results) {
    console.log(`  R2H${h.heat}:`);
    const heatId = await getOrCreateHeat(2, h.heat);
    await assignSurfers(heatId, h.surfers.map(s => s.name), surferMap);
    await enterScores(heatId, h.surfers, surferMap);
  }

  // ---- Round 3 Draw ----
  console.log("\n--- Creating Round 3 Draw ---");
  for (const h of r3Draw) {
    // Delete old R3 heat if exists
    const { data: existing } = await supabase.from('heats').select('id')
      .eq('event_id', EVENT_ID).eq('round_number', 3).eq('heat_number', h.heat).single();
    if (existing) {
      await supabase.from('heat_assignments').delete().eq('heat_id', existing.id);
      await supabase.from('heats').delete().eq('id', existing.id);
    }
    const { data: newHeat } = await supabase.from('heats')
      .insert({ event_id: EVENT_ID, round_number: 3, heat_number: h.heat, status: 'UPCOMING' })
      .select().single();
    for (const name of h.surfers) {
      const sId = findSurferId(name, surferMap);
      if (sId) await supabase.from('heat_assignments').insert({ heat_id: newHeat.id, surfer_id: sId });
      else console.error(`  ⚠️  NOT FOUND: ${name}`);
    }
    console.log(`  R3H${h.heat}: ${h.surfers.join(' vs ')}`);
  }

  // ---- Recalculate team points ----
  console.log("\n--- Recalculating Team Points ---");
  const { data: allAssignments } = await supabase.from('heat_assignments')
    .select('surfer_id, heat_score, heat:heats!inner(event_id)')
    .eq('heats.event_id', EVENT_ID);

  const surferTotals = {};
  for (const a of allAssignments) {
    if (!a.heat_score) continue;
    if (!surferTotals[a.surfer_id]) surferTotals[a.surfer_id] = 0;
    surferTotals[a.surfer_id] += a.heat_score;
  }

  const { data: teams } = await supabase.from('user_teams')
    .select('id, user_id, surfer_id').eq('event_id', EVENT_ID);

  if (teams && teams.length > 0) {
    console.log(`  Updating ${teams.length} team picks...`);
    for (const team of teams) {
      const points = surferTotals[team.surfer_id] || 0;
      await supabase.from('user_teams').update({ points }).eq('id', team.id);
    }

    const userIds = [...new Set(teams.map(t => t.user_id))];
    for (const userId of userIds) {
      const { data: allUserTeams } = await supabase.from('user_teams').select('points').eq('user_id', userId);
      const totalPoints = allUserTeams ? allUserTeams.reduce((sum, t) => sum + (t.points || 0), 0) : 0;
      await supabase.from('profiles').update({ total_fantasy_points: totalPoints }).eq('id', userId);
    }

    const { data: leagueMembers } = await supabase.from('league_members').select('id, profile_id');
    if (leagueMembers) {
      for (const lm of leagueMembers) {
        const { data: profile } = await supabase.from('profiles')
          .select('total_fantasy_points').eq('id', lm.profile_id).single();
        if (profile) {
          await supabase.from('league_members').update({ total_points: profile.total_fantasy_points }).eq('id', lm.id);
        }
      }
    }
    console.log('  ✓ Points updated');
  } else {
    console.log('  ℹ️  No teams drafted yet');
  }

  // ---- Verification ----
  console.log("\n=== Verification ===");
  const surferIdToName = new Map(allSurfers.map(s => [s.id, s.name]));

  const { data: activeS } = await supabase.from('surfers')
    .select('name').eq('status', 'active').eq('is_on_tour', true);
  console.log(`\nStill active (${activeS?.length}): ${activeS?.map(s => s.name).join(', ')}`);

  console.log('\nKey upsets / results:');
  console.log('  🚨 Ethan Ewing ELIMINATED in R2 (11.47 vs Robson 12.30)');
  console.log('  🚨 Miguel Pupo ELIMINATED in R2 (12.16 vs Hanneman 16.16)');
  console.log('  🚨 Filipe Toledo ELIMINATED in R2 (13.87 vs Vaast 14.03)');
  console.log('  🚨 George Pittar ELIMINATED in R2 (11.00 vs Chianca 11.50)');
  console.log('  🚨 Connor O\'Leary ELIMINATED in R2 (8.27 vs Mamiya 12.50)');
  console.log('  🚨 Griffin Colapinto ELIMINATED in R2 (11.07 vs Cleland 12.34)');
  console.log('\n  🏄 Surprise R3 qualifiers: Eli Hanneman, Callum Robson, Barron Mamiya, Alan Cleland!');

  console.log('\n=== Round 3 Draw ===');
  r3Draw.forEach(h => console.log(`  R3H${h.heat}: ${h.surfers.join(' vs ')}`));

  console.log('\n=== Done ===');
}

run().catch(console.error);
