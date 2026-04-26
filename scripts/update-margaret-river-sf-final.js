
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '0bf327c1-4e50-4f4b-97b6-13628a0c3387';

const aliases = {
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

// ============================================================
// SEMIFINAL RESULTS (round 5)
// SF1: Medina 14.77 def Pupo 13.34
// SF2: Pittar 13.16 def Ferreira 12.16
// ============================================================
const sfResults = [
  { heat: 1, surfers: [
    { name: 'Gabriel Medina',  total: 14.77, status: 'active' },
    { name: 'Samuel Pupo',     total: 13.34, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'George Pittar',   total: 13.16, status: 'active' },
    { name: 'Italo Ferreira',  total: 12.16, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// FINAL RESULT (round 6)
// Pittar 15.17 def Medina 12.46  →  Pittar WINNER
// ============================================================
const finalResult = {
  heat: 1,
  surfers: [
    { name: 'George Pittar',  total: 15.17, status: 'active' },   // WINNER
    { name: 'Gabriel Medina', total: 12.46, status: 'ELIMINATED' },
  ],
};

async function updateScores() {
  console.log("=== Updating Margaret River Semifinals & Final ===\n");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // --------------------------------------------------------
  // STEP 1: Semifinals (round 5)
  // --------------------------------------------------------
  console.log("--- Semifinals ---");
  for (const h of sfResults) {
    console.log(`SF Heat ${h.heat}:`);

    // Ensure SF heat exists
    let { data: heat } = await supabase.from('heats')
      .select('id').eq('event_id', EVENT_ID).eq('round_number', 5).eq('heat_number', h.heat).single();

    if (!heat) {
      const { data: newHeat } = await supabase.from('heats')
        .insert({ event_id: EVENT_ID, round_number: 5, heat_number: h.heat, status: 'UPCOMING' })
        .select().single();
      heat = newHeat;
    }

    for (const s of h.surfers) {
      const surferId = findSurferId(s.name, surferMap);
      if (!surferId) { console.error(`  SURFER NOT FOUND: ${s.name}`); continue; }

      // Ensure assignment exists
      const { data: existing } = await supabase.from('heat_assignments')
        .select('id').eq('heat_id', heat.id).eq('surfer_id', surferId);
      if (!existing || existing.length === 0) {
        await supabase.from('heat_assignments').insert({ heat_id: heat.id, surfer_id: surferId });
      }

      await supabase.from('scores').delete().eq('heat_id', heat.id).eq('surfer_id', surferId);
      const w1 = parseFloat((s.total / 2).toFixed(2));
      const w2 = parseFloat((s.total - w1).toFixed(2));
      await supabase.from('scores').insert([
        { heat_id: heat.id, surfer_id: surferId, wave_score: w1 },
        { heat_id: heat.id, surfer_id: surferId, wave_score: w2 },
      ]);

      await supabase.from('heat_assignments').update({ heat_score: s.total }).eq('heat_id', heat.id).eq('surfer_id', surferId);
      await supabase.from('surfers').update({ status: s.status }).eq('id', surferId);

      const marker = s.status === 'ELIMINATED' ? '❌' : '✓';
      console.log(`  ${marker} ${s.name}: ${s.total}`);
    }

    await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heat.id);
  }

  // --------------------------------------------------------
  // STEP 2: Final (round 6)
  // --------------------------------------------------------
  console.log("\n--- Final ---");

  // Create or get the Final heat
  let { data: finalHeat } = await supabase.from('heats')
    .select('id').eq('event_id', EVENT_ID).eq('round_number', 6).eq('heat_number', 1).single();

  if (!finalHeat) {
    const { data: newHeat } = await supabase.from('heats')
      .insert({ event_id: EVENT_ID, round_number: 6, heat_number: 1, status: 'UPCOMING' })
      .select().single();
    finalHeat = newHeat;
  }

  for (const s of finalResult.surfers) {
    const surferId = findSurferId(s.name, surferMap);
    if (!surferId) { console.error(`  SURFER NOT FOUND: ${s.name}`); continue; }

    // Ensure assignment exists
    const { data: existing } = await supabase.from('heat_assignments')
      .select('id').eq('heat_id', finalHeat.id).eq('surfer_id', surferId);
    if (!existing || existing.length === 0) {
      await supabase.from('heat_assignments').insert({ heat_id: finalHeat.id, surfer_id: surferId });
    }

    await supabase.from('scores').delete().eq('heat_id', finalHeat.id).eq('surfer_id', surferId);
    const w1 = parseFloat((s.total / 2).toFixed(2));
    const w2 = parseFloat((s.total - w1).toFixed(2));
    await supabase.from('scores').insert([
      { heat_id: finalHeat.id, surfer_id: surferId, wave_score: w1 },
      { heat_id: finalHeat.id, surfer_id: surferId, wave_score: w2 },
    ]);

    await supabase.from('heat_assignments').update({ heat_score: s.total }).eq('heat_id', finalHeat.id).eq('surfer_id', surferId);
    await supabase.from('surfers').update({ status: s.status }).eq('id', surferId);

    const marker = s.status === 'ELIMINATED' ? '❌' : '🏆';
    console.log(`  ${marker} ${s.name}: ${s.total}`);
  }

  await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', finalHeat.id);

  // Mark event as COMPLETED
  await supabase.from('events').update({ status: 'COMPLETED' }).eq('id', EVENT_ID);
  console.log("\n  ✅ Event marked COMPLETED");

  // --------------------------------------------------------
  // STEP 3: Recalculate ALL team points
  // --------------------------------------------------------
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
  console.log("\n=== Final Verification ===");

  console.log("\nTop surfer point totals this event:");
  const topSurfers = Object.entries(surferTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8);

  // Map ids back to names
  const idToName = new Map(surfers.map(s => [s.id, s.name]));
  for (const [id, pts] of topSurfers) {
    console.log(`  ${idToName.get(id)}: ${pts.toFixed(2)} pts`);
  }

  const { data: allTeams } = await supabase.from('user_teams')
    .select('user_id, points, profiles(username)')
    .eq('event_id', EVENT_ID);

  // Aggregate per user for top 5 check
  const userPts = {};
  (allTeams || []).forEach(t => {
    if (!userPts[t.user_id]) userPts[t.user_id] = { pts: 0, username: t.profiles?.username };
    userPts[t.user_id].pts += (t.points || 0);
  });

  const topUsers = Object.values(userPts).sort((a, b) => b.pts - a.pts).slice(0, 5);
  console.log("\nTop 5 fantasy teams (event points):");
  topUsers.forEach((u, i) => console.log(`  ${i+1}. ${u.username}: ${u.pts.toFixed(2)}`));

  console.log("\n🏆 WINNER: George Pittar");
  console.log("=== Done ===");
}

updateScores().catch(console.error);
