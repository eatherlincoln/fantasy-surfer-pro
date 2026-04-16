
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '0bf327c1-4e50-4f4b-97b6-13628a0c3387';

// ============================================================
// ROUND 1 RESULTS
// ============================================================
const round1Results = [
  { heat: 1, surfers: [
    { name: 'Oscar Berry', w1: 6.67, w2: 5.73, total: 12.40, status: 'ELIMINATED' },
    { name: 'Jacob Willcox', w1: 7.83, w2: 7.10, total: 14.93, status: 'active', advancesTo: { round: 2, heat: 9 } },
  ]},
  { heat: 2, surfers: [
    { name: 'Mateus Herdy', w1: 7.33, w2: 5.63, total: 12.96, status: 'ELIMINATED' },
    { name: 'Jack Thomas', w1: 8.33, w2: 7.00, total: 15.33, status: 'active', advancesTo: { round: 2, heat: 6 } },
  ]},
  { heat: 3, surfers: [
    { name: 'Callum Robson', w1: 5.60, w2: 4.50, total: 10.10, status: 'ELIMINATED' },
    { name: "Liam O'Brien", w1: 7.33, w2: 6.50, total: 13.83, status: 'active', advancesTo: { round: 2, heat: 3 } },
  ]},
  { heat: 4, surfers: [
    { name: 'Luke Thompson', w1: 6.17, w2: 5.00, total: 11.17, status: 'ELIMINATED' },
    { name: 'Ramzi Boukhiam', w1: 7.00, w2: 6.83, total: 13.83, status: 'active', advancesTo: { round: 2, heat: 13 } },
  ]},
];

async function updateScores() {
  console.log("=== Updating Margaret River R1 Scores ===\n");

  // Load surfer name → id map
  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // Also handle known aliases
  const aliases = {
    'ramzi boukhiam': ['ramzi boukhiam', 'ramzi boukhaim'],
    'liam o\'brien': ['liam o\'brien'],
    'jacob willcox': ['jacob willcox', 'jacob wilcox'],
    'mateus herdy': ['mateus herdy', 'matues herdy'],
  };

  function findSurferId(name) {
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

  for (const h of round1Results) {
    console.log(`--- R1 Heat ${h.heat} ---`);

    // Get the heat from DB
    const { data: heat } = await supabase.from('heats')
      .select('id')
      .eq('event_id', EVENT_ID)
      .eq('round_number', 1)
      .eq('heat_number', h.heat)
      .single();

    if (!heat) {
      console.error(`  Heat not found: R1 H${h.heat}`);
      continue;
    }

    for (const s of h.surfers) {
      const surferId = findSurferId(s.name);
      if (!surferId) {
        console.error(`  Surfer not found: ${s.name}`);
        continue;
      }

      // Clean existing scores for this heat+surfer
      await supabase.from('scores').delete().eq('heat_id', heat.id).eq('surfer_id', surferId);

      // Insert wave scores
      await supabase.from('scores').insert([
        { heat_id: heat.id, surfer_id: surferId, wave_score: s.w1 },
        { heat_id: heat.id, surfer_id: surferId, wave_score: s.w2 },
      ]);

      // Update heat assignment with total
      await supabase.from('heat_assignments')
        .update({ heat_score: s.total })
        .eq('heat_id', heat.id)
        .eq('surfer_id', surferId);

      // Update surfer status
      await supabase.from('surfers')
        .update({ status: s.status })
        .eq('id', surferId);

      console.log(`  ${s.name}: ${s.total} (${s.w1}+${s.w2}) → ${s.status}`);

      // If winner advances, add them to the R2 heat
      if (s.advancesTo) {
        const { data: r2Heat } = await supabase.from('heats')
          .select('id')
          .eq('event_id', EVENT_ID)
          .eq('round_number', s.advancesTo.round)
          .eq('heat_number', s.advancesTo.heat)
          .single();

        if (r2Heat) {
          // Check if already assigned
          const { data: existing } = await supabase.from('heat_assignments')
            .select('id')
            .eq('heat_id', r2Heat.id)
            .eq('surfer_id', surferId);

          if (!existing || existing.length === 0) {
            await supabase.from('heat_assignments').insert({ heat_id: r2Heat.id, surfer_id: surferId });
            console.log(`  → Advanced to R2 Heat ${s.advancesTo.heat}`);
          } else {
            console.log(`  → Already in R2 Heat ${s.advancesTo.heat}`);
          }
        }
      }
    }

    // Mark heat as COMPLETED
    await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heat.id);
  }

  // ============================================================
  // UPDATE TEAM POINTS
  // ============================================================
  console.log("\n=== Recalculating Team Points ===");

  // Get all heat assignments for this event
  const { data: allAssignments } = await supabase.from('heat_assignments')
    .select('surfer_id, heat_score, heat:heats!inner(event_id)')
    .eq('heats.event_id', EVENT_ID);

  // Sum up total points per surfer across the event
  const surferTotals = {};
  for (const a of allAssignments) {
    if (!a.heat_score) continue;
    if (!surferTotals[a.surfer_id]) surferTotals[a.surfer_id] = 0;
    surferTotals[a.surfer_id] += a.heat_score;
  }

  // Update user_teams points
  const { data: teams } = await supabase.from('user_teams')
    .select('id, user_id, surfer_id')
    .eq('event_id', EVENT_ID);

  if (teams && teams.length > 0) {
    console.log(`Updating ${teams.length} user team picks...`);
    for (const team of teams) {
      const points = surferTotals[team.surfer_id] || 0;
      await supabase.from('user_teams').update({ points }).eq('id', team.id);
    }

    // Update profile total_fantasy_points (sum of ALL events)
    const userIds = [...new Set(teams.map(t => t.user_id))];
    for (const userId of userIds) {
      const { data: allUserTeams } = await supabase.from('user_teams').select('points').eq('user_id', userId);
      const totalPoints = allUserTeams ? allUserTeams.reduce((sum, t) => sum + (t.points || 0), 0) : 0;
      await supabase.from('profiles').update({ total_fantasy_points: totalPoints }).eq('id', userId);
    }

    // Update league_members
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

  // ============================================================
  // VERIFY
  // ============================================================
  console.log("\n=== Verification ===");

  // Check R2 heats that should now have R1 winners
  for (const r2h of [3, 6, 9, 13]) {
    const { data: heat } = await supabase.from('heats')
      .select('heat_assignments(surfers(name))')
      .eq('event_id', EVENT_ID)
      .eq('round_number', 2)
      .eq('heat_number', r2h)
      .single();

    const names = heat?.heat_assignments?.map(a => a.surfers?.name).join(' vs ') || 'EMPTY';
    console.log(`R2 H${r2h}: ${names}`);
  }

  // Check eliminated surfers
  const { data: eliminated } = await supabase.from('surfers')
    .select('name, status')
    .eq('status', 'ELIMINATED')
    .eq('is_on_tour', true);
  console.log(`\nEliminated: ${eliminated?.map(s => s.name).join(', ')}`);

  console.log("\n=== Done ===");
}

updateScores().catch(console.error);
