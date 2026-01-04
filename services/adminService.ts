import { supabase } from './supabase';

// Types
export interface Event {
    id: string;
    name: string;
    slug: string;
    status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
    start_date: string;
    end_date: string;
}

export interface Heat {
    id: string;
    event_id: string;
    round_number: number;
    heat_number: number;
    status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
    heat_assignments?: {
        surfer_id: string;
        surfers: {
            id: string;
            name: string;
            country: string;
            flag: string;
            image: string;
            stance: string;
        };
    }[];
    scores?: {
        surfer_id: string;
        wave_score: number;
    }[];
}

export interface Score {
    heat_id: string;
    surfer_id: string; // BigInt in DB, string here to be safe
    wave_score: number;
    is_best_wave: boolean;
}

// --- Event Management ---

export const createEvent = async (name: string, slug: string, start_date: string, end_date: string) => {
    const { data, error } = await supabase
        .from('events')
        .insert({ name, slug, start_date, end_date })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getEvents = async () => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false });

    if (error) throw error;
    return data;
};

export const updateEventStatus = async (eventId: string, status: 'UPCOMING' | 'LIVE' | 'COMPLETED') => {
    const { data, error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', eventId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// --- Heat Management ---

export const createHeat = async (eventId: string, round: number, heatNum: number) => {
    const { data, error } = await supabase
        .from('heats')
        .insert({ event_id: eventId, round_number: round, heat_number: heatNum })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getHeats = async (eventId: string) => {
    const { data, error } = await supabase
        .from('heats')
        .select(`
            *,
            heat_assignments (
                surfer_id,
                surfers (
                    id,
                    name,
                    country,
                    flag,
                    image,
                    stance
                )
            ),
            scores (
                surfer_id,
                wave_score
            )
        `)
        .eq('event_id', eventId)
        .order('heat_number', { ascending: true });

    if (error) throw error;
    return data;
};

export const startHeat = async (heatId: string) => {
    const { data, error } = await supabase
        .from('heats')
        .update({ status: 'LIVE' })
        .eq('id', heatId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const endHeat = async (heatId: string) => {
    const { data, error } = await supabase
        .from('heats')
        .update({ status: 'COMPLETED' })
        .eq('id', heatId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// --- Scoring & Surfer Management ---

export const submitWaveScore = async (heatId: string, surferId: string, score: number) => {
    // 1. Insert Score
    const { data: scoreData, error: scoreError } = await supabase
        .from('scores')
        .insert({ heat_id: heatId, surfer_id: surferId, wave_score: score })
        .select()
        .single();

    if (scoreError) throw scoreError;

    // 2. Update Surfer's current heat points (Simplified logic for now)
    // In a real app, we'd query top 2 waves and sum them here, or use a DB trigger.
    // For MVP, we presume the frontend/admin calculates the total or we just log waves.

    return scoreData;
};

export const eliminateSurfer = async (surferId: string) => {
    const { data, error } = await supabase
        .from('surfers')
        .update({ status: 'ELIMINATED' })
        .eq('id', surferId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const advanceSurfer = async (surferId: string) => {
    const { data, error } = await supabase
        .from('surfers')
        .update({ status: 'active' }) // Reset to active for next round
        .eq('id', surferId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// --- Delete Functions ---

export const deleteEvent = async (eventId: string) => {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

    if (error) throw error;
};

export const deleteHeat = async (heatId: string) => {
    const { error } = await supabase
        .from('heats')
        .delete()
        .eq('id', heatId);

    if (error) throw error;
};

// --- Bulk Import / Assignments ---

export const createHeatAssignment = async (heatId: string, surferId: string) => {
    const { data, error } = await supabase
        .from('heat_assignments')
        .insert({ heat_id: heatId, surfer_id: surferId })
        .select()
        .single();

    // Do not throw! Return error so UI can handle duplicates.
    return { data, error };
};

export const deleteHeatAssignment = async (heatId: string, surferId: string) => {
    console.log('Deleting assignment:', { heatId, surferId });
    const { error } = await supabase
        .from('heat_assignments')
        .delete()
        .eq('heat_id', heatId)
        .eq('surfer_id', surferId); // Logical AND by default

    if (error) {
        console.error('Delete Error:', error);
        throw error;
    }
};

// Helper to find a surfer by name (fuzzy match or exact)
export const findSurferByName = async (name: string) => {
    const { data, error } = await supabase
        .from('surfers')
        .select('id, name')
        .ilike('name', `%${name}%`)
        .limit(1)
        .single();

    if (error) return null; // Surfer not found
    return data;
};

// Flag Mapping
export const COUNTRY_FLAGS: { [key: string]: string } = {
    'AUS': '🇦🇺', 'USA': '🇺🇸', 'BRA': '🇧🇷', 'HAW': '🇺🇸',
    'FRA': '🇫🇷', 'ZAF': '🇿🇦', 'JPN': '🇯🇵', 'ITA': '🇮🇹',
    'PRT': '🇵🇹', 'IDN': '🇮🇩', 'MEX': '🇲🇽', 'PYF': '🇵🇫',
    'UNK': '🏳️'
};

const NORMALIZE_COUNTRY: { [key: string]: string } = {
    'AUSTRALIA': 'AUS', 'AMERICA': 'USA', 'UNITED STATES': 'USA',
    'BRAZIL': 'BRA', 'BRASIL': 'BRA',
    'HAWAII': 'HAW',
    'FRANCE': 'FRA',
    'SOUTH AFRICA': 'ZAF',
    'JAPAN': 'JPN',
    'ITALY': 'ITA',
    'PORTUGAL': 'PRT',
    'INDONESIA': 'IDN',
    'MEXICO': 'MEX',
    'TAHITI': 'PYF', 'FRENCH POLYNESIA': 'PYF'
};

export const getOrCreateSurfer = async (name: string, countryCode?: string) => {
    // Resolve Flag and Code
    let flag = '🏳️';
    let country = 'UNK';

    if (countryCode) {
        const rawUpper = countryCode.toUpperCase().trim();
        // 1. Check if it's a known full name
        if (NORMALIZE_COUNTRY[rawUpper]) {
            country = NORMALIZE_COUNTRY[rawUpper];
        } else if (rawUpper.length === 3) {
            // Assume it's already a code
            country = rawUpper;
        } else {
            // Fallback: Store what we got, but flag will likely be white
            country = rawUpper;
        }

        flag = COUNTRY_FLAGS[country] || '🏳️';
        if (country === 'HAW') flag = '🇺🇸'; // Special case override
    }

    // 1. Try to find
    const existing = await findSurferByName(name);

    if (existing) {
        // UPDATE if country provided and different (or if flag is missing/white but we have a better one)
        // Also update if the existing flag is white/default and we have a real one now.
        const shouldUpdate = (countryCode && existing.country !== country) || (flag !== '🏳️' && existing.flag === '🏳️');

        if (shouldUpdate) {
            const { data: updated, error: updateErr } = await supabase
                .from('surfers')
                .update({ country, flag })
                .eq('id', existing.id)
                .select()
                .single();

            return { data: updated || existing, error: updateErr };
        }
        return { data: existing, error: null };
    }

    // 2. Create if missing
    const newSurfer = {
        name: name,
        country: country,
        flag: flag,
        stance: 'Regular',
        gender: 'Male',
        tier: 'C',
        value: 5.0,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };

    const { data, error } = await supabase
        .from('surfers')
        .insert(newSurfer)
        .select('id, name')
        .single();

    return { data, error };
};

// --- Finalize Heat Logic ---

export const getHeatScores = async (heatId: string) => {
    const { data, error } = await supabase
        .from('scores')
        .select('*')
        .eq('heat_id', heatId);

    if (error) throw error;
    return data;
};

export const finalizeHeat = async (heatId: string) => {
    // 1. Get all scores for this heat
    const scores = await getHeatScores(heatId);

    // 2. Get assignments to know who is in the heat
    const { data: heat } = await supabase
        .from('heats')
        .select(`
            id, 
            heat_assignments (
                surfer_id
            )
        `)
        .eq('id', heatId)
        .single();

    if (!heat || !heat.heat_assignments) throw new Error("Heat data not found");

    // 3. For each surfer, calculate Top 2 waves
    for (const assignment of heat.heat_assignments) {
        const surferId = assignment.surfer_id;
        const surferScores = scores
            .filter(s => s.surfer_id === surferId)
            .map(s => parseFloat(s.wave_score))
            .sort((a, b) => b - a); // Descending

        const top2 = surferScores.slice(0, 2);
        const heatTotal = top2.reduce((sum, score) => sum + score, 0);

        // A. Save Heat Total to Assignment (History)
        await supabase
            .from('heat_assignments')
            .update({ heat_score: heatTotal })
            .eq('heat_id', heatId)
            .eq('surfer_id', surferId);

        // B. Distribute Fantasy Points
        // Find all users who have this surfer in their active team
        const { data: userTeams } = await supabase
            .from('user_teams')
            .select('id, user_id, points')
            .eq('surfer_id', surferId);

        if (userTeams) {
            for (const team of userTeams) {
                // Add points to the specific pick
                await supabase
                    .from('user_teams')
                    .update({ points: (team.points || 0) + heatTotal })
                    .eq('id', team.id);

                // Add points to User's Global Total
                // We do this by RPC or direct fetch-update to avoid race conditions ideally, 
                // but for MVP direct update is fine.
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id, total_fantasy_points')
                    .eq('id', team.user_id)
                    .single();

                if (profile) {
                    await supabase
                        .from('profiles')
                        .update({ total_fantasy_points: (profile.total_fantasy_points || 0) + heatTotal })
                        .eq('id', team.user_id);
                }
            }
        }
    }

    // 4. Mark Heat as Completed
    await supabase
        .from('heats')
        .update({ status: 'COMPLETED' })
        .eq('id', heatId);

    return { success: true };
};
