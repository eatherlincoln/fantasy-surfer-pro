
import React, { useState, useEffect } from 'react';
import { MOCK_SURFERS, MOCK_HEATS } from '../constants';
import { Surfer, EventStatus } from '../types';
import { generateBriefing } from '../services/aiService';

interface DashboardProps {
  userTeam: Surfer[];
  eventStatus: EventStatus;
  onManageTeam: () => void;
  onSimulate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userTeam, eventStatus, onManageTeam, onSimulate }) => {
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const displayTeam = userTeam.length > 0 ? userTeam : MOCK_SURFERS.slice(0, 3);

  const totalPoints = userTeam.reduce((acc, s) => acc + (s.points || 0), 0);

  useEffect(() => {
    const fetchBriefing = async () => {
      if (userTeam.length === 0 || aiBriefing) return;
      setIsBriefingLoading(true);
      try {
        const briefing = await generateBriefing(userTeam, totalPoints);
        setAiBriefing(briefing);
      } catch (e) {
        setAiBriefing("Swell's looking good. Your roster is ready for the incoming set.");
      } finally {
        setIsBriefingLoading(false);
      }
    };

    fetchBriefing();
  }, [userTeam, totalPoints]);

  return (
    <div className="pb-12 animate-in fade-in duration-500">
      <header className="flex justify-between items-center mb-10">
        <div>
          <p className="text-[10px] md:text-xs font-bold text-primary-dark uppercase tracking-widest mb-1">Current Event</p>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Pipeline Pro 2026</h1>
        </div>
        <button onClick={onSimulate} className="h-12 px-6 rounded-2xl bg-white border border-accent apple-shadow flex items-center gap-2 hover:bg-gray-50 transition active:scale-95">
          <span className="material-icons-round text-primary-dark">bolt</span>
          <span className="text-xs font-black uppercase tracking-widest">Sim Wave</span>
        </button>
      </header>

      {/* AI Daily Briefing */}
      <div className="mb-10 bg-white rounded-[40px] p-8 border border-white apple-shadow relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-icons-round">auto_awesome</span>
          </div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Morning Briefing</h4>
        </div>
        {isBriefingLoading ? (
          <div className="flex gap-2">
            <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded"></div>
            <div className="h-4 w-1/4 bg-gray-100 animate-pulse rounded"></div>
          </div>
        ) : (
          <p className="text-lg font-medium text-gray-700 leading-relaxed italic">
            "{aiBriefing || "Draft your team to get your personalized AI scouting report."}"
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-accent flex justify-between items-center relative overflow-hidden">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Event Status</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${eventStatus === 'LIVE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {eventStatus}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">1st</span>
              <span className="text-lg font-medium text-gray-400">/ 12</span>
            </div>
            <span className="text-xs font-bold text-primary-dark uppercase mt-2 tracking-wide">Friends League</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Total Points</span>
            <div className="text-4xl font-black text-primary-dark mt-1 animate-in zoom-in duration-300" key={totalPoints}>
              {totalPoints.toFixed(2)}
            </div>
            <div className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tight">Ranked #132 Global</div>
          </div>
        </div>

        <div className="bg-primary rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div className="flex flex-col">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold mb-3 w-fit">
                <span className={`w-2 h-2 rounded-full ${eventStatus === 'LIVE' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></span>
                {eventStatus === 'LIVE' ? 'HEATS IN PROGRESS' : 'WAITING FOR SWELL'}
              </span>
              <h3 className="text-2xl font-black tracking-tight">Opening Round</h3>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black tracking-tighter">6-8<span className="text-xl font-medium opacity-70">ft</span></div>
              <div className="text-[10px] uppercase font-bold opacity-75 mt-1">Swell Height</div>
            </div>
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <span className="material-icons-round text-2xl">waves</span>
              </div>
              <div>
                <div className="text-base font-bold">Conditions</div>
                <div className="text-xs opacity-90">Clean • Light Offshore</div>
              </div>
            </div>
            <button className="px-6 py-3 bg-white text-primary-dark rounded-2xl text-sm font-bold shadow-md active:scale-95 hover:bg-gray-50 transition flex items-center gap-2">
              <span className="material-icons-round text-xl">play_arrow</span>
              Watch
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <section className="lg:col-span-1">
          <div className="flex justify-between items-end mb-6 px-1">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">My Team</h3>
            <span className="text-xs font-bold text-primary-mid uppercase tracking-tighter opacity-70">Live Tracker</span>
          </div>
          <div className="bg-white rounded-3xl p-2 apple-shadow border border-accent overflow-hidden">
            {displayTeam.map((surfer) => {
              const isEliminated = surfer.status === 'Eliminated';
              const isInWater = surfer.status === 'In Water Now';
              return (
                <div key={surfer.id} className={`flex items-center p-5 border-b border-gray-50 last:border-0 transition-all ${isInWater ? 'bg-primary/5' : 'hover:bg-gray-50/50'}`}>
                  <div className="relative">
                    <img src={surfer.image} alt={surfer.name} className={`h-16 w-16 rounded-2xl object-cover object-top ${isEliminated ? 'grayscale opacity-60' : ''} ${isInWater ? 'ring-2 ring-primary ring-offset-2' : ''}`} />
                    {!isEliminated && (
                      <div className="absolute -bottom-1.5 -right-1.5 bg-primary text-white text-[10px] font-black px-2 py-1 rounded-full border-4 border-white shadow-sm">{surfer.tier}</div>
                    )}
                  </div>
                  <div className={`ml-5 flex-1 ${isEliminated ? 'opacity-50' : ''}`}>
                    <h4 className="font-bold text-lg leading-tight">{surfer.name}</h4>
                    <p className={`text-[10px] font-black mt-1 uppercase tracking-widest ${isInWater ? 'text-primary animate-pulse' : 'text-gray-400'}`}>
                      {surfer.status === 'In Water Now' ? 'Scoring Heat...' : surfer.status}
                    </p>
                    {surfer.commentary && isInWater && (
                      <p className="text-xs text-primary-dark mt-1 italic font-medium animate-in fade-in slide-in-from-left-2 duration-500">"{surfer.commentary}"</p>
                    )}
                  </div>
                  <div className={`text-right ${isEliminated ? 'opacity-40' : ''}`}>
                    <div className={`font-black text-2xl tracking-tighter transition-all ${surfer.lastWaveScore ? 'text-primary scale-110' : 'text-primary-dark'}`}>
                      {surfer.points?.toFixed(2) || '0.00'}
                    </div>
                    {surfer.lastWaveScore && isInWater && (
                      <p className="text-[10px] font-black text-primary uppercase animate-bounce mt-1">+{surfer.lastWaveScore}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            disabled={eventStatus === 'LIVE'}
            onClick={onManageTeam}
            className={`w-full mt-6 py-5 rounded-3xl border-2 border-dashed font-black text-sm flex items-center justify-center gap-3 transition active:scale-95 ${eventStatus === 'LIVE'
              ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
              : 'border-primary/40 text-primary-dark hover:bg-white hover:border-primary/60'
              }`}
          >
            <span className="material-icons-round text-xl">{eventStatus === 'LIVE' ? 'lock' : 'swap_horiz'}</span>
            {eventStatus === 'LIVE' ? 'Roster Locked' : 'Manage My Team'}
          </button>
        </section>

        <section className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Heat Center</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_HEATS.map((heat) => (
              <div key={heat.id} className="bg-white p-8 rounded-[40px] apple-shadow border border-accent relative overflow-hidden group hover:border-primary/20 transition-all">
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <span className="bg-accent/40 px-3 py-1.5 rounded-full text-xs font-black text-primary-dark uppercase tracking-tight">Heat {heat.number}</span>
                  <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                    <span className="material-icons-round text-base">schedule</span>
                    {heat.time}
                  </span>
                </div>
                <div className="space-y-4 relative z-10">
                  {heat.surfers.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-10 rounded-full shadow-sm ${s.color === 'red' ? 'bg-red-500' : 'bg-blue-600'}`}></div>
                        <div className="flex flex-col">
                          <span className="font-black text-base text-gray-800 tracking-tight">{s.name}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.country}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
