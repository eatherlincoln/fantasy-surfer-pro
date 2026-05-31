
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '1e3e0c48-47c4-4a33-937b-1d6982357615'; // Corona Cero New Zealand Pro

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
// QF1: G.Colapinto 17.10 def Toledo 15.83
// QF2: Cibilic 13.60 def Waida 13.50
// QF3: Dora 17.50 def Houshmand 17.00
// QF4: Ferreira 16.63 def M.Pupo 12.17
// ============================================================
const qfResults = [
  { heat: 1, surfers: [
    { name: 'Griffin Colapinto', total: 17.10, status: 'active' },
    { name: 'Filipe Toledo',     total: 15.83, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Morgan Cibilic', total: 13.60, status: 'active' },
    { name: 'Rio Waida',      total: 13.50, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: 'Yago Dora',      total: 17.50, status: 'active' },
    { name: 'Cole Houshmand', total: 17.00, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Italo Ferreira', total: 16.63, status: 'active' },
    { name: 'Miguel Pupo',    total: 12.17, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// SEMIFINALS (round 5)
// SF1: Cibilic 15.34 def G.Colapinto 12.20
// SF2: Ferreira 15.10 def Dora 12.33
// ============================================================
const sfResults = [
  { heat: 1, surfers: [
    { name: 'Morgan Cibilic',    total: 15.34, status: 'active' },
    { name: 'Griffin Colapinto', total: 12.20, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Italo Ferreira', total: 15.10, status: 'active' },
    { name: 'Yago Dora',      total: 12.33, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// FINAL (round 6)
// Ferreira 17.50 def Cibilic 15.80
// ITALO FERREIRA WINS NZ PRO!
// ============================================================
const finalResults = [
  { heat: 1, surfers: [
    { name: 'Italo Ferreira', total: 17.50, status: 'active' },    // 🏆 WINNER
    { name: 'Morgan Cibilic', total: 15.80, status: 'ELIMINATED' }, // runner-up
  ]},
];

async function run() {
  console.log("=== NZ Pro — QF / SF / Final ===\n");

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
  for (const h of finalResults) {
    console.log(`  FINAL:`);
    const heatId = await getOrCreateHeat(6, h.heat);
    await assignSurfers(heatId, h.surfers.map(s => s.name), surferMap);
    await enterScores(heatId, h.surfers, surferMap);
  }

  // --- Mark event COMPLETED ---
  await supabase.from('events').update({ status: 'COMPLETED' }).eq('id', EVENT_ID);
  console.log("\n✓ Event marked COMPLETED");

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
    console.log("  ✓ Points updated");
  }

  // --- Verification ---
  console.log("\n=== Verification ===");
  const { data: active } = await supabase.from('surfers')
    .select('name').neq('status', 'ELIMINATED').eq('is_on_tour', true);
  console.log(`Still active: ${active?.map(s => s.name).join(', ')}`);

  // Top surfer totals for this event
  const topSurfers = Object.entries(surferTotals)
    .sort(([,a],[,b]) => b - a).slice(0, 5);
  const surferIdToName = new Map(surfers.map(s => [s.id, s.name]));
  console.log("\nTop 5 surfer totals:");
  topSurfers.forEach(([id, pts]) => console.log(`  ${surferIdToName.get(id)}: ${pts.toFixed(2)}`));

  console.log("\n🏆 ITALO FERREIRA — NZ PRO CHAMPION");
  console.log("\n=== Done ===");
}

run().catch(console.error);
