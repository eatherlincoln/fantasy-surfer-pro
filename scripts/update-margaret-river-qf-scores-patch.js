
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '0bf327c1-4e50-4f4b-97b6-13628a0c3387';

// Patch QF2 and QF4 scores that were missing
const patches = [
  { heat: 2, surfers: [
    { name: 'Gabriel Medina',   total: 15.87 },
    { name: 'Crosby Colapinto', total: 11.83 },
  ]},
  { heat: 4, surfers: [
    { name: 'Italo Ferreira', total: 12.00 },
    { name: 'Ethan Ewing',    total: 8.33  },
  ]},
];

async function patch() {
  console.log("=== Patching QF2 & QF4 Scores ===\n");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  for (const h of patches) {
    console.log(`--- QF Heat ${h.heat} ---`);

    const { data: heat } = await supabase.from('heats')
      .select('id').eq('event_id', EVENT_ID).eq('round_number', 4).eq('heat_number', h.heat).single();

    if (!heat) { console.error(`  Heat not found: QF H${h.heat}`); continue; }

    for (const s of h.surfers) {
      const lower = s.name.toLowerCase().trim();
      const surferId = surferMap.get(lower);
      if (!surferId) { console.error(`  SURFER NOT FOUND: ${s.name}`); continue; }

      await supabase.from('scores').delete().eq('heat_id', heat.id).eq('surfer_id', surferId);
      const w1 = parseFloat((s.total / 2).toFixed(2));
      const w2 = parseFloat((s.total - w1).toFixed(2));
      await supabase.from('scores').insert([
        { heat_id: heat.id, surfer_id: surferId, wave_score: w1 },
        { heat_id: heat.id, surfer_id: surferId, wave_score: w2 },
      ]);
      await supabase.from('heat_assignments').update({ heat_score: s.total }).eq('heat_id', heat.id).eq('surfer_id', surferId);

      console.log(`  ✓ ${s.name}: ${s.total}`);
    }
  }

  // Recalculate all team points
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

  console.log("\n=== Done ===");
}

patch().catch(console.error);
