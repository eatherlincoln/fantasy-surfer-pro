
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

    const w1 = s.w1 ?? parseFloat((s.total / 2).toFixed(2));
    const w2 = s.w2 ?? parseFloat((s.total - w1).toFixed(2));
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

async function getHeat(round, heat) {
  const { data } = await supabase.from('heats').select('id')
    .eq('event_id', EVENT_ID).eq('round_number', round).eq('heat_number', heat).single();
  return data?.id || null;
}

async function getOrCreateHeat(round, heat) {
  const id = await getHeat(round, heat);
  if (id) return id;
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
// ROUND 1 (actual wave scores known)
// ============================================================
const r1 = [
  { heat: 1, surfers: [
    { name: 'Luke Thompson',  w1: 6.50, w2: 6.00, total: 12.50, status: 'active' },
    { name: 'Tom Butland',    w1: 5.33, w2: 4.77, total: 10.10, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Morgan Cibilic',  w1: 7.50, w2: 7.00, total: 14.50, status: 'active' },
    { name: 'Billy Stairmand', w1: 6.50, w2: 6.47, total: 12.97, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: 'Eli Hannerman', w1: 7.23, w2: 6.27, total: 13.50, status: 'active' },
    { name: 'Oscar Berry',   w1: 6.83, w2: 6.50, total: 13.33, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Seth Moniz',      w1: 6.50, w2: 5.60, total: 12.10, status: 'active' },
    { name: 'Ramzi Boukhiam',  w1: 5.73, w2: 5.67, total: 11.40, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// ROUND 2 (totals — split 50/50)
// ============================================================
const r2 = [
  { heat:  1, surfers: [
    { name: 'Crosby Colapinto', total: 10.70, status: 'active' },
    { name: 'Jordy Smith',      total:  9.40, status: 'ELIMINATED' },
  ]},
  { heat:  2, surfers: [
    { name: 'Griffin Colapinto', total: 14.17, status: 'active' },
    { name: 'Alan Cleland',      total: 10.50, status: 'ELIMINATED' },
  ]},
  { heat:  3, surfers: [
    { name: 'Gabriel Medina', total: 15.20, status: 'active' },
    { name: 'Eli Hannerman',  total: 10.06, status: 'ELIMINATED' },
  ]},
  { heat:  4, surfers: [
    { name: 'Filipe Toledo', total: 15.66, status: 'active' },
    { name: 'Joao Chianca',  total: 10.84, status: 'ELIMINATED' },
  ]},
  { heat:  5, surfers: [
    { name: "Liam O'Brien",  total: 11.97, status: 'active' },
    { name: 'Jake Marshall', total: 11.46, status: 'ELIMINATED' },
  ]},
  { heat:  6, surfers: [
    { name: 'Morgan Cibilic', total: 14.33, status: 'active' },
    { name: 'Ethan Ewing',    total: 10.00, status: 'ELIMINATED' },
  ]},
  { heat:  7, surfers: [
    { name: 'Rio Waida',       total: 15.20, status: 'active' },
    { name: "Connor O'Leary",  total: 13.44, status: 'ELIMINATED' },
  ]},
  { heat:  8, surfers: [
    { name: 'Alejo Muniz',  total: 15.50, status: 'active' },
    { name: 'George Pittar', total: 14.84, status: 'ELIMINATED' },
  ]},
  { heat:  9, surfers: [
    { name: 'Yago Dora',      total: 17.76, status: 'active' },
    { name: 'Luke Thompson',  total: 10.34, status: 'ELIMINATED' },
  ]},
  { heat: 10, surfers: [
    { name: 'Marco Mignot',  total: 13.16, status: 'active' },
    { name: 'Barron Mamiya', total:  9.50, status: 'ELIMINATED' },
  ]},
  { heat: 11, surfers: [
    { name: 'Cole Houshmand', total: 11.67, status: 'active' },
    { name: 'Samuel Pupo',    total: 10.33, status: 'ELIMINATED' },
  ]},
  { heat: 12, surfers: [
    { name: 'Leonardo Fioravanti', total: 12.83, status: 'active' },
    { name: 'Mateus Herdy',        total: 11.74, status: 'ELIMINATED' },
  ]},
  { heat: 13, surfers: [
    { name: 'Italo Ferreira', total: 13.33, status: 'active' },
    { name: 'Seth Moniz',     total:  9.73, status: 'ELIMINATED' },
  ]},
  { heat: 14, surfers: [
    { name: 'Kanoa Igarashi', total: 13.17, status: 'active' },
    { name: 'Joel Vaughan',   total: 12.94, status: 'ELIMINATED' },
  ]},
  { heat: 15, surfers: [
    { name: 'Jack Robinson', total: 16.10, status: 'active' },
    { name: 'Kauli Vaast',   total: 15.83, status: 'ELIMINATED' },
  ]},
  { heat: 16, surfers: [
    { name: 'Miguel Pupo',    total: 12.83, status: 'active' },
    { name: 'Callum Robson',  total:  9.90, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// ROUND 3 (totals)
// ============================================================
const r3 = [
  { heat: 1, surfers: [
    { name: 'Griffin Colapinto', total: 11.33, status: 'active' },
    { name: 'Crosby Colapinto',  total:  9.53, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Filipe Toledo',  total: 15.43, status: 'active' },
    { name: 'Gabriel Medina', total: 13.90, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: 'Morgan Cibilic', total: 13.50, status: 'active' },
    { name: "Liam O'Brien",   total:  9.94, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Rio Waida',    total: 12.84, status: 'active' },
    { name: 'Alejo Muniz',  total: 10.77, status: 'ELIMINATED' },
  ]},
  { heat: 5, surfers: [
    { name: 'Yago Dora',     total: 16.33, status: 'active' },
    { name: 'Marco Mignot',  total: 11.50, status: 'ELIMINATED' },
  ]},
  { heat: 6, surfers: [
    { name: 'Cole Houshmand',      total: 15.34, status: 'active' },
    { name: 'Leonardo Fioravanti', total: 12.77, status: 'ELIMINATED' },
  ]},
  { heat: 7, surfers: [
    { name: 'Italo Ferreira',  total: 15.90, status: 'active' },
    { name: 'Kanoa Igarashi',  total: 13.30, status: 'ELIMINATED' },
  ]},
  { heat: 8, surfers: [
    { name: 'Miguel Pupo',   total: 14.96, status: 'active' },
    { name: 'Jack Robinson', total: 12.50, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// QF DRAW (round 4) — not yet surfed, just create the heats
// QF1: Griffin Colapinto vs Filipe Toledo
// QF2: Morgan Cibilic vs Rio Waida
// QF3: Yago Dora vs Cole Houshmand
// QF4: Italo Ferreira vs Miguel Pupo
// ============================================================
const qfDraw = [
  { heat: 1, surfers: ['Griffin Colapinto', 'Filipe Toledo'] },
  { heat: 2, surfers: ['Morgan Cibilic', 'Rio Waida'] },
  { heat: 3, surfers: ['Yago Dora', 'Cole Houshmand'] },
  { heat: 4, surfers: ['Italo Ferreira', 'Miguel Pupo'] },
];

async function run() {
  console.log("=== NZ Pro — R1 / R2 / R3 Update ===\n");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // --- R1 ---
  console.log("--- Round 1 ---");
  for (const h of r1) {
    console.log(`  R1H${h.heat}:`);
    const heatId = await getHeat(1, h.heat);
    if (!heatId) { console.error(`  Heat not found R1H${h.heat}`); continue; }
    await enterScores(heatId, h.surfers, surferMap);
  }

  // --- R2 ---
  console.log("\n--- Round 2 ---");
  for (const h of r2) {
    console.log(`  R2H${h.heat}:`);
    const heatId = await getHeat(2, h.heat);
    if (!heatId) { console.error(`  Heat not found R2H${h.heat}`); continue; }

    // Add R1 winner to heat if not already assigned
    const r1WinnerMap = { 9: 'Luke Thompson', 6: 'Morgan Cibilic', 3: 'Eli Hannerman', 13: 'Seth Moniz' };
    if (r1WinnerMap[h.heat]) {
      const winnerId = findSurferId(r1WinnerMap[h.heat], surferMap);
      if (winnerId) {
        const { data: existing } = await supabase.from('heat_assignments')
          .select('id').eq('heat_id', heatId).eq('surfer_id', winnerId).single();
        if (!existing) {
          await supabase.from('heat_assignments').insert({ heat_id: heatId, surfer_id: winnerId });
        }
      }
    }

    await enterScores(heatId, h.surfers, surferMap);
  }

  // --- R3 (create heats + enter scores) ---
  console.log("\n--- Round 3 ---");
  for (const h of r3) {
    console.log(`  R3H${h.heat}:`);
    const heatId = await getOrCreateHeat(3, h.heat);
    await assignSurfers(heatId, h.surfers.map(s => s.name), surferMap);
    await enterScores(heatId, h.surfers, surferMap);
  }

  // --- QF Draw ---
  console.log("\n--- Creating QF Draw (round 4) ---");
  for (const h of qfDraw) {
    const heatId = await getOrCreateHeat(4, h.heat);
    await assignSurfers(heatId, h.surfers, surferMap);
    // Ensure status is UPCOMING (not COMPLETED)
    await supabase.from('heats').update({ status: 'UPCOMING' }).eq('id', heatId);
    console.log(`  QF H${h.heat}: ${h.surfers.join(' vs ')}`);
  }

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
  console.log(`\nQF surfers (${active?.length}): ${active?.map(s => s.name).join(', ')}`);

  console.log("\nQF Draw:");
  const { data: qfHeats } = await supabase.from('heats')
    .select('heat_number, heat_assignments(surfers(name))')
    .eq('event_id', EVENT_ID).eq('round_number', 4).order('heat_number');
  qfHeats?.forEach(h => {
    const names = h.heat_assignments?.map(a => a.surfers?.name).join(' vs ');
    console.log(`  QF H${h.heat_number}: ${names}`);
  });

  console.log("\n=== Done ===");
}

run().catch(console.error);
