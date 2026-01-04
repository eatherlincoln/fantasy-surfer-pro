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

    // 2. Insert member
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
