
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '0bf327c1-4e50-4f4b-97b6-13628a0c3387';

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

// ============================================================
// QUARTERFINAL RESULTS
// QF1: Pupo 14.00 def Vaughan 13.06
// QF2: Medina def Colapinto (scores TBC)
// QF3: Pittar 13.07 def Dora 13.00
// QF4: Ferreira def Ewing (scores TBC)
// ============================================================
const qfResults = [
  { heat: 1, surfers: [
    { name: 'Samuel Pupo',    total: 14.00, status: 'active' },
    { name: 'Joel Vaughan',   total: 13.06, status: 'ELIMINATED' },
  ]},
  { heat: 2, surfers: [
    { name: 'Gabriel Medina',    total: null, status: 'active' },
    { name: 'Crosby Colapinto',  total: null, status: 'ELIMINATED' },
  ]},
  { heat: 3, surfers: [
    { name: 'George Pittar', total: 13.07, status: 'active' },
    { name: 'Yago Dora',     total: 13.00, status: 'ELIMINATED' },
  ]},
  { heat: 4, surfers: [
    { name: 'Italo Ferreira', total: null, status: 'active' },
    { name: 'Ethan Ewing',    total: null, status: 'ELIMINATED' },
  ]},
];

// ============================================================
// SEMIFINAL DRAW
// ============================================================
const sfDraw = [
  { heat: 1, surfers: ['Samuel Pupo', 'Gabriel Medina'] },
  { heat: 2, surfers: ['George Pittar', 'Italo Ferreira'] },
];

async function updateScores() {
  console.log("=== Updating Margaret River QF Scores ===\n");

  const { data: surfers } = await supabase.from('surfers').select('id, name');
  const surferMap = new Map();
  surfers.forEach(s => surferMap.set(s.name.toLowerCase().trim(), s.id));

  // --- STEP 1: Enter QF scores & statuses ---
  for (const h of qfResults) {
    console.log(`--- QF Heat ${h.heat} ---`);

    const { data: heat } = await supabase.from('heats')
      .select('id').eq('event_id', EVENT_ID).eq('round_number', 4).eq('heat_number', h.heat).single();

    if (!heat) { console.error(`  Heat not found: QF H${h.heat}`); continue; }

    for (const s of h.surfers) {
      const surferId = findSurferId(s.name, surferMap);
      if (!surferId) { console.error(`  SURFER NOT FOUND: ${s.name}`); continue; }

      // Only insert scores if we have them
      if (s.total !== null) {
        await supabase.from('scores').delete().eq('heat_id', heat.id).eq('surfer_id', surferId);
        const w1 = parseFloat((s.total / 2).toFixed(2));
        const w2 = parseFloat((s.total - w1).toFixed(2));
        await supabase.from('scores').insert([
          { heat_id: heat.id, surfer_id: surferId, wave_score: w1 },
          { heat_id: heat.id, surfer_id: surferId, wave_score: w2 },
        ]);
        await supabase.from('heat_assignments').update({ heat_score: s.total }).eq('heat_id', heat.id).eq('surfer_id', surferId);
      }

      // Always update status
      await supabase.from('surfers').update({ status: s.status }).eq('id', surferId);

      const marker = s.status === 'ELIMINATED' ? '❌' : '✓';
      const scoreStr = s.total !== null ? s.total : '(score TBC)';
      console.log(`  ${marker} ${s.name}: ${scoreStr}`);
    }

    await supabase.from('heats').update({ status: 'COMPLETED' }).eq('id', heat.id);
  }

  // --- STEP 2: Create Semifinal heats (round 5) ---
  console.log("\n=== Creating Semifinal Heats ===");
  for (const h of sfDraw) {
    let { data: existing } = await supabase.from('heats')
      .select('id').eq('event_id', EVENT_ID).eq('round_number', 5).eq('heat_number', h.heat).single();

    let heatId;
    if (existing) {
      heatId = existing.id;
      await supabase.from('heat_assignments').delete().eq('heat_id', heatId);
    } else {
      const { data: newHeat } = await supabase.from('heats')
        .insert({ event_id: EVENT_ID, round_number: 5, heat_number: h.heat, status: 'UPCOMING' })
        .select().single();
      heatId = newHeat.id;
    }

    for (const sName of h.surfers) {
      const sId = findSurferId(sName, surferMap);
      if (sId) await supabase.from('heat_assignments').insert({ heat_id: heatId, surfer_id: sId });
      else console.error(`  SURFER NOT FOUND for SF: ${sName}`);
    }
    console.log(`  SF H${h.heat}: ${h.surfers.join(' vs ')}`);
  }

  // --- STEP 3: Recalculate ALL team points ---
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

  // --- VERIFICATION ---
  console.log("\n=== Verification ===");
  const { data: active } = await supabase.from('surfers').select('name').neq('status', 'ELIMINATED').eq('is_on_tour', true);
  console.log(`Still active (${active?.length}): ${active?.map(s => s.name).join(', ')}`);

  console.log("\nSF Draw:");
  const { data: sfHeats } = await supabase.from('heats')
    .select('heat_number, heat_assignments(surfers(name))')
    .eq('event_id', EVENT_ID).eq('round_number', 5).order('heat_number');
  sfHeats?.forEach(h => {
    const names = h.heat_assignments?.map(a => a.surfers?.name).join(' vs ');
    console.log(`  SF H${h.heat_number}: ${names}`);
  });

  console.log("\n=== Done ===");
}

updateScores().catch(console.error);
