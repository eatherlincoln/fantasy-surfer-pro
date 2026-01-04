
export enum Tier {
  A = 'A',
  B = 'B',
  C = 'C'
}

export type EventStatus = 'DRAFTING' | 'LIVE' | 'COMPLETED';

export interface Surfer {
  id: string;
  name: string;
  country: string;
  flag: string;
  stance: 'Regular' | 'Goofy';
  gender: 'Male' | 'Female';
  age: number;
  value: number; // in millions
  tier: Tier;
  image: string;
  points: number; // Defaults to 0
  status: 'Next Heat' | 'Eliminated' | 'In Water Now' | 'Waiting';
  nextHeat?: string;
  lastWaveScore?: number;
  commentary?: string;
}

export interface Team {
  surfers: Surfer[];
  budget: number;
  totalBudget: number;
}

export type View = 'LOGIN' | 'DASHBOARD' | 'TEAM_BUILDER' | 'LEAGUES' | 'PROFILE' | 'ADMIN';

export interface Heat {
  id: string;
  number: number;
  time: string;
  surfers: {
    name: string;
    country: string;
    color: string;
  }[];
}

export interface UserProfile {
  id?: string;
  username: string | null;
  avatar_url: string | null;
  full_name?: string;
  team_name?: string;
  is_paid?: boolean;
  events_won?: number;
  events_lost?: number;
}
