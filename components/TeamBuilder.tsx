
import React, { useState, useMemo } from 'react';
import { Surfer, Tier } from '../types';
import { MOCK_SURFERS, TOTAL_BUDGET, TIER_LIMITS } from '../constants';
import { GoogleGenAI } from "@google/genai";

interface TeamBuilderProps {
  initialTeam: Surfer[];
  isLocked: boolean;
  onSave: (team: Surfer[]) => void;
}

const TeamBuilder: React.FC<TeamBuilderProps> = ({ initialTeam, isLocked, onSave }) => {
  const [selectedSurfers, setSelectedSurfers] = useState<Surfer[]>(initialTeam);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [expandedTiers, setExpandedTiers] = useState<Record<Tier, boolean>>({
    [Tier.A]: false,
    [Tier.B]: false,
    [Tier.C]: false,
  });
  
  const totalSpent = useMemo(() => 
    selectedSurfers.reduce((acc, s) => acc + s.value, 0)
  , [selectedSurfers]);

  const counts = useMemo(() => ({
    [Tier.A]: selectedSurfers.filter(s => s.tier === Tier.A).length,
    [Tier.B]: selectedSurfers.filter(s => s.tier === Tier.B).length,
    [Tier.C]: selectedSurfers.filter(s => s.tier === Tier.C).length,
  }), [selectedSurfers]);

  const fetchAiAdvice = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are an expert World Surf League fantasy analyst. 
      Current Event: Pipeline Pro, Hawaii. 
      Conditions: 8-10ft, clean west swell. 
      Available Tier A Surfers: ${MOCK_SURFERS.filter(s => s.tier === Tier.A).map(s => s.name).join(', ')}.
      Suggest 2 surfers from Tier A and 1 from Tier C that are "must-haves" for these specific conditions.
      Keep the response concise (max 3 sentences) and highly strategic.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
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
    const isSelected = selectedSurfers.find(s => s.id === surfer.id);
    if (isSelected) {
      setSelectedSurfers(selectedSurfers.filter(s => s.id !== surfer.id));
    } else {
      if (counts[surfer.tier] >= TIER_LIMITS[surfer.tier]) return;
      if (totalSpent + surfer.value > TOTAL_BUDGET) return;
      setSelectedSurfers([...selectedSurfers, surfer]);
    }
  };

  const toggleTierExpand = (tier: Tier) => {
    setExpandedTiers(prev => ({ ...prev, [tier]: !prev[tier] }));
  };

  const isComplete = counts[Tier.A] === 2 && counts[Tier.B] === 4 && counts[Tier.C] === 2;

  const getTierColor = (tier: Tier) => {
    switch (tier) {
      case Tier.A: return 'border-amber-400';
      case Tier.B: return 'border-primary-dark';
      case Tier.C: return 'border-slate-300';
      default: return 'border-gray-200';
    }
  };

  const renderSurferCard = (surfer: Surfer, inGrid: boolean = false) => {
    const isSelected = selectedSurfers.some(s => s.id === surfer.id);
    const isFull = !isSelected && counts[surfer.tier] >= TIER_LIMITS[surfer.tier];
    const isEliminated = surfer.status === 'Eliminated';
    const tierColor = getTierColor(surfer.tier);

    return (
      <button
        key={surfer.id}
        onClick={() => toggleSurfer(surfer)}
        disabled={isFull || isEliminated || isLocked}
        className={`${inGrid ? 'w-full' : 'min-w-[155px] md:min-w-[190px] flex-shrink-0'} bg-white rounded-[40px] p-6 text-center border-2 transition-all transform active:scale-95 snap-start ${isSelected ? `${tierColor} shadow-xl scale-105 z-10` : 'border-transparent apple-shadow'} ${isFull || isEliminated || isLocked ? 'opacity-40 grayscale pointer-events-none shadow-none' : ''} hover:border-gray-100`}
      >
        <div className="relative mb-5">
          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto bg-gray-50 overflow-hidden border-2 ${isSelected ? tierColor : 'border-background'} shadow-sm`}>
            <img src={surfer.image} alt={surfer.name} className="w-full h-full object-cover object-top" />
          </div>
          {isSelected && (
            <div className={`absolute top-0 right-1 md:right-4 w-8 h-8 ${tierColor.replace('border-', 'bg-')} rounded-full flex items-center justify-center text-white border-4 border-white shadow-md`}>
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
    const surfers = MOCK_SURFERS.filter(s => s.tier === tier).sort((a, b) => {
      const aSelected = selectedSurfers.some(s => s.id === a.id);
      const bSelected = selectedSurfers.some(s => s.id === b.id);
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
            <span className={`px-5 py-2.5 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-tight ${counts[tier] === TIER_LIMITS[tier] ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-accent text-gray-500'}`}>
              {counts[tier]} / {TIER_LIMITS[tier]} Selected
            </span>
          </div>
        </div>
        
        {isExpanded ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in zoom-in-95 duration-300">
             {surfers.map(surfer => renderSurferCard(surfer, true))}
          </div>
        ) : (
          <div className="relative overflow-visible">
            <div className="flex gap-8 overflow-x-auto hide-scrollbar snap-x snap-mandatory flex-nowrap touch-pan-x py-4 scroll-pl-1">
              {surfers.map((surfer) => renderSurferCard(surfer, false))}
              <div className="min-w-[100px] h-full flex-shrink-0 invisible"></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const RosterSlot = ({ surfer, tier }: { surfer?: Surfer; tier: Tier; key?: React.Key }) => {
    const tierColor = getTierColor(tier);
    return (
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full border-4 flex items-center justify-center relative transition-all duration-300 ${surfer ? `bg-white ${tierColor} shadow-lg scale-105` : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
          {surfer ? (
            <>
              {!isLocked && (
                <button 
                  className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-md active:scale-90 border border-gray-100 hover:text-red-500 transition-colors z-30" 
                  onClick={(e) => { e.stopPropagation(); toggleSurfer(surfer); }}
                >
                  <span className="material-icons-round text-sm md:text-lg">close</span>
                </button>
              )}
              <div className="w-full h-full rounded-full overflow-hidden shadow-inner border border-gray-50">
                <img src={surfer.image} className="w-full h-full object-cover object-top" alt={surfer.name} />
              </div>
            </>
          ) : (
            <span className="text-lg md:text-xl text-gray-200 font-black uppercase tracking-tighter opacity-50">{tier}</span>
          )}
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
      <header className="flex justify-between items-end mb-16">
        <div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900">Draft Team</h2>
          <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mt-3">Pipeline Pro • Season 2024</p>
        </div>
        <button onClick={() => onSave(selectedSurfers)} className="text-sm md:text-base font-black text-primary-dark underline p-4 hover:opacity-70 transition decoration-2 underline-offset-4">Cancel Draft</button>
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
            
            {!aiAdvice && (
              <button 
                onClick={fetchAiAdvice}
                disabled={isAiLoading || isLocked}
                className="w-full mb-12 py-4 rounded-3xl bg-accent/20 text-primary-dark font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent/40 transition active:scale-95 border border-white shadow-sm"
              >
                {isAiLoading ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-icons-round text-base">auto_awesome</span>
                    {isLocked ? 'AI ANALYSIS COMPLETE' : 'GET AI SCOUT ADVICE'}
                  </>
                )}
              </button>
            )}

            <div className="flex justify-between items-center mb-14 px-2">
               <div className="flex flex-col">
                 <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">Budget</span>
                 <span className={`text-5xl md:text-6xl font-black tracking-tighter ${totalSpent > TOTAL_BUDGET ? 'text-red-500' : 'text-primary'}`}>
                   ${(TOTAL_BUDGET - totalSpent).toFixed(1)}<span className="text-2xl font-bold ml-1">M</span>
                 </span>
               </div>
               <div className="text-right">
                 <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">Draft</span>
                 <p className="text-5xl md:text-6xl font-black tracking-tighter">
                   {selectedSurfers.length}<span className="text-2xl text-gray-200 font-bold ml-1">/8</span>
                 </p>
               </div>
            </div>

            {/* Circular Slot 4x2 Grid */}
            <div className="grid grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12">
               <RosterSlot surfer={selectedSurfers.filter(s => s.tier === Tier.A)[0]} tier={Tier.A} />
               <RosterSlot surfer={selectedSurfers.filter(s => s.tier === Tier.A)[1]} tier={Tier.A} />
               <RosterSlot surfer={selectedSurfers.filter(s => s.tier === Tier.C)[0]} tier={Tier.C} />
               <RosterSlot surfer={selectedSurfers.filter(s => s.tier === Tier.C)[1]} tier={Tier.C} />

               {[0, 1, 2, 3].map(i => (
                 <RosterSlot key={`b-slot-${i}`} surfer={selectedSurfers.filter(s => s.tier === Tier.B)[i]} tier={Tier.B} />
               ))}
            </div>

            <button
              disabled={!isComplete || isLocked}
              onClick={() => onSave(selectedSurfers)}
              className={`w-full mt-16 py-6 rounded-[40px] font-black text-xl apple-shadow transform transition-all active:scale-95 ${
                isComplete && !isLocked 
                ? 'bg-primary-dark text-white hover:bg-primary-dark/90 hover:-translate-y-1 shadow-2xl shadow-primary/30' 
                : 'bg-accent/40 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {isLocked ? 'Roster Locked (Live)' : isComplete ? 'Lock In Roster' : `Select ${8 - selectedSurfers.length} Athletes`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamBuilder;
