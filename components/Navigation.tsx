
import React from 'react';
import { View } from '../types';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const tabs = [
    { id: 'DASHBOARD' as View, label: 'Home', icon: 'home' },
    { id: 'TEAM_BUILDER' as View, label: 'My Team', icon: 'groups' },
    { id: 'LEAGUES' as View, label: 'Leagues', icon: 'emoji_events' },
    { id: 'PROFILE' as View, label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="glass border border-white/20 apple-shadow md:rounded-full h-20 px-8 pb-1 flex justify-around items-center transition-all">
      {tabs.map((tab) => {
        const isActive = currentView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`flex flex-col items-center gap-1.5 transition-all relative group flex-1 ${isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <span 
              className={`material-symbols-outlined text-3xl transition-transform ${isActive ? 'scale-110 font-bold' : 'group-hover:scale-105'}`} 
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {tab.icon}
            </span>
            <span className={`text-[9px] font-black tracking-widest uppercase ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {tab.label}
            </span>
            
            {isActive && (
              <div className="absolute -top-6 w-10 h-1.5 bg-primary rounded-full animate-in slide-in-from-top duration-300"></div>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;
