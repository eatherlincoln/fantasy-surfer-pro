import React, { useState, useEffect } from 'react';
import { MOCK_SURFERS } from '../constants';
import { Surfer, EventStatus, Tier, UserProfile } from '../types';
import { generateBriefing } from '../services/aiService';

import { Event, Heat, getHeats } from '../services/adminService';
import { getUserGlobalRank, getUserLeagueRank, getUserLeagues } from '../services/leagueService';

const getInitials = (name: string) => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getAvatarUrl = (image: string | undefined, name: string) => {
  if (!image || image.includes('ui-avatars')) {
    return `https://ui-avatars.com/api/?name=${getInitials(name)}&background=random&color=fff&size=128`;
  }
  return `${image}${image.includes('?') ? '&' : '?'}v=1`;
};

interface DashboardProps {
  userTeam: Surfer[];
  eventStatus: EventStatus;
  onManageTeam: () => void;
  onSimulate: () => void;
  userProfile: UserProfile | null;
  activeEvent: Event | null;
}

const Dashboard: React.FC<DashboardProps> = ({ userTeam, eventStatus, onManageTeam, onSimulate, userProfile, activeEvent }) => {
  const [aiBriefing, setAiBriefing] = useState<string | null>(null);
  const [isBriefingLoading, setIsBriefingLoading] = useState(false);
  const [currentHeats, setCurrentHeats] = useState<Heat[]>([]);
  const [globalRank, setGlobalRank] = useState<number | null>(null);
  const [leagueRank, setLeagueRank] = useState<{ rank: number, totalMembers: number } | null>(null);
  const [leagueName, setLeagueName] = useState<string>("Friends League");

  const displayTeam = userTeam.length > 0 ? userTeam : MOCK_SURFERS.slice(0, 3);

  const totalPoints = userTeam.reduce((acc, s) => acc + (s.points || 0), 0);

  useEffect(() => {
    const fetchHeats = async () => {
      if (!activeEvent) return;
      try {
        const data = await getHeats(activeEvent.id);
        setCurrentHeats(data || []);
      } catch (e) {
        console.error('Failed to fetch heats:', e);
      }
    };
    fetchHeats();
  }, [activeEvent]);

  useEffect(() => {
    const fetchRanks = async () => {
      if (!userProfile) return;
      try {
        const gRank = await getUserGlobalRank(userProfile.id);
        setGlobalRank(gRank);

        const leagues = await getUserLeagues(userProfile.id);
        if (leagues && leagues.length > 0) {
          const lRank = await getUserLeagueRank(userProfile.id, leagues[0].id);
          setLeagueRank(lRank);
          setLeagueName(leagues[0].name);
        }
      } catch (e) {
        console.error('Failed to fetch ranks:', e);
      }
    };
    fetchRanks();
  }, [userProfile]);

  useEffect(() => {
    const fetchBriefing = async () => {
      if (userTeam.length === 0 || isBriefingLoading) return;
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
          src={activeEvent?.header_image || "/images/ripcurl-banner.jpg"}
          alt={activeEvent?.name || "Event Banner"}
          className="w-full h-auto object-cover min-h-[300px]"
          onError={(e) => {
            // Fallback if the user hasn't refreshed or cache issue
            e.currentTarget.src = '/images/ripcurl-banner.jpg';
          }}
        />
        {/* Overlay Controls */}
        <div className="absolute bottom-8 left-8 z-20">
          {/* Sim Wave button removed for production */}
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
        <div className="bg-white rounded-[32px] p-8 apple-shadow border border-gray-100 relative overflow-hidden flex flex-col justify-between h-[256px]">
          <div className="flex justify-between items-start w-full relative z-10">
            <span className={`px-4 py-1.5 mt-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${eventStatus === 'LIVE' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              {eventStatus === 'LIVE' ? 'Drafting' : 'Waiting'}
            </span>
            <div className="text-right flex flex-col items-end">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1 mr-1">Total Points</div>
              <div className="text-[56px] font-black text-primary-dark tracking-[-0.05em] leading-[0.85]">{totalPoints.toFixed(2)}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-widest mr-1">Ranked #{globalRank || '---'} Global</div>
            </div>
          </div>

          <div className="mt-auto pb-1 pl-1 relative z-10">
            <div className="flex items-baseline gap-1 tracking-tighter">
              <span className="text-[64px] lg:text-[80px] font-black text-gray-900 leading-[0.85] tracking-tight">{leagueRank ? `${leagueRank.rank}${['st', 'nd', 'rd'][(leagueRank.rank % 10) - 1] || 'th'}` : '---'}</span>
              <span className="text-[24px] lg:text-[28px] font-bold text-gray-300 leading-none ml-[2px] pb-2 lg:pb-3">/ {leagueRank?.totalMembers || '---'}</span>
            </div>
            <div className="text-[11px] font-bold text-primary-dark uppercase tracking-[0.2em] mt-2">{leagueName}</div>
          </div>
        </div>

        {/* Conditions/Watching Card (Teal) */}
        <div className="bg-[#237c6a] rounded-[30px] p-6 text-white relative flex flex-col justify-between h-[256px]">
          <div className="flex justify-between items-start w-full relative z-10 pt-2 lg:pt-0">
            <span className="px-3.5 py-1.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-widest text-white mt-2 lg:mt-0 shadow-sm backdrop-blur-sm">
              {activeEvent?.swell_status || (eventStatus === 'LIVE' ? 'Live Conditions' : 'Waiting for Swell')}
            </span>

            <div className="text-right absolute top-0 lg:-top-3 right-0 lg:right-2 flex flex-col items-end">
              <div className="flex items-baseline tracking-tighter text-white">
                <span className="text-[72px] lg:text-[104px] font-black leading-[0.85] tracking-tight">{activeEvent?.swell_height?.replace(/ft/i, '') || '6-8'}</span>
                <span className="text-[20px] lg:text-[28px] font-bold leading-none ml-[2px] opacity-80 pb-2 lg:pb-3">ft</span>
              </div>
              <div className="text-[9px] lg:text-[10px] font-bold opacity-70 uppercase tracking-[0.2em] -mt-1 lg:-mt-1 mr-2">Swell Height</div>
            </div>
          </div>

          <div className="flex items-end justify-between relative z-10 w-full mt-auto pb-1 pl-1">
            <div className="pr-4 lg:pr-12">
              <h3 className="text-2xl font-bold tracking-tight mb-1.5">Conditions</h3>
              <p className="text-[13px] text-white/90 leading-[1.65] max-w-[280px] font-medium whitespace-pre-wrap">
                {activeEvent?.conditions || 'Clean • Light Offshore'}
              </p>
            </div>

            <a href="https://www.worldsurfleague.com/" target="_blank" rel="noopener noreferrer" className="bg-white text-[#237c6a] pl-5 pr-6 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase hover:bg-emerald-50 transition shadow-sm flex items-center gap-2 mb-1 shrink-0">
              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              Watch
            </a>
          </div>
        </div>
      </div>

      {/* Team Section - Split into Men and Women columns */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-6 px-1">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{userProfile?.team_name || "My Team"}</h3>
          <span className="text-xs font-bold text-primary-mid uppercase tracking-tighter opacity-70 cursor-pointer hover:text-primary transition-colors">Live Tracker</span>
        </div>

        {/* Mobile View: Single Card (All 10 Surfers) */}
        <div className="md:hidden mb-6">
          {(() => {
            const sortedTeam = [...displayTeam]
              .sort((a, b) => (b.value || 0) - (a.value || 0))
              .slice(0, 10);

            return (
              <div className="bg-white rounded-[32px] p-2 apple-shadow border border-accent overflow-hidden flex flex-col h-full">
                {sortedTeam.length > 0 ? (
                  sortedTeam.map((surfer) => (
                    <SurferRow key={surfer.id} surfer={surfer} />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm font-medium italic">Empty Slot</div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Desktop View: Split Columns (5 Left / 5 Right) */}
        <div className="hidden md:grid grid-cols-2 gap-6 mb-6">
          {(() => {
            // Sort by Value (High to Low) and limit to Top 10
            const sortedTeam = [...displayTeam]
              .sort((a, b) => (b.value || 0) - (a.value || 0))
              .slice(0, 10);

            // Split exactly at 5 for a 5/5 layout
            const midPoint = 5;
            const col1 = sortedTeam.slice(0, midPoint);
            const col2 = sortedTeam.slice(midPoint);

            const renderSurferList = (surfers: Surfer[]) => (
              <div className="bg-white rounded-[32px] p-2 apple-shadow border border-accent overflow-hidden flex flex-col h-full">
                {surfers.length > 0 ? (
                  surfers.map((surfer) => (
                    <SurferRow key={surfer.id} surfer={surfer} />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-400 text-sm font-medium italic">Empty Slot</div>
                )}
              </div>
            );

            return (
              <>
                {renderSurferList(col1)}
                {renderSurferList(col2)}
              </>
            );
          })()}
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
          {(() => {
            if (currentHeats.length === 0) {
              return (
                <div className="col-span-full py-10 text-center text-gray-500 font-medium bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  No heats available for this event yet.
                </div>
              );
            }

            // Find the lowest round number that has incomplete heats
            const incompleteHeats = currentHeats.filter((h: any) => h.status !== 'COMPLETED');
            const activeRoundNum = incompleteHeats.length > 0
              ? Math.min(...incompleteHeats.map((h: any) => h.round_number || 1))
              : Math.max(...currentHeats.map((h: any) => h.round_number || 1));

            const heatsToDisplay = currentHeats.filter((h: any) => (h.round_number || 1) === activeRoundNum);

            return heatsToDisplay.map((heat: any) => (
              <div key={heat.id} className="bg-white p-8 rounded-[40px] apple-shadow border border-accent relative overflow-hidden group hover:border-primary/20 transition-all">
                <div className="flex justify-between items-center mb-8 relative z-10">
                  <span className="bg-accent/40 px-3 py-1.5 rounded-full text-xs font-black text-primary-dark uppercase tracking-tight">Round {activeRoundNum} • Heat {heat.heat_number}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${heat.status === 'LIVE' ? 'bg-red-100 text-red-600 animate-pulse' : heat.status === 'COMPLETED' ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                    {heat.status}
                  </span>
                </div>
                <div className="space-y-4 relative z-10">
                  {heat.heat_assignments?.map((assignment: any) => {
                    const s = assignment.surfers;
                    if (!s) return null;
                    return (
                      <div key={s.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img src={getAvatarUrl(s.image, s.name)} alt={s.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 shadow-sm" onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${getInitials(s.name)}&background=random&color=fff&size=128`; }} />
                          <div className="flex flex-col">
                            <span className="font-black text-base text-gray-800 tracking-tight">{s.name}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                              {s.flag} {s.country}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-lg text-gray-900 tracking-tighter">
                            {assignment.heat_score?.toFixed(2) || '0.00'}
                          </div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Pts</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ));
          })()}
        </div>
      </section>
    </div>
  );
};

