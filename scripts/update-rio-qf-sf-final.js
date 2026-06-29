
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
// QUARTERFINALS (round 4)
// QF1: Fioravanti 13.23 def S.Pupo 12.50
// QF2: J.Chianca 13.27 def Cibilic 12.76
// QF3: Ewing 13.07 def Vaast 12.84
// QF4: Dora 15.67 def M.Pupo 13.33
// ============================================================
const qfResults = [
  { heat: 1, surfers: [
    { name: 'Leonardo Fioravanti', total: 13.23, status: 'active' },
    { name: 'Samuel Pupo',         total: 12.50, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Joao Chianca',   total: 13.27, status: 'active' },
    { name: 'Morgan Cibilic', total: 12.76, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: 'Ethan Ewing',  total: 13.07, status: 'active' },
    { name: 'Kauli Vaast',  total: 12.84, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Yago Dora',   total: 15.67, status: 'active' },
    { name: 'Miguel Pupo', total: 13.33, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// SEMIFINALS (round 5)
// SF1: Fioravanti 13.00 def J.Chianca 10.10
// SF2: Dora 14.30 def Ewing 11.67
// ============================================================
const sfResults = [
  { heat: 1, surfers: [
    { name: 'Leonardo Fioravanti', total: 13.00, status: 'active' },
    { name: 'Joao Chianca',        total: 10.10, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Yago Dora',   total: 14.30, status: 'active' },
    { name: 'Ethan Ewing', total: 11.67, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// FINAL (round 6)
// Dora 15.00 def Fioravanti 13.17
// YAGO DORA WINS RIO PRO! 🏆
// ============================================================
const finalResults = [
  { heat: 1, surfers: [
    { name: 'Yago Dora',           total: 15.00, status: 'active' },     // 🏆 WINNER
    { name: 'Leonardo Fioravanti', total: 13.17, status: 'ELIMINATED' }, // runner-up
  ]},
];

async function run() {
  console.log("=== Rio Pro — QF / SF / Final ===\n");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // --- Quarterfinals ---
  console.log("--- Quarterfinals (round 4) ---");
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
  const topSurfers = Object.entries(surferTotals).sort(([,a],[,b]) => b - a).slice(0, 8);
  console.log("\nTop 8 surfer totals (Rio):");
  topSurfers.forEach(([id, pts]) => console.log(`  ${surferIdToName.get(id)}: ${pts.toFixed(2)}`));

  console.log('\n🏆 YAGO DORA — RIO PRO CHAMPION!');
  console.log('   Final: Dora 15.00 def Fioravanti 13.17');
  console.log('\n=== Done ===');
}

run().catch(console.error);
