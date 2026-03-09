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
 * Retrieves another user's drafted team for a specific event to display on leaderboards.
 */
export const getUserTeamFromDB = async (userId: string, eventId: string): Promise<Surfer[]> => {
    const { data, error } = await supabase
        .from('user_teams')
        .select(`
      surfer_id,
      points,
      surfers (
        id,
        name,
        tier,
        value,
        country
      )
    `)
        .eq('user_id', userId)
        .eq('event_id', eventId);

    if (error) {
        console.error("Error fetching user team from DB:", error);
        return [];
    }

    // Format back into our standard Surfer array syntax
    return data.map((row: any) => ({
        id: row.surfers.id,
        name: row.surfers.name,
        tier: row.surfers.tier,
        value: row.surfers.value,
        country: row.surfers.country,
        points: row.points,
        status: 'Waiting', // Default status for viewing other teams
        image: '', // Can be fetched separately or we omit image in small leaderboard views
    })) as Surfer[];
};
