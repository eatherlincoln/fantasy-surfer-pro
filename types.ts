
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

export type View = 'LOGIN' | 'DASHBOARD' | 'TEAM_BUILDER' | 'LEAGUES' | 'PROFILE';

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
