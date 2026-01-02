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
      {/* Custom Replaceable Banner Area */}
      <div className="w-full rounded-[40px] overflow-hidden shadow-2xl mb-10 relative group">
        <img
          src="/images/banners/pipeline_banner.jpg"
          alt="Event Banner"
          className="w-full h-auto object-cover min-h-[300px]"
          onError={(e) => {
            // Fallback if the user hasn't refreshed or cache issue
            e.currentTarget.src = '/pipe-banner-2026.png';
          }}
        />
        {/* Overlay Controls */}
        <div className="absolute bottom-8 left-8 z-20">
          <button onClick={onSimulate} className="h-12 px-8 rounded-full bg-white text-primary-dark font-black uppercase tracking-widest shadow-lg hover:bg-gray-50 active:scale-95 transition flex items-center gap-2">
            <span className="material-icons-round">bolt</span>
            Sim Wave
          </button>
        </div>
      </div>

      {/* AI Daily Briefing */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-icons-round text-primary text-xs">auto_awesome</span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Morning Briefing</span>
        </div>
        {isBriefingLoading ? (
          <div className="h-6 w-full bg-gray-100 animate-pulse rounded-full"></div>
        ) : (
          <p className="text-xl md:text-2xl font-serif italic text-gray-800 leading-snug">
            "{aiBriefing || "Swell's looking good. Your roster is ready for the incoming set."}"
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {/* Event Status Card */}
        <div className="bg-white rounded-[32px] p-8 apple-shadow border border-gray-100 relative overflow-hidden flex flex-col justify-between h-[220px]">
          <div className="flex justify-between items-start">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${eventStatus === 'LIVE' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              {eventStatus === 'LIVE' ? 'Drafting' : 'Waiting'}
            </span>
            <div className="text-right">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">Total Points</div>
              <div className="text-3xl font-black text-primary-dark tracking-tight">{totalPoints.toFixed(2)}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">Ranked #132 Global</div>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black text-gray-900 tracking-tighter">1st</span>
              <span className="text-xl font-bold text-gray-300">/ 12</span>
            </div>
            <div className="text-xs font-bold text-primary-dark uppercase tracking-widest mt-1">Friends League</div>
          </div>
        </div>

        {/* Conditions/Watching Card (Teal) */}
        <div className="bg-[#14746f] rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-[220px]">
          {/* Background Texture/Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>

          <div className="flex justify-between items-start relative z-10">
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur text-[10px] font-bold uppercase tracking-wide">
              {eventStatus === 'LIVE' ? 'Live Conditions' : 'Waiting for Swell'}
            </span>
            <div className="text-right">
              <div className="text-6xl font-black tracking-tighter leading-none">6-8<span className="text-2xl font-bold opacity-60">ft</span></div>
              <div className="text-[10px] font-bold opacity-60 uppercase tracking-widest mt-1">Swell Height</div>
            </div>
          </div>

          <div className="flex items-end justify-between relative z-10">
            <div>
              <h3 className="text-xl font-bold">Conditions</h3>
              <p className="text-xs font-medium opacity-80 mt-1">Clean • Light Offshore</p>
            </div>
            <button className="px-6 py-2 bg-white text-[#14746f] rounded-full text-xs font-black uppercase tracking-widest shadow hover:bg-gray-50 active:scale-95 transition flex items-center gap-2">
              <span className="material-icons-round text-base">play_arrow</span>
              Watch
            </button>
          </div>
        </div>
      </div>

      {/* Team Section - Split into Men and Women columns */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-6 px-1">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">My Team</h3>
          <span className="text-xs font-bold text-primary-mid uppercase tracking-tighter opacity-70 cursor-pointer hover:text-primary transition-colors">Live Tracker</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Men's Roster */}
          <div className="bg-white rounded-[32px] p-2 apple-shadow border border-accent overflow-hidden flex flex-col h-full">
            {displayTeam.filter(s => s.gender === 'Male').length > 0 ? (
              displayTeam.filter(s => s.gender === 'Male').map((surfer) => (
                <SurferRow key={surfer.id} surfer={surfer} />
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm font-medium italic">No Men Selected</div>
            )}
          </div>

          {/* Women's Roster */}
          <div className="bg-white rounded-[32px] p-2 apple-shadow border border-accent overflow-hidden flex flex-col h-full">
            {displayTeam.filter(s => s.gender === 'Female').length > 0 ? (
              displayTeam.filter(s => s.gender === 'Female').map((surfer) => (
                <SurferRow key={surfer.id} surfer={surfer} />
              ))
            ) : (
              <div className="p-8 text-center text-gray-400 text-sm font-medium italic">No Women Selected</div>
            )}
          </div>
        </div>

        <button
          disabled={eventStatus === 'LIVE'}
          onClick={onManageTeam}
          className={`w-full py-5 rounded-[32px] border-2 border-dashed font-black text-sm flex items-center justify-center gap-3 transition active:scale-95 ${eventStatus === 'LIVE'
            ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
            : 'border-primary/40 text-primary-dark hover:bg-white hover:border-primary/60'
            }`}
        >
          <span className="material-icons-round text-xl">{eventStatus === 'LIVE' ? 'lock' : 'swap_horiz'}</span>
          {eventStatus === 'LIVE' ? 'Roster Locked' : 'Manage My Team'}
        </button>
      </section>

      {/* Heat Center Section */}
      <section>
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
  );
};

// Sub-component for rendering a single surfer row (to avoid code duplication)
const SurferRow: React.FC<{ surfer: Surfer }> = ({ surfer }) => {
  const isEliminated = surfer.status === 'Eliminated';
  const isInWater = surfer.status === 'In Water Now';

  return (
    <div className={`flex items-center p-5 border-b border-gray-50 last:border-0 transition-all ${isInWater ? 'bg-primary/5' : 'hover:bg-gray-50/50'}`}>
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
};

export default Dashboard;
