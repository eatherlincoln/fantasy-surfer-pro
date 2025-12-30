
import { View } from '../types';

// Mock user type
export interface User {
    id: string;
    name: string;
    email: string;
}

const USER_STORAGE_KEY = 'fantasy_surfer_user';

export const authService = {
    login: async (email: string, password: string): Promise<User> => {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate auth delay
        // Mock login success
        const user = {
            id: 'u_12345',
            name: 'Surfer Bro',
            email: email || 'bro@fantasysurfer.com'
        };
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        return user;
    },

    logout: async (): Promise<void> => {
        localStorage.removeItem(USER_STORAGE_KEY);
    },

    getCurrentUser: (): User | null => {
        const saved = localStorage.getItem(USER_STORAGE_KEY);
        return saved ? JSON.parse(saved) : null;
    }
};
