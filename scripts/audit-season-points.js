
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const FIX = process.argv.includes('--fix');

const r2 = (n) => parseFloat((n || 0).toFixed(2));

async function audit() {
  console.log(`=== Season Points Audit ${FIX ? '(FIX MODE)' : '(READ-ONLY)'} ===\n`);

  // ---------------------------------------------------------
  // 1. Load all events
  // ---------------------------------------------------------
  const { data: events } = await supabase.from('events').select('id, name, status').order('start_date');
  console.log(`Events (${events.length}):`);
  events.forEach(e => console.log(`  - ${e.name} [${e.status}]`));

  // ---------------------------------------------------------
  // 2. Build per-event surfer totals from heat_assignments (source of truth)
  //    surferTotalsByEvent[event_id][surfer_id] = sum of heat_score
  // ---------------------------------------------------------
  const { data: allHeats } = await supabase.from('heats').select('id, event_id');
  const heatToEvent = new Map(allHeats.map(h => [h.id, h.event_id]));

  const { data: allAssign } = await supabase
    .from('heat_assignments')
    .select('surfer_id, heat_id, heat_score');

  const surferTotalsByEvent = {}; // event_id -> { surfer_id -> pts }
  for (const a of allAssign) {
    const eventId = heatToEvent.get(a.heat_id);
    if (!eventId) continue;
    if (!a.heat_score) continue;
    (surferTotalsByEvent[eventId] ||= {});
    surferTotalsByEvent[eventId][a.surfer_id] =
      (surferTotalsByEvent[eventId][a.surfer_id] || 0) + a.heat_score;
  }

  // ---------------------------------------------------------
  // 3. Load all user_teams (picks per event)
  // ---------------------------------------------------------
  const { data: teams } = await supabase
    .from('user_teams')
    .select('id, user_id, event_id, surfer_id, points');

  console.log(`\nuser_teams rows: ${teams.length}`);

  // ---------------------------------------------------------
  // 4. Check each pick's stored points vs recomputed
  // ---------------------------------------------------------
  let pickMismatches = [];
  const correctTeamPoints = new Map(); // user_team.id -> correct points
  for (const t of teams) {
    const expected = r2((surferTotalsByEvent[t.event_id] || {})[t.surfer_id] || 0);
    correctTeamPoints.set(t.id, expected);
    if (r2(t.points) !== expected) {
      pickMismatches.push({ id: t.id, user_id: t.user_id, event_id: t.event_id,
        surfer_id: t.surfer_id, stored: r2(t.points), expected });
    }
  }

  console.log(`\n--- Pick-level (user_teams.points) ---`);
  if (pickMismatches.length === 0) {
    console.log('  ✓ All pick points match heat_assignment totals');
  } else {
    console.log(`  ⚠️  ${pickMismatches.length} mismatched picks:`);
    pickMismatches.slice(0, 20).forEach(m =>
      console.log(`    team ${m.id.slice(0,8)} evt ${m.event_id.slice(0,8)} surfer ${m.surfer_id.slice(0,8)}: stored ${m.stored} → should be ${m.expected}`));
    if (pickMismatches.length > 20) console.log(`    ... +${pickMismatches.length - 20} more`);
  }

  // ---------------------------------------------------------
  // 5. Per-user season total = sum of correct pick points across ALL events
  // ---------------------------------------------------------
  const userSeasonTotal = {}; // user_id -> total
  const userEventBreakdown = {}; // user_id -> { event_id -> pts }
  for (const t of teams) {
    const pts = correctTeamPoints.get(t.id);
    userSeasonTotal[t.user_id] = (userSeasonTotal[t.user_id] || 0) + pts;
    (userEventBreakdown[t.user_id] ||= {});
    userEventBreakdown[t.user_id][t.event_id] =
      (userEventBreakdown[t.user_id][t.event_id] || 0) + pts;
  }

  // ---------------------------------------------------------
  // 6. Compare to profiles.total_fantasy_points
  // ---------------------------------------------------------
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, total_fantasy_points');
  const profileById = new Map(profiles.map(p => [p.id, p]));

  let profileMismatches = [];
  for (const p of profiles) {
    const expected = r2(userSeasonTotal[p.id] || 0);
    if (r2(p.total_fantasy_points) !== expected) {
      profileMismatches.push({ id: p.id, username: p.username,
        stored: r2(p.total_fantasy_points), expected });
    }
  }

  console.log(`\n--- Profile-level (profiles.total_fantasy_points = sum across all events) ---`);
  if (profileMismatches.length === 0) {
    console.log('  ✓ All profile season totals match');
  } else {
    console.log(`  ⚠️  ${profileMismatches.length} mismatched profiles:`);
    profileMismatches.forEach(m =>
      console.log(`    ${m.username || m.id.slice(0,8)}: stored ${m.stored} → should be ${m.expected}`));
  }

  // ---------------------------------------------------------
  // 7. League standings are READ-DERIVED, not stored.
  //    league_members has no total_points column — the app joins
  //    league_members.user_id -> profiles.total_fantasy_points at read time.
  //    So league ladders are correct iff profiles totals are correct (checked above).
  //    Verify every league member resolves to a profile.
  // ---------------------------------------------------------
  let lmMismatches = []; // kept for FIX summary symmetry; always empty (nothing stored to fix)
  const { data: leagueMembers } = await supabase
    .from('league_members')
    .select('id, league_id, user_id');

  const orphans = (leagueMembers || []).filter(lm => !profileById.has(lm.user_id));
  console.log(`\n--- League standings (read-derived from profiles, no stored column) ---`);
  console.log(`  league_members rows: ${leagueMembers?.length ?? 0}`);
  if (orphans.length === 0) {
    console.log('  ✓ Every league member resolves to a profile → league ladders use correct season totals');
  } else {
    console.log(`  ⚠️  ${orphans.length} league members have no matching profile:`);
    orphans.forEach(o => console.log(`    member ${o.id.slice(0,8)} user ${o.user_id.slice(0,8)} league ${o.league_id.slice(0,8)}`));
  }

  // ---------------------------------------------------------
  // 8. Season ladder preview (correct numbers)
  // ---------------------------------------------------------
  const eventName = new Map(events.map(e => [e.id, e.name]));
  console.log(`\n=== Correct Season Ladder ===`);
  const ladder = Object.entries(userSeasonTotal)
    .map(([uid, total]) => ({ uid, total: r2(total), name: profileById.get(uid)?.username || uid.slice(0,8) }))
    .sort((a, b) => b.total - a.total);
  ladder.forEach((row, i) => {
    const bd = userEventBreakdown[row.uid];
    const parts = Object.entries(bd).map(([eid, pts]) => `${(eventName.get(eid)||'?').slice(0,14)}=${r2(pts)}`).join('  ');
    console.log(`  ${String(i+1).padStart(2)}. ${row.name.padEnd(20)} ${String(row.total).padStart(8)}   [${parts}]`);
  });

  // ---------------------------------------------------------
  // 9. FIX
  // ---------------------------------------------------------
  if (FIX) {
    console.log(`\n=== Applying fixes ===`);

    if (pickMismatches.length) {
      for (const m of pickMismatches) {
        await supabase.from('user_teams').update({ points: m.expected }).eq('id', m.id);
      }
      console.log(`  ✓ Fixed ${pickMismatches.length} user_teams.points`);
    }

    if (profileMismatches.length) {
      for (const m of profileMismatches) {
        await supabase.from('profiles').update({ total_fantasy_points: m.expected }).eq('id', m.id);
      }
      console.log(`  ✓ Fixed ${profileMismatches.length} profiles.total_fantasy_points`);
    }

    // league standings are read-derived — nothing to write

    if (!pickMismatches.length && !profileMismatches.length && !lmMismatches.length) {
      console.log('  ✓ Nothing to fix — everything already correct');
    }
  } else {
    const totalIssues = pickMismatches.length + profileMismatches.length + lmMismatches.length;
    if (totalIssues > 0) {
      console.log(`\n⚠️  ${totalIssues} discrepancies found. Re-run with --fix to correct them.`);
    } else {
      console.log(`\n✓ Season points are fully consistent across all events.`);
    }
  }

  console.log('\n=== Done ===');
}

audit().catch(console.error);