// Sub-component for rendering a single surfer row (to avoid code duplication)
const SurferRow: React.FC<{ surfer: Surfer }> = ({ surfer }) => {
  const isEliminated = surfer.status === 'Eliminated';
  const isInWater = surfer.status === 'In Water Now';

  const getTierBadgeColor = (tier: Tier) => {
    switch (tier) {
      case Tier.A: return 'bg-yellow-400 text-yellow-950'; // Gold/Yellow
      case Tier.B: return 'bg-teal-600 text-white';       // Green/Teal
      case Tier.C: return 'bg-gray-400 text-white';        // Grey
      default: return 'bg-gray-200 text-gray-500';
    }
  };

  return (
    <div className={`flex items-center p-5 border-b border-gray-50 last:border-0 transition-all ${isInWater ? 'bg-primary/5' : 'hover:bg-gray-50/50'}`}>
      <div className="relative">
        <img src={getAvatarUrl(surfer.image, surfer.name)} alt={surfer.name} className={`h-16 w-16 rounded-2xl object-cover object-top ${isEliminated ? 'grayscale opacity-60' : ''} ${isInWater ? 'ring-2 ring-primary ring-offset-2' : ''}`} onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${getInitials(surfer.name)}&background=random&color=fff&size=128`; }} />
        {!isEliminated && (
          <div className={`absolute -bottom-1.5 -right-1.5 ${getTierBadgeColor(surfer.tier)} text-[10px] font-black px-2 py-1 rounded-full border-4 border-white shadow-sm`}>{surfer.tier}</div>
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
