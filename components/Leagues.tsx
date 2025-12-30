
import React, { useState, useMemo } from 'react';
import { Surfer } from '../types';

interface LeagueMember {
  id: string;
  rank: number;
  name: string;
  initial: string;
  points: number;
  surfersLeft: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue?: number;
  isUser?: boolean;
  lineup?: { name: string; status: 'IN HEAT' | 'OUT' | 'NEXT'; image: string }[];
}

interface LeaguesProps {
  userTeam: Surfer[];
}

const MOCK_OTHER_MEMBERS: LeagueMember[] = [
  { id: '2', rank: 2, name: 'Mike', initial: 'M', points: 122.3, surfersLeft: 3, trend: 'down', trendValue: 1 },
  { id: '3', rank: 3, name: 'Sarah', initial: 'S', points: 118.9, surfersLeft: 2, trend: 'up', trendValue: 2 },
  { id: '4', rank: 4, name: 'Jake', initial: 'J', points: 115.2, surfersLeft: 1, trend: 'down', trendValue: 2 },
  { id: '5', rank: 5, name: 'Emma', initial: 'E', points: 108.7, surfersLeft: 0, trend: 'neutral' },
  { id: '6', rank: 6, name: 'Chris', initial: 'C', points: 104.1, surfersLeft: 1, trend: 'up', trendValue: 1 },
];

