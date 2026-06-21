
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '0cbed25f-e36e-4c83-bd8f-20659e4b5a33'; // Rio Pro

const aliases = {
  'ramzi boukhiam': ['ramzi boukhiam', 'ramzi boukhaim'],
  "liam o'brien":   ["liam o'brien"],
  'cole houshmand':  ['cole houshmand', 'cole houshman'],
  'eli hannerman':  ['eli hannerman', 'eli hanneman'],
  "connor o'leary": ["connor o'leary"],
  'italo ferreira': ['italo ferreira', 'italo ferriera'],
  'weslley dantas': ['weslley dantas', 'wesley dantas'],
  'lucas chianca':  ['lucas chianca', 'lucas chumbinho'],
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

// Enter scores. Each surfer has either {w1, w2} (exact waves) or {total} (split evenly).
async function enterScores(heatId, surfers, surferMap) {
  for (const s of surfers) {
    const surferId = findSurferId(s.name, surferMap);
    if (!surferId) { console.error(`  ⚠️  NOT FOUND: ${s.name}`); continue; }

    let w1, w2;
    if (s.w1 != null) { w1 = s.w1; w2 = s.w2; }
    else { w1 = parseFloat((s.total / 2).toFixed(2)); w2 = parseFloat((s.total - w1).toFixed(2)); }
    const total = parseFloat((w1 + w2).toFixed(2));

    await supabase.from('scores').delete().eq('heat_id', heatId).eq('surfer_id', surferId);
    await supabase.from('scores').insert([
      { heat_id: heatId, surfer_id: surferId, wave_score: w1 },
      { heat_id: heatId, surfer_id: surferId, wave_score: w2 },
    ]);

    await supabase.from('heat_assignments')
      .update({ heat_score: total })
      .eq('heat_id', heatId).eq('surfer_id', surferId);

    await supabase.from('surfers').update({ status: s.status }).eq('id', surferId);

    const m = s.status === 'ELIMINATED' ? '❌' : '✓';
    console.log(`    ${m} ${s.name}: ${total}`);
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
// ROUND 1 RESULTS (exact wave scores from image)
// "Event Seed #36" revealed as Lucas Chianca (BRA)
// ============================================================
const r1Results = [
  { heat: 1, surfers: [
    { name: 'Ramzi Boukhiam', w1: 4.00, w2: 3.00, status: 'active' },
    { name: 'Lucas Chianca',  w1: 3.33, w2: 3.10, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Matthew McGillivray', w1: 6.50, w2: 5.17, status: 'active' },
    { name: 'Luke Thompson',       w1: 4.33, w2: 0.80, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: 'Weslley Dantas', w1: 5.00, w2: 4.67, status: 'active' },
    { name: 'Seth Moniz',     w1: 4.77, w2: 4.30, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Eli Hannerman', w1: 5.67, w2: 3.50, status: 'active' },
    { name: 'Oscar Berry',   w1: 4.00, w2: 2.50, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// ROUND 2 RESULTS (totals from bracket — split evenly)
// Upsets: Medina, G.Colapinto, Toledo eliminated!
// ============================================================
const r2Results = [
  { heat:  1, surfers: [
    { name: 'Jack Robinson', total: 14.33, status: 'active' },
    { name: 'Rio Waida',     total: 12.53, status: 'ELIMINATED' },
  ]},
  { heat:  2, surfers: [
    { name: 'Samuel Pupo',  total: 11.07, status: 'active' },
    { name: 'Alan Cleland', total:  8.50, status: 'ELIMINATED' },
  ]},
  { heat:  3, surfers: [
    { name: 'Leonardo Fioravanti', total: 12.27, status: 'active' },
    { name: 'Weslley Dantas',      total: 11.60, status: 'ELIMINATED' },
  ]},
  { heat:  4, surfers: [
    { name: "Liam O'Brien", total: 13.93, status: 'active' },
    { name: 'Jake Marshall', total: 10.83, status: 'ELIMINATED' },
  ]},
  { heat:  5, surfers: [
    { name: 'Morgan Cibilic', total: 9.44, status: 'active' },
    { name: "Connor O'Leary", total: 9.30, status: 'ELIMINATED' },
  ]},
  { heat:  6, surfers: [
    { name: 'Matthew McGillivray', total: 13.53, status: 'active' },   // upset!
    { name: 'Gabriel Medina',      total: 13.13, status: 'ELIMINATED' },
  ]},
  { heat:  7, surfers: [
    { name: 'Joao Chianca',      total: 14.84, status: 'active' },     // upset!
    { name: 'Griffin Colapinto', total:  7.17, status: 'ELIMINATED' },
  ]},
  { heat:  8, surfers: [
    { name: 'George Pittar', total: 15.00, status: 'active' },
    { name: 'Joel Vaughan',  total:  6.53, status: 'ELIMINATED' },
  ]},
  { heat:  9, surfers: [
    { name: 'Italo Ferreira', total: 14.33, status: 'active' },
    { name: 'Ramzi Boukhiam', total: 10.97, status: 'ELIMINATED' },
  ]},
  { heat: 10, surfers: [
    { name: 'Kauli Vaast',      total: 13.73, status: 'active' },
    { name: 'Crosby Colapinto', total: 11.50, status: 'ELIMINATED' },
  ]},
  { heat: 11, surfers: [
    { name: 'Ethan Ewing', total: 12.66, status: 'active' },
    { name: 'Alejo Muniz', total: 10.30, status: 'ELIMINATED' },
  ]},
  { heat: 12, surfers: [
    { name: 'Kanoa Igarashi', total: 12.23, status: 'active' },
    { name: 'Cole Houshmand', total: 11.77, status: 'ELIMINATED' },
  ]},
  { heat: 13, surfers: [
    { name: 'Yago Dora',     total: 13.83, status: 'active' },
    { name: 'Eli Hannerman', total: 12.90, status: 'ELIMINATED' },
  ]},
  { heat: 14, surfers: [
    { name: 'Marco Mignot',  total: 12.74, status: 'active' },
    { name: 'Barron Mamiya', total: 10.43, status: 'ELIMINATED' },
  ]},
  { heat: 15, surfers: [
    { name: 'Callum Robson', total: 14.93, status: 'active' },         // upset!
    { name: 'Filipe Toledo', total: 13.00, status: 'ELIMINATED' },
  ]},
  { heat: 16, surfers: [
    { name: 'Miguel Pupo',  total: 12.97, status: 'active' },
    { name: 'Mateus Herdy', total: 10.94, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// ROUND 3 RESULTS (totals from bracket — split evenly)
// Big one: Ferreira eliminated by Vaast!
// ============================================================
const r3Results = [
  { heat: 1, surfers: [
    { name: 'Samuel Pupo',   total: 15.84, status: 'active' },
    { name: 'Jack Robinson', total:  9.94, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Leonardo Fioravanti', total: 16.50, status: 'active' },
    { name: "Liam O'Brien",        total: 13.33, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: 'Morgan Cibilic',      total: 13.40, status: 'active' },
    { name: 'Matthew McGillivray', total: 11.50, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Joao Chianca',  total: 14.30, status: 'active' },
    { name: 'George Pittar', total: 13.26, status: 'ELIMINATED' },
  ]},
  { heat: 5, surfers: [
    { name: 'Kauli Vaast',    total: 14.17, status: 'active' },        // upset!
    { name: 'Italo Ferreira', total: 12.87, status: 'ELIMINATED' },
  ]},
  { heat: 6, surfers: [
    { name: 'Ethan Ewing',    total: 14.33, status: 'active' },
    { name: 'Kanoa Igarashi', total: 12.27, status: 'ELIMINATED' },
  ]},
  { heat: 7, surfers: [
    { name: 'Yago Dora',    total: 15.00, status: 'active' },
    { name: 'Marco Mignot', total: 10.33, status: 'ELIMINATED' },
  ]},
  { heat: 8, surfers: [
    { name: 'Miguel Pupo',   total: 14.03, status: 'active' },
    { name: 'Callum Robson', total: 12.17, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// QUARTERFINALS DRAW (round 4) — not yet surfed
// QF1: S.Pupo vs Fioravanti   (R3H1 vs R3H2)
// QF2: Cibilic vs J.Chianca   (R3H3 vs R3H4)
// QF3: Vaast vs Ewing         (R3H5 vs R3H6)
// QF4: Dora vs M.Pupo         (R3H7 vs R3H8)
// ============================================================
const qfDraw = [
  { heat: 1, surfers: ['Samuel Pupo', 'Leonardo Fioravanti'] },
  { heat: 2, surfers: ['Morgan Cibilic', 'Joao Chianca'] },
  { heat: 3, surfers: ['Kauli Vaast', 'Ethan Ewing'] },
  { heat: 4, surfers: ['Yago Dora', 'Miguel Pupo'] },
];

async function run() {
  console.log("=== Rio Pro — R1 / R2 / R3 Update ===\n");

  // ---- Ensure Lucas Chianca exists (Event Seed #36) ----
  console.log("--- Ensuring Lucas Chianca exists (Event Seed #36) ---");
  const { data: allSurfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  allSurfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  let lucasId = findSurferId('Lucas Chianca', surferMap);
  if (!lucasId) {
    const { data: newS, error } = await supabase.from('surfers').insert({
      name: 'Lucas Chianca', country: 'Brazil', is_on_tour: true, status: 'active', value: 0.50, tier: 'C',
    }).select().single();
    if (error) console.error('  ERROR:', error.message);
    else { lucasId = newS.id; surferMap.set('lucas chianca', lucasId); console.log('  ✓ Created Lucas Chianca (Brazil, $0.50M C)'); }
  } else {
    console.log('  ℹ️  Lucas Chianca already exists');
  }

  // refresh map
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

  // ---- Round 3 ----
  console.log("\n--- Round 3 Results ---");
  for (const h of r3Results) {
    console.log(`  R3H${h.heat}:`);
    const heatId = await getOrCreateHeat(3, h.heat);
    await assignSurfers(heatId, h.surfers.map(s => s.name), surferMap);
    await enterScores(heatId, h.surfers, surferMap);
  }

  // ---- Quarterfinals Draw ----
  console.log("\n--- Creating Quarterfinals Draw (round 4) ---");
  for (const h of qfDraw) {
    const heatId = await getOrCreateHeat(4, h.heat);
    await assignSurfers(heatId, h.surfers, surferMap);
    await supabase.from('heats').update({ status: 'UPCOMING' }).eq('id', heatId);
    console.log(`  QF H${h.heat}: ${h.surfers.join(' vs ')}`);
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
  const surferIdToName = new Map(surfers2.map(s => [s.id, s.name]));
  const { data: activeS } = await supabase.from('surfers')
    .select('name').eq('status', 'active').eq('is_on_tour', true);

  console.log('\n🚨 R2 upsets: Medina, Griffin Colapinto, Filipe Toledo eliminated');
  console.log('🚨 R3 shock: Italo Ferreira eliminated by Kauli Vaast (12.87 vs 14.17)');

  const topSurfers = Object.entries(surferTotals).sort(([,a],[,b]) => b - a).slice(0, 8);
  console.log("\nTop 8 surfer totals (Rio):");
  topSurfers.forEach(([id, pts]) => console.log(`  ${surferIdToName.get(id)}: ${pts.toFixed(2)}`));

  console.log('\n=== Quarterfinals Draw ===');
  qfDraw.forEach(h => console.log(`  QF H${h.heat}: ${h.surfers.join(' vs ')}`));

  console.log('\n=== Done ===');
}

run().catch(console.error);
