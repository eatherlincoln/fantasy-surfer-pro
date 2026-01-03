
import React, { useState, useEffect, useCallback } from 'react';
import { View, Surfer, EventStatus, UserProfile } from './types';
import { generateSurfCommentary } from './services/aiService';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TeamBuilder from './components/TeamBuilder';
import Navigation from './components/Navigation';
import Profile from './components/Profile';
import Leagues from './components/Leagues';

import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('LOGIN');
  const [eventStatus, setEventStatus] = useState<EventStatus>('DRAFTING');
  const [userTeam, setUserTeam] = useState<Surfer[]>(() => {
    const saved = localStorage.getItem('fantasy_surfer_team');
    return saved ? JSON.parse(saved) : [];
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        handleLogin(); // Auto-login if session exists
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        if (currentView === 'LOGIN') handleLogin();
        fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('fantasy_surfer_team', JSON.stringify(userTeam));
  }, [userTeam]);

  const handleLogin = () => {
    const hasTeam = userTeam.length > 0;
    setCurrentView(hasTeam ? 'DASHBOARD' : 'TEAM_BUILDER');
  };

  const handleSaveTeam = (team: Surfer[]) => {
    // When saving, we reset points and ensure they are ready for simulation
    const initializedTeam = team.map(s => ({ ...s, points: 0, status: 'Waiting' }));
    setUserTeam(initializedTeam);
    setCurrentView('DASHBOARD');
  };

  const simulateWave = useCallback(async () => {
    if (userTeam.length === 0) return;

    const randomIndex = Math.floor(Math.random() * userTeam.length);
    const score = parseFloat((Math.random() * 9.5).toFixed(2));
    const surfer = userTeam[randomIndex];

    // Optimistic Update
    setUserTeam(prev => {
      const newTeam = [...prev];
      const s = { ...newTeam[randomIndex] };
      s.points = (s.points || 0) + score;
      s.lastWaveScore = score;
      s.status = 'In Water Now';
      s.commentary = "Judge's analyzing...";
      newTeam[randomIndex] = s;
      return newTeam;
    });
    setEventStatus('LIVE');

    // AI Commentary
    try {
      const commentary = await generateSurfCommentary(surfer.name, score, "Pipeline Barrel");
      setUserTeam(prev => prev.map((s, idx) => idx === randomIndex ? { ...s, commentary } : s));
    } catch (e) {
      console.error(e);
    }

    // Reset status after 5 seconds to simulate heat ending
    setTimeout(() => {
      setUserTeam(prev => prev.map((s, idx) => idx === randomIndex ? { ...s, status: 'Waiting' } : s));
    }, 5000);
  }, [userTeam]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-primary-dark font-black tracking-widest text-xs uppercase animate-pulse">Syncing Roster...</p>
      </div>
    );
  }

  if (currentView === 'LOGIN') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background text-gray-800 flex flex-col items-center">
      <main className="flex-1 w-full max-w-screen-xl px-4 md:px-8 lg:px-12 pt-8 md:pt-16 pb-32">
        <div className="mx-auto">
          {currentView === 'DASHBOARD' && (
            <Dashboard
              userTeam={userTeam}
              eventStatus={eventStatus}
              onManageTeam={() => setCurrentView('TEAM_BUILDER')}
              onSimulate={simulateWave}
              userProfile={userProfile}
            />
          )}

          {currentView === 'TEAM_BUILDER' && (
            <TeamBuilder
              initialTeam={userTeam}
              isLocked={eventStatus === 'LIVE'}
              onSave={handleSaveTeam}
              userProfile={userProfile}
            />
          )}

          {currentView === 'PROFILE' && (
            <div className="max-w-2xl mx-auto"><Profile /></div>
          )}

          {currentView === 'LEAGUES' && (
            <div className="max-w-4xl mx-auto">
              <Leagues userTeam={userTeam} userProfile={userProfile} />
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-screen-md pointer-events-auto px-4 md:px-0 mb-6">
          <Navigation currentView={currentView} onViewChange={setCurrentView} />
        </div>
      </div>
    </div>
  );
};

export default App;