const Leagues: React.FC<LeaguesProps> = ({ userTeam }) => {
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const userStats = useMemo(() => {
    const totalPoints = userTeam.reduce((acc, s) => acc + (s.points || 0), 0);
    const activeSurfers = userTeam.filter(s => s.status !== 'Eliminated').length;
    
    // Map surfer status to league UI status
    const lineup = userTeam.map(s => ({
      name: s.name.split(' ').pop() || '',
      image: s.image,
      status: s.status === 'In Water Now' ? 'IN HEAT' : s.status === 'Eliminated' ? 'OUT' : 'NEXT' as any
    }));

    return {
      points: totalPoints > 0 ? totalPoints : 127.5, // Fallback to mock if zero for aesthetic demo
      surfersLeft: userTeam.length > 0 ? activeSurfers : 4,
      lineup: userTeam.length > 0 ? lineup : undefined
    };
  }, [userTeam]);

  const allMembers = useMemo(() => {
    const userMember: LeagueMember = {
      id: '1',
      rank: 1,
      name: 'You',
      initial: 'Y',
      points: userStats.points,
      surfersLeft: userStats.surfersLeft,
      trend: 'up',
      trendValue: 3,
      isUser: true,
      lineup: userStats.lineup
    };

    return [userMember, ...MOCK_OTHER_MEMBERS];
  }, [userStats]);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <header className="flex items-center justify-between mb-8">
        <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <span className="material-icons-round text-gray-800">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold text-gray-900">Standings</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
          <span className="material-icons-round text-gray-800">settings</span>
        </button>
      </header>

      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Friends League</h2>
        <div className="flex items-center text-sm text-gray-400 mt-1 font-medium">
          <span>Pipeline Pro 2024</span>
          <span className="mx-2 w-1 h-1 rounded-full bg-gray-300"></span>
          <span>{allMembers.length} members</span>
        </div>
      </div>

      {/* Podium Section */}
      <div className="bg-gray-50 rounded-3xl p-6 mb-10 border border-gray-100/50 apple-shadow">
        <div className="flex justify-center items-end h-48 space-x-2">
          {/* 2nd Place */}
          <div className="flex flex-col items-center flex-1">
            <div className="text-[10px] font-bold text-gray-400 mb-1">Mike</div>
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm z-10 relative">
              <span className="text-lg font-bold text-gray-500">M</span>
              <div className="absolute -bottom-2 bg-white rounded-full p-0.5 border border-gray-100 shadow-sm">
                <span className="material-icons-round text-[12px] text-gray-400">military_tech</span>
              </div>
            </div>
            <div className="bg-gradient-to-t from-gray-200 to-gray-100/30 w-full h-16 rounded-t-xl mt-2 flex items-center justify-center">
              <span className="text-[10px] font-bold text-gray-500">2</span>
            </div>
            <div className="text-[10px] font-bold text-gray-400 mt-2">122.3 pts</div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center flex-1 relative -top-4">
            <span className="material-icons-round text-yellow-500 text-2xl mb-1">emoji_events</span>
            <div className="text-[10px] font-bold text-primary mb-1">You</div>
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-4 border-white shadow-md z-10">
              <span className="text-2xl font-bold text-primary-dark">Y</span>
            </div>
            <div className="bg-gradient-to-t from-primary/30 to-primary/5 w-full h-24 rounded-t-xl mt-2 border-t border-primary/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-dark">1</span>
            </div>
            <div className="text-[11px] font-bold text-primary mt-2">{userStats.points.toFixed(1)} pts</div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center flex-1">
            <div className="text-[10px] font-bold text-gray-400 mb-1">Sarah</div>
            <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center border-2 border-white shadow-sm z-10 relative">
              <span className="text-lg font-bold text-orange-400">S</span>
              <div className="absolute -bottom-2 bg-white rounded-full p-0.5 border border-gray-100 shadow-sm">
                <span className="material-icons-round text-[12px] text-orange-400">military_tech</span>
              </div>
            </div>
            <div className="bg-gradient-to-t from-orange-100/50 to-orange-50/20 w-full h-12 rounded-t-xl mt-2 flex items-center justify-center">
              <span className="text-[10px] font-bold text-orange-400/70">3</span>
            </div>
            <div className="text-[10px] font-bold text-gray-400 mt-2">118.9 pts</div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4 px-1">Full Standings</h3>
      <div className="bg-white rounded-2xl apple-shadow border border-accent/50 overflow-hidden divide-y divide-gray-50">
        {allMembers.map((member) => (
          <div key={member.id} className="flex flex-col">
            <button 
              onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
              className="flex items-center p-4 hover:bg-gray-50 transition-colors w-full text-left"
            >
              <span className={`text-sm font-bold w-6 ${member.rank <= 3 ? 'text-primary' : 'text-gray-300'}`}>
                {member.rank}
              </span>
              <div className={`w-10 h-10 rounded-full ${member.isUser ? 'bg-primary/20' : 'bg-gray-100'} flex-shrink-0 flex items-center justify-center text-sm font-bold mr-3 ${member.isUser ? 'text-primary-dark' : 'text-gray-500'}`}>
                {member.initial}
              </div>
              <div className="flex-grow">
                <div className="font-bold text-sm text-gray-900">{member.name}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{member.surfersLeft} surfers left</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="font-bold text-sm">
                  {member.points.toFixed(1)} <span className="text-[10px] font-normal text-gray-400">pts</span>
                </div>
                {member.trend !== 'neutral' && (
                  <div className={`flex items-center text-[10px] font-bold ${member.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    <span className="material-icons-round text-[14px] mr-0.5">
                      {member.trend === 'up' ? 'trending_up' : 'trending_down'}
                    </span>
                    {member.trendValue}
                  </div>
                )}
                {member.trend === 'neutral' && <span className="text-gray-300">—</span>}
              </div>
              <span className={`material-icons-round text-gray-300 ml-2 transition-transform duration-300 ${expandedId === member.id ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {expandedId === member.id && member.lineup && (
              <div className="bg-gray-50/50 px-4 pb-4 border-t border-gray-50 animate-in slide-in-from-top duration-300">
                <div className="pt-4">
                  <h4 className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-3">Current Lineup</h4>
                  <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-2">
                    {member.lineup.map((surfer, idx) => (
                      <div key={idx} className="flex-shrink-0 w-16 text-center">
                        <div className={`w-14 h-14 mx-auto rounded-full bg-gray-200 relative overflow-hidden border-2 ${surfer.status === 'OUT' ? 'grayscale opacity-60 border-gray-300' : 'border-primary'}`}>
                          <img alt={surfer.name} className="w-full h-full object-cover" src={surfer.image} />
                          {surfer.status === 'OUT' && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <span className="material-icons-round text-white text-lg">close</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] font-bold mt-1 truncate text-gray-700">{surfer.name}</p>
                        <p className={`text-[8px] font-extrabold ${surfer.status === 'IN HEAT' ? 'text-green-500' : surfer.status === 'NEXT' ? 'text-blue-500' : 'text-gray-400'}`}>
                          {surfer.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leagues;
