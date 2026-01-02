
import React, { useState, useMemo, useEffect } from 'react';
import { Surfer, Tier } from '../types';
import { TOTAL_BUDGET, TIER_LIMITS } from '../constants';
import { FULL_MOCK_SURFERS } from '../fullMockData';
import { supabase } from '../services/supabase';
import { GoogleGenAI } from "@google/genai";

interface TeamBuilderProps {
  initialTeam: Surfer[]; // Legacy prop - likely empty or mix
  isLocked: boolean;
  onSave: (team: Surfer[]) => void;
}

const TIER_LIMITS_MEN = {
  [Tier.A]: 2,
  [Tier.B]: 4,
  [Tier.C]: 2,
};

const TIER_LIMITS_WOMEN = {
  [Tier.A]: 1,
  [Tier.B]: 2,
  [Tier.C]: 1,
};

const TeamBuilder: React.FC<TeamBuilderProps> = ({ initialTeam, isLocked, onSave }) => {
  // Split initial team if it exists (legacy support)
  const initialMen = initialTeam.filter(s => s.gender === 'Male');
  const initialWomen = initialTeam.filter(s => s.gender === 'Female');

  const [teamMen, setTeamMen] = useState<Surfer[]>(initialMen);
  const [teamWomen, setTeamWomen] = useState<Surfer[]>(initialWomen);

  const [activeTab, setActiveTab] = useState<'Male' | 'Female'>('Male');
  const [allSurfers, setAllSurfers] = useState<Surfer[]>(FULL_MOCK_SURFERS);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);

  const [expandedTiers, setExpandedTiers] = useState<Record<Tier, boolean>>({
    [Tier.A]: false,
    [Tier.B]: false,
    [Tier.C]: false,
  });

  useEffect(() => {
    const fetchSurfers = async () => {
      try {
        const { data, error } = await supabase.from('surfers').select('*');

        // Always use FULL_MOCK_SURFERS as the canonical list to ensure no one is missing
        // Merge DB data (status, points, etc.) into the mock data
        const mergedData = FULL_MOCK_SURFERS.map(mockSurfer => {
          const dbSurfer = data?.find((s: any) => s.id === mockSurfer.id || s.name === mockSurfer.name);

          let validImage = mockSurfer.image;

          // Image Selection Logic:
          // 1. **HIGHEST PRIORITY**: Local Assets (we manually downloaded these to public/images/surfers/)
          //    If the mock data has a local path (starts with '/'), USE IT. It is guaranteed to be fast and working.
          if (mockSurfer.image && mockSurfer.image.startsWith('/')) {
            validImage = mockSurfer.image;
          }
          // 2. If DB has a "real" image (user uploaded or valid URL) and we don't have a local one, use DB.
          else if (dbSurfer?.image && !dbSurfer.image.includes('ui-avatars')) {
            validImage = dbSurfer.image;
          }
          // 3. Fallback to whatever mock has (likely avatar) or standard DB fallback
          else {
            validImage = dbSurfer?.image || mockSurfer.image;
          }

          return {
            ...mockSurfer,
            ...dbSurfer, // Overwrite with live data (points, status)
            // Ensure essential fields are preserved from Mock if missing in DB
            id: mockSurfer.id,
            name: mockSurfer.name,
            country: mockSurfer.country,
            tier: mockSurfer.tier,
            gender: mockSurfer.gender,
            image: validImage
          };
        });

        setAllSurfers(mergedData as Surfer[]);

      } catch (err) {
        console.error("Supabase fetch failed, keeping Mocks", err);
        setAllSurfers(FULL_MOCK_SURFERS);
      }
    };
    fetchSurfers();
  }, []);

  const totalSpent = useMemo(() => {
    const menCost = teamMen.reduce((acc, s) => acc + s.value, 0);
    const womenCost = teamWomen.reduce((acc, s) => acc + s.value, 0);
    return menCost + womenCost;
  }, [teamMen, teamWomen]);

  const currentTeam = activeTab === 'Male' ? teamMen : teamWomen;
  const currentLimits = activeTab === 'Male' ? TIER_LIMITS_MEN : TIER_LIMITS_WOMEN;
  const requiredCount = activeTab === 'Male' ? 8 : 4;

  const counts = useMemo(() => ({
    [Tier.A]: currentTeam.filter(s => s.tier === Tier.A).length,
    [Tier.B]: currentTeam.filter(s => s.tier === Tier.B).length,
    [Tier.C]: currentTeam.filter(s => s.tier === Tier.C).length,
  }), [currentTeam]);

  // Global validation state
  const isMenComplete =
    teamMen.filter(s => s.tier === Tier.A).length === TIER_LIMITS_MEN[Tier.A] &&
    teamMen.filter(s => s.tier === Tier.B).length === TIER_LIMITS_MEN[Tier.B] &&
    teamMen.filter(s => s.tier === Tier.C).length === TIER_LIMITS_MEN[Tier.C];

  const isWomenComplete =
    teamWomen.filter(s => s.tier === Tier.A).length === TIER_LIMITS_WOMEN[Tier.A] &&
    teamWomen.filter(s => s.tier === Tier.B).length === TIER_LIMITS_WOMEN[Tier.B] &&
    teamWomen.filter(s => s.tier === Tier.C).length === TIER_LIMITS_WOMEN[Tier.C];

  const isGlobalComplete = isMenComplete && isWomenComplete;

  const fetchAiAdvice = async () => {
    if (!process.env.API_KEY) return; // Guard
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are an expert World Surf League fantasy analyst. 
      Current Event: Pipeline Pro, Hawaii. 
      Looking at the ${activeTab} division.
      Available Tier A Surfers: ${allSurfers.filter(s => s.tier === Tier.A && s.gender === activeTab).map(s => s.name).join(', ')}.
      Suggest a strategy for selecting a team for Pipeline with a budget constraint.
      Keep the response concise (max 3 sentences) and highly strategic.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: prompt,
      });
      setAiAdvice(response.text);
    } catch (error) {
      setAiAdvice("Scouting report unavailable. Trust your instincts, champ.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleSurfer = (surfer: Surfer) => {
    if (isLocked) return;

    // Determine which roster to update based on surfer gender (safety check)
    // or use activeTab if we trust the UI context
    const isMale = surfer.gender === 'Male';
    const targetTeam = isMale ? teamMen : teamWomen;
    const setTargetTeam = isMale ? setTeamMen : setTeamWomen;
    const limits = isMale ? TIER_LIMITS_MEN : TIER_LIMITS_WOMEN;

    const isSelected = targetTeam.find(s => s.id === surfer.id);

    if (isSelected) {
      setTargetTeam(targetTeam.filter(s => s.id !== surfer.id));
    } else {
      // Check limits
      const currentTierCount = targetTeam.filter(s => s.tier === surfer.tier).length;
      if (currentTierCount >= limits[surfer.tier]) return;

      // Check global budget
      if (totalSpent + surfer.value > TOTAL_BUDGET) return;

      setTargetTeam([...targetTeam, surfer]);
    }
  };

  const toggleTierExpand = (tier: Tier) => {
    setExpandedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  const getTierColor = (tier: Tier) => {
    switch (tier) {
      case Tier.A: return 'border-pop'; // Yellow/Gold highlight
      case Tier.B: return 'border-primary-dark';
      case Tier.C: return 'border-gray-300';
      default: return 'border-gray-200';
    }
  };

  const renderSurferCard = (surfer: Surfer, inGrid: boolean = false) => {
    const isSelected = currentTeam.some(s => s.id === surfer.id);
    const isFull = !isSelected && counts[surfer.tier] >= currentLimits[surfer.tier];
    const isEliminated = surfer.status === 'Eliminated';
    const tierColor = getTierColor(surfer.tier);

    return (
      <button
        key={surfer.id}
        onClick={() => toggleSurfer(surfer)}
        disabled={(isFull || isEliminated || isLocked) && !isSelected}
        className={`${inGrid ? 'w-full h-full' : 'min-w-[155px] md:min-w-[190px] flex-shrink-0'} bg-white rounded-[40px] p-6 text-center border-2 transition-all duration-300 active:scale-95 snap-start flex flex-col ${isSelected ? `${tierColor} scale-105 z-10 ring-4 ring-offset-2 ring-pop/20` : 'border-transparent apple-shadow hover:border-gray-100'} ${isFull || isEliminated || isLocked ? 'opacity-40 grayscale pointer-events-none shadow-none' : ''}`}
      >
        <div className="relative mb-5">
          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto bg-gray-50 overflow-hidden border-2 ${isSelected ? tierColor : 'border-background'} shadow-sm`}>
            {/* Added fallback for broken images if any */}
            <img
              src={surfer.image.startsWith('http') ? `${surfer.image}${surfer.image.includes('?') ? '&' : '?'}v=1` : surfer.image}
              alt={surfer.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                // Fallback to initial if image fails
                console.warn(`Failed to load image for ${surfer.name}: ${surfer.image}`);
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${surfer.name}&background=random`;
              }}
            />
          </div>
          {isSelected && (
            <div className={`absolute top-0 right-1 md:right-4 w-8 h-8 ${tierColor.replace('border-', 'bg-')} rounded-full flex items-center justify-center text-white border-4 border-white shadow-md animate-in zoom-in`}>
              <span className="material-icons-round text-lg font-black">check</span>
            </div>
          )}
        </div>
        <p className="font-black text-sm md:text-lg mb-1 truncate leading-tight tracking-tight text-gray-900">{surfer.name}</p>
        <div className="flex items-center justify-center gap-2 mb-5">
          <span className="text-xs">{surfer.flag}</span>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{surfer.country}</p>
        </div>
        <div className={`rounded-full py-2.5 px-4 transition-colors ${isSelected ? tierColor.replace('border-', 'bg-').replace('-400', '-500') + ' text-white' : 'bg-background text-primary-dark'}`}>
          <span className="text-xs md:text-sm font-black tracking-tight">${surfer.value.toFixed(1)}M</span>
        </div>
      </button>
    );
  };

  const renderTier = (tier: Tier, label: string) => {
    // Filter by active Gender
    const surfers = allSurfers
      .filter(s => s.tier === tier && s.gender === activeTab)
      .sort((a, b) => {
        const aSelected = currentTeam.some(s => s.id === a.id);
        const bSelected = currentTeam.some(s => s.id === b.id);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return 0;
      });

    const isExpanded = expandedTiers[tier];

    return (
      <div key={tier} className="mb-20 last:mb-0">
        <div className="flex justify-between items-center mb-8 px-1">
          <div className="flex items-center gap-5">
            <div className={`w-2 h-10 md:h-14 rounded-full ${getTierColor(tier).replace('border-', 'bg-')}`}></div>
            <div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900">Tier {tier}</h3>
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleTierExpand(tier)}
              className="text-xs font-black text-primary-dark underline uppercase px-3 py-2 hover:bg-white rounded-xl transition"
            >
              {isExpanded ? 'Collapse' : `View All (${surfers.length})`}
            </button>
            <span className={`px-5 py-2.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-tight ${counts[tier] === currentLimits[tier] ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-accent text-gray-500'}`}>
              {counts[tier]} / {currentLimits[tier]} Selected
            </span>
          </div>
        </div>

        {isExpanded ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 p-4 animate-in fade-in zoom-in-95 duration-300">
            {surfers.map(surfer => renderSurferCard(surfer, true))}
          </div>
        ) : (
          <div className="relative overflow-visible">
            {/* Added px-4 to prevent first card clipping and updated scroll-pl */}
            <div className="flex gap-8 overflow-x-auto hide-scrollbar snap-x snap-mandatory flex-nowrap touch-pan-x py-4 px-4 scroll-pl-4">
              {surfers.map((surfer) => renderSurferCard(surfer, false))}
              <div className="min-w-[40px] h-full flex-shrink-0 invisible"></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const RosterSlot = ({ surfer, tier }: { surfer?: Surfer; tier: Tier }) => {
    const tierColor = getTierColor(tier);
    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${surfer ? `bg-white ${tierColor} shadow-lg scale-105` : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
            {surfer ? (
              <div className="w-full h-full rounded-full overflow-hidden shadow-inner border border-gray-50 group relative">
                <img src={surfer.image} className="w-full h-full object-cover object-top" alt={surfer.name} />
                {!isLocked && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md active:scale-90 text-red-500"
                      onClick={(e) => { e.stopPropagation(); toggleSurfer(surfer); }}
                    >
                      <span className="material-icons-round text-lg">close</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <span className="text-lg md:text-xl text-gray-200 font-black uppercase tracking-tighter opacity-50">{tier}</span>
            )}
          </div>
        </div>

        {/* Name underneath the circle */}
        <div className="mt-4 text-center min-h-[40px] flex flex-col items-center">
          {surfer ? (
            <>
              <p className="text-[11px] md:text-sm font-black text-gray-900 truncate max-w-[80px] md:max-w-[100px] tracking-tight">
                {surfer.name.split(' ').pop()}
              </p>
              <div className="flex items-center gap-1 mt-1 opacity-70">
                <span className="text-[10px] md:text-[11px]">{surfer.flag}</span>
                <span className="text-[8px] md:text-[9px] font-bold text-gray-500 uppercase tracking-widest">{surfer.stance[0]}</span>
              </div>
            </>
          ) : (
            <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Empty</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="pb-44 animate-in slide-in-from-bottom duration-700">
      <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">Draft Team</h2>
          <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-3">Pipeline Pro • Season 2026</p>
        </div>

        {/* Gender Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          {(['Male', 'Female'] as const).map(gender => (
            <button
              key={gender}
              onClick={() => setActiveTab(gender)}
              className={`px-8 py-3 rounded-xl text-sm font-black uppercase tracking-wide transition-all ${activeTab === gender
                ? 'bg-white text-primary-dark shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {gender === 'Male' ? "Men's" : "Women's"}
            </button>
          ))}
        </div>

        <button onClick={() => onSave([...teamMen, ...teamWomen])} className="text-sm md:text-base font-black text-primary-dark underline p-4 hover:opacity-70 transition decoration-2 underline-offset-4">Cancel Draft</button>
      </header>

      {/* AI Advice Banner */}
      {aiAdvice && (
        <div className="mb-14 bg-primary/10 border-2 border-primary/20 rounded-[48px] p-10 relative overflow-hidden animate-in fade-in slide-in-from-top duration-500 shadow-sm">
          <div className="absolute top-0 right-0 p-6">
            <button onClick={() => setAiAdvice(null)} className="text-primary-dark opacity-40 hover:opacity-100 transition">
              <span className="material-icons-round">close</span>
            </button>
          </div>
          <div className="flex items-start gap-8">
            <div className="w-16 h-16 rounded-[24px] bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="material-icons-round text-3xl">smart_toy</span>
            </div>
            <div>
              <h4 className="font-black text-sm text-primary-dark uppercase tracking-widest mb-3">Gemini Scouting Report</h4>
              <p className="text-xl font-medium text-gray-700 leading-relaxed italic">"{aiAdvice}"</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <div className="space-y-24">
            {renderTier(Tier.A, "Top Seed Powerhouses")}
            {renderTier(Tier.B, "The Competitive Core")}
            {renderTier(Tier.C, "Value Picks & Underdogs")}
          </div>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-24 order-1 lg:order-2 z-40">
          {/* Main Summary Panel */}
          <div className="bg-white rounded-[64px] p-10 md:p-14 apple-shadow border border-white/80 backdrop-blur-sm">

            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900">{activeTab} Roster</h3>
              {!aiAdvice && (
                <button onClick={fetchAiAdvice} disabled={isAiLoading || isLocked} className="text-xs font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                  {isAiLoading ? "Analyzing..." : "Ask AI"} <span className="material-icons-round text-sm">auto_awesome</span>
                </button>
              )}
            </div>

            <div className="flex justify-between items-center mb-14 px-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">Total Budget</span>
                <span className={`text-5xl md:text-6xl font-black tracking-tighter ${totalSpent > TOTAL_BUDGET ? 'text-red-500' : 'text-primary'}`}>
                  ${(TOTAL_BUDGET - totalSpent).toFixed(1)}<span className="text-2xl font-bold ml-1">M</span>
                </span>
                <span className="text-xs text-gray-400 font-bold mt-1">Remaining / $70.0M Cap</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">Draft</span>
                <p className="text-5xl md:text-6xl font-black tracking-tighter">
                  {currentTeam.length}<span className="text-2xl text-gray-200 font-bold ml-1">/{requiredCount}</span>
                </p>
              </div>
            </div>

            {/* Dynamic Grid based on Gender */}
            {activeTab === 'Male' ? (
              <div className="grid grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
                <RosterSlot surfer={teamMen.filter(s => s.tier === Tier.A)[0]} tier={Tier.A} />
                <RosterSlot surfer={teamMen.filter(s => s.tier === Tier.A)[1]} tier={Tier.A} />
                <RosterSlot surfer={teamMen.filter(s => s.tier === Tier.C)[0]} tier={Tier.C} />
                <RosterSlot surfer={teamMen.filter(s => s.tier === Tier.C)[1]} tier={Tier.C} />
                {[0, 1, 2, 3].map(i => (
                  <RosterSlot key={`b-slot-${i}`} surfer={teamMen.filter(s => s.tier === Tier.B)[i]} tier={Tier.B} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4 md:gap-8">
                <RosterSlot surfer={teamWomen.filter(s => s.tier === Tier.A)[0]} tier={Tier.A} />
                <RosterSlot surfer={teamWomen.filter(s => s.tier === Tier.C)[0]} tier={Tier.C} />
                <RosterSlot surfer={teamWomen.filter(s => s.tier === Tier.B)[0]} tier={Tier.B} />
                <RosterSlot surfer={teamWomen.filter(s => s.tier === Tier.B)[1]} tier={Tier.B} />
              </div>
            )}

            {/* Global Status Indicator if other team is incomplete */}
            <div className="mt-8 flex gap-2 justify-center">
              <div className={`h-2 flex-1 rounded-full ${isMenComplete ? 'bg-green-400' : 'bg-gray-100'} transition-colors duration-500`} title="Men's Team Complete" />
              <div className={`h-2 flex-1 rounded-full ${isWomenComplete ? 'bg-green-400' : 'bg-gray-100'} transition-colors duration-500`} title="Women's Team Complete" />
            </div>

            <button
              disabled={!isGlobalComplete || isLocked}
              onClick={() => onSave([...teamMen, ...teamWomen])}
              className={`w-full mt-8 py-6 rounded-[40px] font-black text-xl apple-shadow transform transition-all active:scale-95 ${isGlobalComplete && !isLocked
                ? 'bg-primary-dark text-white hover:bg-primary-dark/90 hover:-translate-y-1 shadow-2xl shadow-primary/30'
                : 'bg-accent/40 text-gray-400 cursor-not-allowed shadow-none'
                }`}
            >
              {isLocked ? 'Roster Locked (Live)' : isGlobalComplete ? 'Lock In Full Roster' : `Complete Both Teams`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;
