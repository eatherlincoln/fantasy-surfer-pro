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
        .select('*')
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
        .insert({ heat_id: heatId, surfer_id: parseInt(surferId), wave_score: score })
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
