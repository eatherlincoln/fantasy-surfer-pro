
import { Surfer } from '../types';
import { MOCK_SURFERS } from '../constants';

const TEAM_STORAGE_KEY = 'fantasy_surfer_team';

export const surferService = {
  /**
   * Fetch all available surfers for the draft.
   * intended to mimic: supabase.from('surfers').select('*')
   */
  getAllSurfers: async (): Promise<Surfer[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_SURFERS];
  },

  /**
   * Get the current user's saved team.
   * intended to mimic: supabase.from('teams').select('*').eq('user_id', user.id)
   */
  getUserTeam: async (): Promise<Surfer[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const saved = localStorage.getItem(TEAM_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  /**
   * Save the user's team.
   * intended to mimic: supabase.from('teams').upsert(...)
   */
  saveUserTeam: async (team: Surfer[]): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.setItem(TEAM_STORAGE_KEY, JSON.stringify(team));
  }
};
