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

export const getLeagueLeaderboard = async (leagueId: string, eventId?: string) => {
    let select = `
      *,
      profiles (
        id,
        username,
        full_name,
        avatar_url,
        team_name,
        total_fantasy_points
      )
    `;

    const { data: members, error } = await supabase
        .from('league_members')
        .select(select)
        .eq('league_id', leagueId);

    if (error) throw error;

    // If eventId provided, augment with counts
    if (eventId && members && members.length > 0) {
        const castMembers = members as any[];
        const userIds = castMembers.map(m => m.user_id);
        const { data: teams, error: tErr } = await supabase
            .from('user_teams')
            .select('user_id')
            .eq('event_id', eventId)
            .in('user_id', userIds);

        if (tErr) {
            console.error(`[getLeagueLeaderboard] Error fetching team counts:`, tErr);
        } else if (teams) {
            console.log(`[getLeagueLeaderboard] Fetched ${teams.length} user_teams rows for ${userIds.length} users.`);
            const countsMap: Record<string, number> = {};
            (teams as any[]).forEach(t => {
                countsMap[t.user_id] = (countsMap[t.user_id] || 0) + 1;
            });
            castMembers.forEach((m: any) => {
                if (m.profiles) {
                    m.profiles.user_team_count = countsMap[m.user_id] || 0;
                }
            });
        }
    }

    return members;
};

export const getGlobalLeaderboard = async (eventId?: string) => {
    let select = `
        id,
        username,
        full_name,
        team_name,
        avatar_url,
        total_fantasy_points
    `;

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select(select)
        .order('total_fantasy_points', { ascending: false })
        .limit(100);

    if (error) throw error;

    // If eventId provided, augment with counts
    if (eventId && profiles && profiles.length > 0) {
        const castProfiles = profiles as any[];
        const userIds = castProfiles.map(p => p.id);
        const { data: teams, error: tErr } = await supabase
            .from('user_teams')
            .select('user_id')
            .eq('event_id', eventId)
            .in('user_id', userIds);

        if (tErr) {
            console.error(`[getGlobalLeaderboard] Error fetching team counts:`, tErr);
        } else if (teams) {
            console.log(`[getGlobalLeaderboard] Fetched ${teams.length} user_teams rows for ${userIds.length} profiles.`);
            const countsMap: Record<string, number> = {};
            (teams as any[]).forEach(t => {
                countsMap[t.user_id] = (countsMap[t.user_id] || 0) + 1;
            });
            castProfiles.forEach((p: any) => {
                p.user_team_count = countsMap[p.id] || 0;
            });
        }
    }

    return profiles;
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

export const getUserGlobalRank = async (userId: string) => {
    // 1. Get current user's points
    const { data: profile } = await supabase
        .from('profiles')
        .select('total_fantasy_points')
        .eq('id', userId)
        .single();

    if (!profile) return null;

    // 2. Count users with more points
    const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gt('total_fantasy_points', profile.total_fantasy_points || 0);

    return (count || 0) + 1;
};

export const getUserLeagueRank = async (userId: string, leagueId: string) => {
    // 1. Get current user's points
    const { data: profile } = await supabase
        .from('profiles')
        .select('total_fantasy_points')
        .eq('id', userId)
        .single();

    if (!profile) return null;

    // 2. Get all members of the league with their profiles
    const { data: members, error } = await supabase
        .from('league_members')
        .select(`
            user_id,
            profiles (
                total_fantasy_points
            )
        `)
        .eq('league_id', leagueId);

    if (error || !members) return null;

    // 3. Count members with more points
    const betterMembers = members.filter((m: any) =>
        (m.profiles?.total_fantasy_points || 0) > (profile.total_fantasy_points || 0)
    );

    return {
        rank: betterMembers.length + 1,
        totalMembers: members.length
    };
};
