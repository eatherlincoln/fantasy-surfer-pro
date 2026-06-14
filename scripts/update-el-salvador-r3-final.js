
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
    const w1 = parseFloat((s.total / 2).toFixed(2));
    const w2 = parseFloat((s.total - w1).toFixed(2));
    await supabase.from('scores').insert([
      { heat_id: heatId, surfer_id: surferId, wave_score: w1 },
      { heat_id: heatId, surfer_id: surferId, wave_score: w2 },
    ]);

    await supabase.from('heat_assignments')
      .update({ heat_score: s.total })
      .eq('heat_id', heatId).eq('surfer_id', surferId);

    await supabase.from('surfers').update({ status: s.status }).eq('id', surferId);

    const m = s.status === 'ELIMINATED' ? '❌' : '✓';
    console.log(`    ${m} ${s.name}: ${s.total}`);
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
// ROUND 3 RESULTS
// R3H1: Robson 12.50 def O'Brien 5.13
// R3H2: Igarashi 9.67 def Hanneman 9.17
// R3H3: Mignot 12.84 def Dora 12.83  ← razor thin!
// R3H4: Fioravanti 15.50 def S.Pupo 14.27
// R3H5: Ferreira 12.50 def C.Colapinto 11.00
// R3H6: Vaast 12.76 def Chianca 10.76
// R3H7: Medina 13.34 def Robinson 7.87
// R3H8: Cleland 12.80 def Mamiya 10.26
// ============================================================
const r3Results = [
  { heat: 1, surfers: [
    { name: 'Callum Robson', total: 12.50, status: 'active' },
    { name: "Liam O'Brien",  total:  5.13, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Kanoa Igarashi', total: 9.67, status: 'active' },
    { name: 'Eli Hannerman',  total: 9.17, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: 'Marco Mignot', total: 12.84, status: 'active' },
    { name: 'Yago Dora',    total: 12.83, status: 'ELIMINATED' }, // 0.01 margin!
  ]},
  { heat: 4, surfers: [
    { name: 'Leonardo Fioravanti', total: 15.50, status: 'active' },
    { name: 'Samuel Pupo',         total: 14.27, status: 'ELIMINATED' },
  ]},
  { heat: 5, surfers: [
    { name: 'Italo Ferreira',  total: 12.50, status: 'active' },
    { name: 'Crosby Colapinto', total: 11.00, status: 'ELIMINATED' },
  ]},
  { heat: 6, surfers: [
    { name: 'Kauli Vaast',  total: 12.76, status: 'active' },
    { name: 'Joao Chianca', total: 10.76, status: 'ELIMINATED' },
  ]},
  { heat: 7, surfers: [
    { name: 'Gabriel Medina', total: 13.34, status: 'active' },
    { name: 'Jack Robinson',  total:  7.87, status: 'ELIMINATED' },
  ]},
  { heat: 8, surfers: [
    { name: 'Alan Cleland',  total: 12.80, status: 'active' },
    { name: 'Barron Mamiya', total: 10.26, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// QUARTERFINALS (round 4)
// QF H1: Igarashi 14.67 def Robson 13.27
// QF H2: Fioravanti 15.93 def Mignot 13.00
// QF H3: Ferreira 10.67 def Vaast 8.33
// QF H4: Medina 8.80 def Cleland 8.10
// ============================================================
const qfResults = [
  { heat: 1, surfers: [
    { name: 'Kanoa Igarashi', total: 14.67, status: 'active' },
    { name: 'Callum Robson',  total: 13.27, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Leonardo Fioravanti', total: 15.93, status: 'active' },
    { name: 'Marco Mignot',        total: 13.00, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: 'Italo Ferreira', total: 10.67, status: 'active' },
    { name: 'Kauli Vaast',    total:  8.33, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Gabriel Medina', total: 8.80, status: 'active' },
    { name: 'Alan Cleland',   total: 8.10, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// SEMIFINALS (round 5)
// SF H1: Fioravanti 12.00 def Igarashi 10.10
// SF H2: Ferreira 14.70 def Medina 14.17
// ============================================================
const sfResults = [
  { heat: 1, surfers: [
    { name: 'Leonardo Fioravanti', total: 12.00, status: 'active' },
    { name: 'Kanoa Igarashi',      total: 10.10, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Italo Ferreira', total: 14.70, status: 'active' },
    { name: 'Gabriel Medina', total: 14.17, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// FINAL (round 6)
// Fioravanti 15.33 def Ferreira 10.90
// LEONARDO FIORAVANTI WINS EL SALVADOR PRO! 🏆
// ============================================================
const finalResults = [
  { heat: 1, surfers: [
    { name: 'Leonardo Fioravanti', total: 15.33, status: 'active' },     // 🏆 WINNER
    { name: 'Italo Ferreira',      total: 10.90, status: 'ELIMINATED' }, // runner-up
  ]},
];

async function run() {
  console.log("=== El Salvador Pro — R3 / QF / SF / Final ===\n");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // --- Round 3 ---
  console.log("--- Round 3 ---");
  for (const h of r3Results) {
    console.log(`  R3H${h.heat}:`);
    const heatId = await getOrCreateHeat(3, h.heat);
    await assignSurfers(heatId, h.surfers.map(s => s.name), surferMap);
    await enterScores(heatId, h.surfers, surferMap);
  }

  // --- Quarterfinals ---
  console.log("\n--- Quarterfinals (round 4) ---");
  for (const h of qfResults) {
    console.log(`  QF H${h.heat}:`);
    const heatId = await getOrCreateHeat(4, h.heat);
    await assignSurfers(heatId, h.surfers.map(s => s.name), surferMap);
    await enterScores(heatId, h.surfers, surferMap);
  }

  // --- Semifinals ---
  console.log("\n--- Semifinals (round 5) ---");
  for (const h of sfResults) {
    console.log(`  SF H${h.heat}:`);
    const heatId = await getOrCreateHeat(5, h.heat);
    await assignSurfers(heatId, h.surfers.map(s => s.name), surferMap);
    await enterScores(heatId, h.surfers, surferMap);
  }

  // --- Final ---
  console.log("\n--- Final (round 6) ---");
  const heatId = await getOrCreateHeat(6, 1);
  await assignSurfers(heatId, finalResults[0].surfers.map(s => s.name), surferMap);
  await enterScores(heatId, finalResults[0].surfers, surferMap);

  // --- Mark event COMPLETED ---
  await supabase.from('events').update({ status: 'COMPLETED' }).eq('id', EVENT_ID);
  console.log('\n✓ Event marked COMPLETED');

  // --- Recalculate all team points ---
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
    console.log('  ℹ️  No teams drafted');
  }

  // --- Verification ---
  console.log("\n=== Verification ===");
  const surferIdToName = new Map(surfers.map(s => [s.id, s.name]));
  const topSurfers = Object.entries(surferTotals)
    .sort(([,a],[,b]) => b - a).slice(0, 8);
  console.log("\nTop 8 surfer totals (El Salvador):");
  topSurfers.forEach(([id, pts]) => console.log(`  ${surferIdToName.get(id)}: ${pts.toFixed(2)}`));

  console.log('\n🏆 LEONARDO FIORAVANTI — EL SALVADOR PRO CHAMPION!');
  console.log('   Final: Fioravanti 15.33 def Ferreira 10.90');
  console.log('\n=== Done ===');
}

run().catch(console.error);
