
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '368c4321-1a4e-441d-b3b9-3ab2e5e45e57'; // Bonsoy Gold Coast Pro

const aliases = {
  'ramzi boukhiam':      ['ramzi boukhiam', 'ramzi boukhaim'],
  "liam o'brien":        ["liam o'brien"],
  'cole houshmand':      ['cole houshmand', 'cole houshman'],
  'eli hannerman':       ['eli hannerman', 'eli hanneman'],
  "connor o'leary":      ["connor o'leary"],
  'italo ferreira':      ['italo ferreira', 'italo ferriera'],
  'winter vincet':       ['winter vincet', 'winter vincent'],
  'reef hazelwood':      ['reef hazelwood', 'reef hazlewood', 'reef heazlewood'],
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

async function insertScores(heatId, surferId, w1, w2) {
  await supabase.from('scores').delete().eq('heat_id', heatId).eq('surfer_id', surferId);
  await supabase.from('scores').insert([
    { heat_id: heatId, surfer_id: surferId, wave_score: w1 },
    { heat_id: heatId, surfer_id: surferId, wave_score: w2 },
  ]);
}

async function splitAndInsert(heatId, surferId, total) {
  const w1 = parseFloat((total / 2).toFixed(2));
  const w2 = parseFloat((total - w1).toFixed(2));
  await insertScores(heatId, surferId, w1, w2);
}

// ============================================================
// ROUND 1 RESULTS (actual wave scores from image)
// ============================================================
const round1Results = [
  { heat: 1, surfers: [
    { name: 'Callum Robson', w1: 5.83, w2: 5.50, total: 11.33, status: 'active', advanceTo: { round: 2, heat: 9 } },
    { name: 'Oscar Berry',   w1: 6.67, w2: 4.60, total: 11.27, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Mateus Herdy',   w1: 7.50, w2: 6.93, total: 14.43, status: 'active', advanceTo: { round: 2, heat: 6 } },
    { name: 'Reef Hazelwood', w1: 6.60, w2: 6.33, total: 12.93, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: 'Luke Thompson',  w1: 6.27, w2: 5.77, total: 12.04, status: 'active', advanceTo: { round: 2, heat: 3 } },
    { name: 'Winter Vincet',  w1: 5.83, w2: 4.93, total: 10.76, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Morgan Cibilic', w1: 6.77, w2: 6.33, total: 13.10, status: 'active', advanceTo: { round: 2, heat: 13 } },
    { name: 'Ramzi Boukhiam', w1: 7.33, w2: 5.60, total: 12.93, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// ROUND 2 RESULTS
// ============================================================
const round2Results = [
  { heat:  1, surfers: [
    { name: 'Marco Mignot',  total: 13.40, status: 'active' },
    { name: 'Barron Mamiya', total: 13.17, status: 'ELIMINATED' },
  ]},
  { heat:  2, surfers: [
    { name: 'Kauli Vaast', total: 15.16, status: 'active' },
    { name: 'Jordy Smith', total: 13.40, status: 'ELIMINATED' },
  ]},
  { heat:  3, surfers: [
    { name: 'Italo Ferreira', total: 12.50, status: 'active' },
    { name: 'Luke Thompson',  total: 10.66, status: 'ELIMINATED' },
  ]},
  { heat:  4, surfers: [
    { name: 'Ethan Ewing', total: 15.50, status: 'active' },
    { name: 'Rio Waida',   total: 13.44, status: 'ELIMINATED' },
  ]},
  { heat:  5, surfers: [
    { name: 'Jake Marshall',   total: 15.83, status: 'active' },
    { name: 'Crosby Colapinto', total: 12.17, status: 'ELIMINATED' },
  ]},
  { heat:  6, surfers: [
    { name: 'Mateus Herdy',     total: 15.33, status: 'active' },
    { name: 'Griffin Colapinto', total: 14.00, status: 'ELIMINATED' },
  ]},
  { heat:  7, surfers: [
    { name: 'George Pittar', total: 14.47, status: 'active' },
    { name: 'Alejo Muniz',   total:  9.00, status: 'ELIMINATED' },
  ]},
  { heat:  8, surfers: [
    { name: "Liam O'Brien",  total: 14.67, status: 'active' },
    { name: 'Kanoa Igarashi', total: 13.53, status: 'ELIMINATED' },
  ]},
  { heat:  9, surfers: [
    { name: 'Callum Robson', total: 14.60, status: 'active' },
    { name: 'Yago Dora',     total: 11.50, status: 'ELIMINATED' },
  ]},
  { heat: 10, surfers: [
    { name: "Connor O'Leary", total: 15.83, status: 'active' },
    { name: 'Joel Vaughan',   total: 10.10, status: 'ELIMINATED' },
  ]},
  { heat: 11, surfers: [
    { name: 'Jack Robinson', total: 15.07, status: 'active' },
    { name: 'Alan Cleland',  total:  7.33, status: 'ELIMINATED' },
  ]},
  { heat: 12, surfers: [
    { name: 'Leonardo Fioravanti', total: 14.33, status: 'active' },
    { name: 'Seth Moniz',          total: 10.67, status: 'ELIMINATED' },
  ]},
  { heat: 13, surfers: [
    { name: 'Gabriel Medina', total: 15.56, status: 'active' },
    { name: 'Morgan Cibilic', total: 10.17, status: 'ELIMINATED' },
  ]},
  { heat: 14, surfers: [
    { name: 'Filipe Toledo',  total: 18.00, status: 'active' },
    { name: 'Cole Houshmand', total: 14.87, status: 'ELIMINATED' },
  ]},
  { heat: 15, surfers: [
    { name: 'Samuel Pupo', total: 12.54, status: 'active' },
    { name: 'Joao Chianca', total:  9.00, status: 'ELIMINATED' },
  ]},
  { heat: 16, surfers: [
    { name: 'Miguel Pupo',   total: 11.60, status: 'active' },
    { name: 'Eli Hannerman', total:  6.77, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// ROUND 3 RESULTS
// H8 is LIVE — entering current scores, marked LIVE not COMPLETED
// ============================================================
const round3Results = [
  { heat: 1, status: 'COMPLETED', surfers: [
    { name: 'Kauli Vaast',  total: 14.33, status: 'active' },
    { name: 'Marco Mignot', total: 13.97, status: 'ELIMINATED' },
  ]},
  { heat: 2, status: 'COMPLETED', surfers: [
    { name: 'Ethan Ewing',    total: 17.50, status: 'active' },
    { name: 'Italo Ferreira', total: 13.93, status: 'ELIMINATED' },
  ]},
  { heat: 3, status: 'COMPLETED', surfers: [
    { name: 'Mateus Herdy', total: 14.33, status: 'active' },
    { name: 'Jake Marshall', total: 10.87, status: 'ELIMINATED' },
  ]},
  { heat: 4, status: 'COMPLETED', surfers: [
    { name: "Liam O'Brien", total: 17.50, status: 'active' },
    { name: 'George Pittar', total: 10.93, status: 'ELIMINATED' },
  ]},
  { heat: 5, status: 'COMPLETED', surfers: [
    { name: "Connor O'Leary", total: 14.60, status: 'active' },
    { name: 'Callum Robson',   total:  9.60, status: 'ELIMINATED' },
  ]},
  { heat: 6, status: 'COMPLETED', surfers: [
    { name: 'Leonardo Fioravanti', total: 12.43, status: 'active' },
    { name: 'Jack Robinson',       total: 11.83, status: 'ELIMINATED' },
  ]},
  { heat: 7, status: 'COMPLETED', surfers: [
    { name: 'Filipe Toledo',  total: 18.94, status: 'active' },
    { name: 'Gabriel Medina', total: 15.56, status: 'ELIMINATED' },
  ]},
  { heat: 8, status: 'LIVE', surfers: [
    // LIVE — S. Pupo leading 17.77 vs 15.43
    { name: 'Samuel Pupo', total: 17.77, status: 'active' },
    { name: 'Miguel Pupo', total: 15.43, status: 'active' },
  ]},
];

// ============================================================
// QUARTERFINAL DRAW (QF4 opponent pending R3H8 result)
// ============================================================
const qfDraw = [
  { heat: 1, surfers: ['Kauli Vaast',       'Ethan Ewing'] },
  { heat: 2, surfers: ['Mateus Herdy',       "Liam O'Brien"] },
  { heat: 3, surfers: ["Connor O'Leary",     'Leonardo Fioravanti'] },
  { heat: 4, surfers: ['Filipe Toledo',      'Samuel Pupo'] }, // S. Pupo leading R3H8
];

async function update() {
  console.log("=== Gold Coast Pro — R1 + R2 + R3 Update ===\n");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // --------------------------------------------------------
  // STEP 1: Round 1
  // --------------------------------------------------------
  console.log("--- Round 1 ---");
  for (const h of round1Results) {
    const { data: heat } = await supabase.from('heats').select('id')
      .eq('event_id', EVENT_ID).eq('round_number', 1).eq('heat_number', h.heat).single();
    if (!heat) { console.error(`R1H${h.heat} not found`); continue; }

    for (const s of h.surfers) {
      const id = findSurferId(s.name, surferMap);
      if (!id) { console.error(`  NOT FOUND: ${s.name}`); continue; }

      await insertScores(heat.id, id, s.w1, s.w2);
      await supabase.from('heat_assignments').update({ heat_score: s.total }).eq('heat_id', heat.id).eq('surfer_id', id);
      await supabase.from('surfers').update({ status: s.status }).eq('id', id);

      const marker = s.status === 'ELIMINATED' ? '❌' : '✓';
      console.log(`  ${marker} ${s.name}: ${s.total} (${s.w1}+${s.w2})`);

      // Add R1 winner to their R2 heat
      if (s.advanceTo) {
        const { data: r2Heat } = await supabase.from('heats').select('id')
          .eq('event_id', EVENT_ID).eq('round_number', s.advanceTo.round).eq('heat_number', s.advanceTo.heat).single();
        if (r2Heat) {
          const { data: existing } = await supabase.from('heat_assignments').select('id')
            .eq('heat_id', r2Heat.id).eq('surfer_id', id);
          if (!existing || existing.length === 0) {
            await supabase.from('heat_assignments').insert({ heat_id: r2Heat.id, surfer_id: id });
            console.log(`    → Added to R2H${s.advanceTo.heat}`);
          }
        }
      }
    }
    await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heat.id);
  }

  // --------------------------------------------------------
  // STEP 2: Round 2
  // --------------------------------------------------------
  console.log("\n--- Round 2 ---");
  for (const h of round2Results) {
    const { data: heat } = await supabase.from('heats').select('id')
      .eq('event_id', EVENT_ID).eq('round_number', 2).eq('heat_number', h.heat).single();
    if (!heat) { console.error(`R2H${h.heat} not found`); continue; }

    for (const s of h.surfers) {
      const id = findSurferId(s.name, surferMap);
      if (!id) { console.error(`  NOT FOUND: ${s.name}`); continue; }

      await splitAndInsert(heat.id, id, s.total);
      await supabase.from('heat_assignments').update({ heat_score: s.total }).eq('heat_id', heat.id).eq('surfer_id', id);
      await supabase.from('surfers').update({ status: s.status }).eq('id', id);

      const marker = s.status === 'ELIMINATED' ? '❌' : '✓';
      console.log(`  ${marker} ${s.name}: ${s.total}`);
    }
    await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heat.id);
  }

  // --------------------------------------------------------
  // STEP 3: Round 3
  // --------------------------------------------------------
  console.log("\n--- Round 3 ---");
  for (const h of round3Results) {
    // Create R3 heat if it doesn't exist
    let { data: heat } = await supabase.from('heats').select('id')
      .eq('event_id', EVENT_ID).eq('round_number', 3).eq('heat_number', h.heat).single();

    if (!heat) {
      const { data: newHeat } = await supabase.from('heats')
        .insert({ event_id: EVENT_ID, round_number: 3, heat_number: h.heat, status: 'UPCOMING' })
        .select().single();
      heat = newHeat;
    }

    for (const s of h.surfers) {
      const id = findSurferId(s.name, surferMap);
      if (!id) { console.error(`  NOT FOUND: ${s.name}`); continue; }

      // Assign to heat if not already there
      const { data: existing } = await supabase.from('heat_assignments').select('id')
        .eq('heat_id', heat.id).eq('surfer_id', id);
      if (!existing || existing.length === 0) {
        await supabase.from('heat_assignments').insert({ heat_id: heat.id, surfer_id: id });
      }

      await splitAndInsert(heat.id, id, s.total);
      await supabase.from('heat_assignments').update({ heat_score: s.total }).eq('heat_id', heat.id).eq('surfer_id', id);
      await supabase.from('surfers').update({ status: s.status }).eq('id', id);

      const marker = s.status === 'ELIMINATED' ? '❌' : (h.status === 'LIVE' ? '🟡' : '✓');
      console.log(`  ${marker} ${s.name}: ${s.total}${h.status === 'LIVE' ? ' (LIVE)' : ''}`);
    }

    await supabase.from('heats').update({ status: h.status }).eq('id', heat.id);
  }

  // --------------------------------------------------------
  // STEP 4: Create Quarterfinal heats (round 4)
  // --------------------------------------------------------
  console.log("\n--- Creating Quarterfinal Heats ---");
  for (const h of qfDraw) {
    let { data: existing } = await supabase.from('heats').select('id')
      .eq('event_id', EVENT_ID).eq('round_number', 4).eq('heat_number', h.heat).single();

    let heatId;
    if (existing) {
      heatId = existing.id;
      await supabase.from('heat_assignments').delete().eq('heat_id', heatId);
    } else {
      const { data: newHeat } = await supabase.from('heats')
        .insert({ event_id: EVENT_ID, round_number: 4, heat_number: h.heat, status: 'UPCOMING' })
        .select().single();
      heatId = newHeat.id;
    }

    for (const sName of h.surfers) {
      const sId = findSurferId(sName, surferMap);
      if (sId) await supabase.from('heat_assignments').insert({ heat_id: heatId, surfer_id: sId });
      else console.error(`  NOT FOUND: ${sName}`);
    }
    console.log(`  QF H${h.heat}: ${h.surfers.join(' vs ')}`);
  }

  // --------------------------------------------------------
  // STEP 5: Recalculate all team points
  // --------------------------------------------------------
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

  const { data: teams } = await supabase.from('user_teams').select('id, user_id, surfer_id').eq('event_id', EVENT_ID);

  if (teams && teams.length > 0) {
    console.log(`Updating ${teams.length} user team picks...`);
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
  }

  // --------------------------------------------------------
  // VERIFICATION
  // --------------------------------------------------------
  console.log("\n=== Verification ===");
  const { data: active } = await supabase.from('surfers').select('name').neq('status', 'ELIMINATED').eq('is_on_tour', true);
  console.log(`Active (${active?.length}): ${active?.map(s => s.name).join(', ')}`);

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

update().catch(console.error);
