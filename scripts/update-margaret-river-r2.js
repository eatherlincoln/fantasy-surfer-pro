
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '0bf327c1-4e50-4f4b-97b6-13628a0c3387';

// ============================================================
// ROUND 2 RESULTS (all 16 heats)
// Winner listed first in each heat
// ============================================================
const round2Results = [
  { heat: 1, surfers: [
    { name: 'Samuel Pupo', total: 15.50, status: 'active' },
    { name: 'Cole Houshmand', total: 11.60, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Kanoa Igarashi', total: 15.23, status: 'active' },
    { name: 'Eli Hannerman', total: 11.67, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: "Liam O'Brien", total: 14.00, status: 'active' },
    { name: 'Jordy Smith', total: 9.47, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Joel Vaughan', total: 12.67, status: 'active' },
    { name: 'Barron Mamiya', total: 11.66, status: 'ELIMINATED' },
  ]},
  { heat: 5, surfers: [
    { name: 'Crosby Colapinto', total: 14.37, status: 'active' },
    { name: 'Marco Mignot', total: 12.03, status: 'ELIMINATED' },
  ]},
  { heat: 6, surfers: [
    { name: 'Griffin Colapinto', total: 14.10, status: 'active' },
    { name: 'Jack Thomas', total: 10.94, status: 'ELIMINATED' },
  ]},
  { heat: 7, surfers: [
    { name: 'Gabriel Medina', total: 13.16, status: 'active' },
    { name: 'Alan Cleland', total: 8.50, status: 'ELIMINATED' },
  ]},
  { heat: 8, surfers: [
    { name: 'Jack Robinson', total: 13.97, status: 'active' },
    { name: 'Kauli Vaast', total: 13.60, status: 'ELIMINATED' },
  ]},
  { heat: 9, surfers: [
    { name: 'Yago Dora', total: 13.67, status: 'active' },
    { name: 'Jacob Willcox', total: 12.93, status: 'ELIMINATED' },
  ]},
  { heat: 10, surfers: [
    { name: "Connor O'Leary", total: 13.34, status: 'active' },
    { name: 'Rio Waida', total: 10.80, status: 'ELIMINATED' },
  ]},
  { heat: 11, surfers: [
    { name: 'George Pittar', total: 14.90, status: 'active' },
    { name: 'Filipe Toledo', total: 14.03, status: 'ELIMINATED' },
  ]},
  { heat: 12, surfers: [
    { name: 'Leonardo Fioravanti', total: 12.00, status: 'active' },
    { name: 'Seth Moniz', total: 11.34, status: 'ELIMINATED' },
  ]},
  { heat: 13, surfers: [
    { name: 'Italo Ferreira', total: 13.47, status: 'active' },
    { name: 'Ramzi Boukhiam', total: 13.33, status: 'ELIMINATED' },
  ]},
  { heat: 14, surfers: [
    { name: 'Joao Chianca', total: 12.70, status: 'active' },
    { name: 'Jake Marshall', total: 12.00, status: 'ELIMINATED' },
  ]},
  { heat: 15, surfers: [
    { name: 'Ethan Ewing', total: 11.64, status: 'active' },
    { name: 'Alejo Muniz', total: 7.93, status: 'ELIMINATED' },
  ]},
  { heat: 16, surfers: [
    { name: 'Miguel Pupo', total: 12.83, status: 'active' },
    { name: 'Morgan Cibilic', total: 6.90, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// ROUND 3 DRAW (from bracket — winners feed into these)
// ============================================================
const round3Draw = [
  { heat: 1, surfers: ['Samuel Pupo', 'Kanoa Igarashi'] },
  { heat: 2, surfers: ["Liam O'Brien", 'Joel Vaughan'] },
  { heat: 3, surfers: ['Crosby Colapinto', 'Griffin Colapinto'] },
  { heat: 4, surfers: ['Gabriel Medina', 'Jack Robinson'] },
  { heat: 5, surfers: ['Yago Dora', "Connor O'Leary"] },
  { heat: 6, surfers: ['George Pittar', 'Leonardo Fioravanti'] },
  { heat: 7, surfers: ['Italo Ferreira', 'Joao Chianca'] },
  { heat: 8, surfers: ['Ethan Ewing', 'Miguel Pupo'] },
];

// ============================================================
// Name aliases for DB matching
// ============================================================
const aliases = {
  'ramzi boukhiam': ['ramzi boukhiam', 'ramzi boukhaim'],
  "liam o'brien": ["liam o'brien"],
  'jacob willcox': ['jacob willcox', 'jacob wilcox'],
  'mateus herdy': ['mateus herdy', 'matues herdy'],
  'cole houshmand': ['cole houshmand', 'cole houshman'],
  'eli hannerman': ['eli hannerman', 'eli hanneman'],
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

async function updateScores() {
  console.log("=== Updating Margaret River R2 Scores ===\n");

  // Load surfer name → id map
  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // -------------------------------------------------------
  // STEP 1: Enter R2 scores
  // -------------------------------------------------------
  for (const h of round2Results) {
    console.log(`--- R2 Heat ${h.heat} ---`);

    const { data: heat } = await supabase.from('heats')
      .select('id')
      .eq('event_id', EVENT_ID)
      .eq('round_number', 2)
      .eq('heat_number', h.heat)
      .single();

    if (!heat) {
      console.error(`  Heat not found: R2 H${h.heat}`);
      continue;
    }

    for (const s of h.surfers) {
      const surferId = findSurferId(s.name, surferMap);
      if (!surferId) {
        console.error(`  SURFER NOT FOUND: ${s.name}`);
        continue;
      }

      // Clean & insert scores (split total into 2 waves)
      await supabase.from('scores').delete().eq('heat_id', heat.id).eq('surfer_id', surferId);
      const w1 = parseFloat((s.total / 2).toFixed(2));
      const w2 = parseFloat((s.total - w1).toFixed(2));
      await supabase.from('scores').insert([
        { heat_id: heat.id, surfer_id: surferId, wave_score: w1 },
        { heat_id: heat.id, surfer_id: surferId, wave_score: w2 },
      ]);

      // Update heat assignment
      await supabase.from('heat_assignments')
        .update({ heat_score: s.total })
        .eq('heat_id', heat.id)
        .eq('surfer_id', surferId);

      // Update surfer status
      await supabase.from('surfers').update({ status: s.status }).eq('id', surferId);

      const marker = s.status === 'ELIMINATED' ? '❌' : '✓';
      console.log(`  ${marker} ${s.name}: ${s.total}`);
    }

    // Mark heat COMPLETED
    await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heat.id);
  }

  // -------------------------------------------------------
  // STEP 2: Create Round 3 heats
  // -------------------------------------------------------
  console.log("\n=== Creating Round 3 Heats ===");

  for (const h of round3Draw) {
    // Check if R3 heat already exists
    let { data: existing } = await supabase.from('heats')
      .select('id')
      .eq('event_id', EVENT_ID)
      .eq('round_number', 3)
      .eq('heat_number', h.heat)
      .single();

    let heatId;
    if (existing) {
      heatId = existing.id;
      // Clean existing assignments
      await supabase.from('heat_assignments').delete().eq('heat_id', heatId);
    } else {
      const { data: newHeat } = await supabase.from('heats')
        .insert({ event_id: EVENT_ID, round_number: 3, heat_number: h.heat, status: 'UPCOMING' })
        .select().single();
      heatId = newHeat.id;
    }

    for (const sName of h.surfers) {
      const sId = findSurferId(sName, surferMap);
      if (sId) {
        await supabase.from('heat_assignments').insert({ heat_id: heatId, surfer_id: sId });
      } else {
        console.error(`  SURFER NOT FOUND for R3: ${sName}`);
      }
    }
    console.log(`  R3 H${h.heat}: ${h.surfers.join(' vs ')}`);
  }

  // -------------------------------------------------------
  // STEP 3: Recalculate ALL team points
  // -------------------------------------------------------
  console.log("\n=== Recalculating Team Points ===");

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
    .select('id, user_id, surfer_id')
    .eq('event_id', EVENT_ID);

  if (teams && teams.length > 0) {
    console.log(`Updating ${teams.length} user team picks...`);
    for (const team of teams) {
      const points = surferTotals[team.surfer_id] || 0;
      await supabase.from('user_teams').update({ points }).eq('id', team.id);
    }

    // Update profile totals
    const userIds = [...new Set(teams.map(t => t.user_id))];
    for (const userId of userIds) {
      const { data: allUserTeams } = await supabase.from('user_teams').select('points').eq('user_id', userId);
      const totalPoints = allUserTeams ? allUserTeams.reduce((sum, t) => sum + (t.points || 0), 0) : 0;
      await supabase.from('profiles').update({ total_fantasy_points: totalPoints }).eq('id', userId);
    }

    // Update league standings
    const { data: leagueMembers } = await supabase.from('league_members').select('id, profile_id');
    if (leagueMembers) {
      for (const lm of leagueMembers) {
        const { data: profile } = await supabase.from('profiles')
          .select('total_fantasy_points').eq('id', lm.profile_id).single();
        if (profile) {
          await supabase.from('league_members')
            .update({ total_points: profile.total_fantasy_points }).eq('id', lm.id);
        }
      }
    }
  }

  // -------------------------------------------------------
  // VERIFICATION
  // -------------------------------------------------------
  console.log("\n=== Verification ===");

  const { data: eliminated } = await supabase.from('surfers')
    .select('name').eq('status', 'ELIMINATED').eq('is_on_tour', true);
  console.log(`Eliminated (${eliminated?.length}): ${eliminated?.map(s => s.name).join(', ')}`);

  const { data: active } = await supabase.from('surfers')
    .select('name').neq('status', 'ELIMINATED').eq('is_on_tour', true);
  console.log(`\nStill active (${active?.length}): ${active?.map(s => s.name).join(', ')}`);

  console.log("\nR3 Draw:");
  const { data: r3Heats } = await supabase.from('heats')
    .select('heat_number, heat_assignments(surfers(name))')
    .eq('event_id', EVENT_ID).eq('round_number', 3)
    .order('heat_number');
  r3Heats?.forEach(h => {
    const names = h.heat_assignments?.map(a => a.surfers?.name).join(' vs ');
    console.log(`  R3 H${h.heat_number}: ${names}`);
  });

  console.log("\n=== Done ===");
}

updateScores().catch(console.error);
