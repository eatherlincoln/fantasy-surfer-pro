
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '368c4321-1a4e-441d-b3b9-3ab2e5e45e57';

const aliases = {
  'ramzi boukhiam':  ['ramzi boukhiam', 'ramzi boukhaim'],
  "liam o'brien":    ["liam o'brien"],
  'cole houshmand':  ['cole houshmand', 'cole houshman'],
  'eli hannerman':   ['eli hannerman', 'eli hanneman'],
  "connor o'leary":  ["connor o'leary"],
  'italo ferreira':  ['italo ferreira', 'italo ferriera'],
  'winter vincet':   ['winter vincet', 'winter vincent'],
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

async function enterHeatScores(heatId, surfers, surferMap) {
  for (const s of surfers) {
    const surferId = findSurferId(s.name, surferMap);
    if (!surferId) { console.error(`  ⚠️  NOT FOUND: ${s.name}`); continue; }

    await supabase.from('scores').delete().eq('heat_id', heatId).eq('surfer_id', surferId);

    if (s.w1 && s.w2) {
      await supabase.from('scores').insert([
        { heat_id: heatId, surfer_id: surferId, wave_score: s.w1 },
        { heat_id: heatId, surfer_id: surferId, wave_score: s.w2 },
      ]);
    } else {
      const w1 = parseFloat((s.total / 2).toFixed(2));
      const w2 = parseFloat((s.total - w1).toFixed(2));
      await supabase.from('scores').insert([
        { heat_id: heatId, surfer_id: surferId, wave_score: w1 },
        { heat_id: heatId, surfer_id: surferId, wave_score: w2 },
      ]);
    }

    await supabase.from('heat_assignments')
      .update({ heat_score: s.total })
      .eq('heat_id', heatId).eq('surfer_id', surferId);

    await supabase.from('surfers').update({ status: s.status }).eq('id', surferId);

    const marker = s.status === 'ELIMINATED' ? '❌' : '✓';
    console.log(`    ${marker} ${s.name}: ${s.total}`);
  }
  await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heatId);
}

async function getOrCreateHeat(roundNumber, heatNumber) {
  const { data: existing } = await supabase.from('heats')
    .select('id').eq('event_id', EVENT_ID).eq('round_number', roundNumber).eq('heat_number', heatNumber).single();
  if (existing) return existing.id;
  const { data: newHeat } = await supabase.from('heats')
    .insert({ event_id: EVENT_ID, round_number: roundNumber, heat_number: heatNumber, status: 'UPCOMING' })
    .select().single();
  return newHeat.id;
}

async function assignSurfersToHeat(heatId, names, surferMap) {
  await supabase.from('heat_assignments').delete().eq('heat_id', heatId);
  for (const name of names) {
    const sId = findSurferId(name, surferMap);
    if (sId) await supabase.from('heat_assignments').insert({ heat_id: heatId, surfer_id: sId });
    else console.error(`  ⚠️  NOT FOUND for draw: ${name}`);
  }
}

// ============================================================
// R3 HEAT 8 FIX — final score was 18.90 (was live at 17.77)
// ============================================================
const r3h8Fix = {
  heat: 8, round: 3, surfers: [
    { name: 'Samuel Pupo', total: 18.90, status: 'active' },
    { name: 'Miguel Pupo', total: 15.43, status: 'ELIMINATED' },
  ]
};

// ============================================================
// QUARTERFINALS (round 4)
// QF1: Ewing 14.50 def Vaast 6.50
// QF2: O'Brien 15.00 def Herdy 8.67
// QF3: O'Leary 16.44 def Fioravanti 16.03
// QF4: Toledo 15.77 def S.Pupo 12.57
// ============================================================
const qfResults = [
  { heat: 1, surfers: [
    { name: 'Ethan Ewing',         total: 14.50, status: 'active' },
    { name: 'Kauli Vaast',         total:  6.50, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: "Liam O'Brien",        total: 15.00, status: 'active' },
    { name: 'Mateus Herdy',        total:  8.67, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: "Connor O'Leary",      total: 16.44, status: 'active' },
    { name: 'Leonardo Fioravanti', total: 16.03, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Filipe Toledo',       total: 15.77, status: 'active' },
    { name: 'Samuel Pupo',         total: 12.57, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// SEMIFINALS (round 5)
// SF1: Ewing 16.33 def O'Brien 15.30
// SF2: O'Leary 16.97 def Toledo 14.77
// ============================================================
const sfResults = [
  { heat: 1, surfers: [
    { name: 'Ethan Ewing',    total: 16.33, status: 'active' },
    { name: "Liam O'Brien",   total: 15.30, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: "Connor O'Leary", total: 16.97, status: 'active' },
    { name: 'Filipe Toledo',  total: 14.77, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// FINAL (round 6)
// Ewing 14.56 def O'Leary 14.17
// ============================================================
const finalResults = [
  { heat: 1, surfers: [
    { name: 'Ethan Ewing',    total: 14.56, status: 'active' },   // WINNER
    { name: "Connor O'Leary", total: 14.17, status: 'ELIMINATED' },
  ]},
];

async function run() {
  console.log("=== Gold Coast Pro — QF / SF / Final Update ===\n");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // --- Fix R3H8 ---
  console.log("--- Fixing R3H8 (final score: S.Pupo 18.90) ---");
  const r3h8Id = await getOrCreateHeat(r3h8Fix.round, r3h8Fix.heat);
  await enterHeatScores(r3h8Id, r3h8Fix.surfers, surferMap);

  // --- Quarterfinals ---
  console.log("\n--- Quarterfinals (round 4) ---");
  for (const h of qfResults) {
    console.log(`  QF H${h.heat}:`);
    const heatId = await getOrCreateHeat(4, h.heat);
    await assignSurfersToHeat(heatId, h.surfers.map(s => s.name), surferMap);
    await enterHeatScores(heatId, h.surfers, surferMap);
  }

  // --- Semifinals ---
  console.log("\n--- Semifinals (round 5) ---");
  for (const h of sfResults) {
    console.log(`  SF H${h.heat}:`);
    const heatId = await getOrCreateHeat(5, h.heat);
    await assignSurfersToHeat(heatId, h.surfers.map(s => s.name), surferMap);
    await enterHeatScores(heatId, h.surfers, surferMap);
  }

  // --- Final ---
  console.log("\n--- Final (round 6) ---");
  for (const h of finalResults) {
    console.log(`  FINAL:`);
    const heatId = await getOrCreateHeat(6, h.heat);
    await assignSurfersToHeat(heatId, h.surfers.map(s => s.name), surferMap);
    await enterHeatScores(heatId, h.surfers, surferMap);
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
  const { data: active } = await supabase.from('surfers').select('name').neq('status', 'ELIMINATED').eq('is_on_tour', true);
  console.log(`Still active: ${active?.map(s => s.name).join(', ')}`);

  // Top 3 users by points for this event
  const { data: topTeams } = await supabase.from('user_teams')
    .select('user_id, points, surfers(name)')
    .eq('event_id', EVENT_ID)
    .order('points', { ascending: false })
    .limit(5);
  console.log("\nTop team picks by points:");
  topTeams?.forEach(t => console.log(`  ${t.surfers?.name}: ${t.points?.toFixed(2)}`));

  console.log("\n=== Done ===");
}

run().catch(console.error);
