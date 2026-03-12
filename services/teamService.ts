import { supabase } from './supabase';
import { Surfer } from '../types';

/**
 * Saves or updates a user's drafted team in the Supabase 'user_teams' table.
 */
export const syncUserTeamToDB = async (userId: string, eventId: string, team: Surfer[]) => {
    if (!eventId || !userId) return;

    // 1. Delete the existing team for this user and event to replace it
    await supabase
        .from('user_teams')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId);

    if (team.length === 0) return;

    // 2. Insert the new roster
    const inserts = team.map(surfer => ({
        user_id: userId,
        surfer_id: surfer.id,
        event_id: eventId,
        points: surfer.points || 0
    }));

    const { error } = await supabase
        .from('user_teams')
        .insert(inserts);

    if (error) {
        console.error("Error syncing team to DB:", error);
        throw error;
    }
};

/**
 * Helper to identify eliminated surfers based on heat results (3rd or 4th place in any heat).
 */
export const getEliminatedSurferIds = async (eventId: string): Promise<Set<string>> => {
    // 1. Fetch completed heats
    const { data: heats } = await supabase
        .from('heats')
        .select('id')
        .eq('event_id', eventId)
        .eq('status', 'COMPLETED');

    if (!heats || heats.length === 0) return new Set();

    const heatIds = heats.map(h => h.id);

    // 2. Fetch assignments
    const { data: assignments } = await supabase
        .from('heat_assignments')
        .select('surfer_id, heat_id, heat_score')
        .in('heat_id', heatIds);

    if (!assignments) return new Set();

    // 3. Calculate ranks
    const heatGroups: Record<string, any[]> = {};
    assignments.forEach(a => {
        if (!heatGroups[a.heat_id]) heatGroups[a.heat_id] = [];
        heatGroups[a.heat_id].push(a);
    });

    const eliminated = new Set<string>();
    for (const hId in heatGroups) {
        const sorted = heatGroups[hId].sort((a, b) => (b.heat_score || 0) - (a.heat_score || 0));
        sorted.forEach((a, index) => {
            if (index + 1 >= 3) {
                eliminated.add(a.surfer_id);
            }
        });
    }

    return eliminated;
};

/**
 * Retrieves another user's drafted team for a specific event to display on leaderboards.
 */
export const getUserTeamFromDB = async (userId: string, eventId: string): Promise<Surfer[]> => {
    const { data: teamRows, error: teamError } = await supabase
        .from('user_teams')
        .select('user_id, surfer_id, points, event_id')
        .eq('user_id', userId)
        .eq('event_id', eventId);

    if (teamError) {
        console.error("Error fetching user team rows:", teamError);
        return [];
    }

    if (!teamRows || teamRows.length === 0) return [];

    // 2. Fetch the corresponding surfers
    const surferIds = teamRows.map(row => row.surfer_id);
    const { data: surfers, error: surferError } = await supabase
        .from('surfers')
        .select('*')
        .in('id', surferIds);

    if (surferError) {
        console.error("Error fetching surfers for team:", surferError);
        return [];
    }

    // 3. Get eliminated list to set status correctly
    const eliminatedIds = await getEliminatedSurferIds(eventId);

    // 4. Format back into our standard Surfer array syntax, combining data
    return teamRows.map((row: any) => {
        const surfer = surfers?.find(s => s.id === row.surfer_id);
        const isEliminated = eliminatedIds.has(row.surfer_id);

        return {
            id: row.surfer_id,
            name: surfer?.name || 'Unknown Surfer',
            tier: surfer?.tier || 'C',
            value: surfer?.value || 5,
            country: surfer?.country || '',
            points: row.points || 0,
            status: isEliminated ? 'Eliminated' : 'Waiting',
            image: surfer?.image || '',
        };
    }) as Surfer[];
};
