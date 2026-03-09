import { supabase } from './supabase';

export interface League {
    id: string;
    name: string;
    code: string;
    created_by: string;
    created_at: string;
}

export interface LeagueMember {
    id: string;
    league_id: string;
    user_id: string;
    is_admin: boolean;
    joined_at: string;
    // Joins
    profiles: {
        username: string;
        full_name: string;
        avatar_url: string | null;
        team_name: string | null;
        events_won: number;
        events_lost: number;
    };
}

export const createLeague = async (name: string, userId: string) => {
    // 1. Generate a random unique code (simple implementation)
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    // 2. Insert league
    const { data: league, error: leagueError } = await supabase
        .from('leagues')
        .insert({ name, code, created_by: userId })
        .select()
        .single();

    if (leagueError) throw leagueError;

    // 3. Add creator as first member (admin)
    const { error: memberError } = await supabase
        .from('league_members')
        .insert({
            league_id: league.id,
            user_id: userId,
            is_admin: true
        });

    if (memberError) {
        // Cleanup if member creation fails (optional, but good practice)
        await supabase.from('leagues').delete().eq('id', league.id);
        throw memberError;
    }

    return league;
};

export const joinLeague = async (code: string, userId: string) => {
    // 1. Find league by code
    const { data: league, error: findError } = await supabase
        .from('leagues')
        .select('id, name')
        .eq('code', code)
        .single();

    if (findError) throw new Error('League not found');

    // 2. Check for existing membership
    const { data: existingMember } = await supabase
        .from('league_members')
        .select('id')
        .eq('league_id', league.id)
        .eq('user_id', userId)
        .single();

    if (existingMember) {
        throw new Error('You have already joined this league.');
    }

    // 3. Insert member
    const { error: joinError } = await supabase
        .from('league_members')
        .insert({
            league_id: league.id,
            user_id: userId
        });

    if (joinError) throw joinError;

    return league;
};

export const getUserLeagues = async (userId: string) => {
    const { data, error } = await supabase
        .from('league_members')
        .select(`
      league_id,
      leagues (
        id,
        name,
        code,
        created_by
      )
    `)
        .eq('user_id', userId);

    if (error) throw error;
    return data.map((item: any) => item.leagues);
};

export const getLeagueLeaderboard = async (leagueId: string) => {
    const { data, error } = await supabase
        .from('league_members')
        .select(`
      *,
      profiles (
        username,
        full_name,
        avatar_url,
        team_name,
        events_won,
        events_lost 
      )
    `)
        .eq('league_id', leagueId);

    if (error) throw error;
    return data;
};

export const getGlobalLeaderboard = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
            id,
            username,
            full_name,
            team_name,
            avatar_url,
            events_won,
            events_lost
        `)
        // NOTE: total_points doesn't exist yet, so we just return profiles for now.
        // We will need to calculate points based on their team or add a total_points column later.
        .limit(100);

    if (error) throw error;
    return data;
};

export const leaveLeague = async (leagueId: string, userId: string) => {
    // 1. Delete the membership
    const { error } = await supabase
        .from('league_members')
        .delete()
        .eq('league_id', leagueId)
        .eq('user_id', userId);

    if (error) throw error;

    // 2. Check if league is empty now, if so, delete the league entirely
    const { count } = await supabase
        .from('league_members')
        .select('*', { count: 'exact', head: true })
        .eq('league_id', leagueId);

    if (count === 0) {
        await supabase.from('leagues').delete().eq('id', leagueId);
    }
};
