import React, { useState, useEffect } from 'react';
import {
    createEvent, getEvents, createHeat, getHeats, startHeat, endHeat, updateEventStatus, deleteEvent, deleteHeat, createHeatAssignment, deleteHeatAssignment, submitWaveScore,
    eliminateSurfer, advanceSurfer, getOrCreateSurfer,
    finalizeHeat, updateEvent, getUsers, toggleUserBan,
    uploadEventImage, setEventAsCurrent,
    type Event, type Heat
} from '../../services/adminService';
import { supabase } from '../../services/supabase';
import Papa from 'papaparse';

// --- Sub-Components ---

const AdminRoundTabs: React.FC<{ rounds: string[], activeRound: string, onSelect: (r: string) => void }> = ({ rounds, activeRound, onSelect }) => {
    return (
        <div className="flex overflow-x-auto space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            {rounds.map(round => (
                <button
                    key={round}
                    onClick={() => onSelect(round)}
                    className={`px-4 py-2 text-sm font-bold rounded-md whitespace-nowrap transition-colors ${activeRound === round
                        ? 'bg-white text-black shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {round}
                </button>
            ))}
        </div>
    );
};

// --- Score Input Component ---
const ScoreInput = ({ heatId, surferId, onSave }: { heatId: string, surferId: string, onSave: () => void }) => {
    const [value, setValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!value) return;
        const score = parseFloat(value);
        if (isNaN(score)) return;

        setIsSaving(true);
        try {
            await submitWaveScore(heatId, surferId, score);
            setValue('');
            onSave();
        } catch (e) {
            console.error(e);
            alert('Failed to save score');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="relative">
            <input
                type="number"
                step="0.01"
                placeholder="Score..."
                value={value}
                disabled={isSaving}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.currentTarget.blur(); // Trigger blur to save
                    }
                }}
                className={`bg-gray-50 border text-sm p-1 w-20 rounded font-mono text-right transition-colors ${isSaving ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'border-gray-200'
                    }`}
            />
            {isSaving && (
                <div className="absolute right-1 top-1.5 ">
                    <div className="animate-spin h-3 w-3 border-2 border-yellow-500 rounded-full border-t-transparent"></div>
                </div>
            )}
        </div>
    );
};

const AdminHeatCard: React.FC<{ heat: Heat, onRefresh: () => void }> = ({ heat, onRefresh }) => {
    const [inputs, setInputs] = useState<{ [surferId: string]: string }>({});
    const [isAdding, setIsAdding] = useState(false);
    const [searchName, setSearchName] = useState('');

    const handleAddSurfer = async () => {
        if (!searchName.trim()) return;
        try {
            const parts = searchName.split('/');
            const cleanName = parts[0].trim();
            const countryCode = parts[1]?.trim();
            const { data: surfer, error: surferErr } = await getOrCreateSurfer(cleanName, countryCode);

            if (surfer) {
                const { error } = await createHeatAssignment(heat.id, surfer.id);
                if (error) {
                    if (error.code === '23505') {
                        alert(`Info: ${surfer.name} is already in this heat.`);
                        onRefresh();
                        setSearchName('');
                        setIsAdding(false);
                    } else {
                        alert(`Error adding surfer: ${error.message}`);
                    }
                } else {
                    setSearchName('');
                    setIsAdding(false);
                    onRefresh();
                }
            } else {
                alert(`Failed to create surfer '${cleanName}'.\n\nDB Error: ${surferErr?.message || 'Unknown'}\nCode: ${surferErr?.code}\n\nAsk Developer to check 'surfers' table permissions.`);
            }
        } catch (e: any) {
            alert(`System Error: ${e.message}`);
        }
    };

    const scores = heat.scores || [];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-700">Heat {heat.heat_number}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded ${heat.status === 'LIVE' ? 'bg-green-100 text-green-700' :
                    heat.status === 'COMPLETED' ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-600'
                    }`}>
                    {heat.status}
                </span>
            </div>

            <div className="divide-y divide-gray-50">
                {heat.heat_assignments?.map((assignment: any) => {
                    const surfer = assignment.surfers;
                    if (!surfer) return null;

                    return (
                        <div key={surfer.id} className="p-3 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <img
                                    src={surfer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(surfer.name)}&background=random`}
                                    alt={surfer.name}
                                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(surfer.name)}&background=random`; }}
                                    className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-gray-100"
                                />
                                <div>
                                    <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                        {surfer.name}
                                        <span className="text-xl leading-none" title={surfer.country}>{surfer.flag}</span>
                                        <button
                                            onClick={() => {
                                                if (confirm('Remove ' + surfer.name + ' from heat?')) {
                                                    deleteHeatAssignment(heat.id, surfer.id)
                                                        .then(onRefresh)
                                                        .catch(e => alert('Failed to remove: ' + e.message));
                                                }
                                            }}
                                            className="text-gray-200 hover:text-red-500 material-icons-round text-[10px]"
                                            title="Remove Surfer"
                                        >
                                            close
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end gap-1">
                                    <div className="text-2xl font-bold font-mono">
                                        {/* LIVE SCORE CALCULATION */}
                                        {(() => {
                                            const surferScores = scores.filter((s: any) => s.surfer_id === surfer.id).map((s: any) => Number(s.wave_score));
                                            const top2 = surferScores.sort((a: any, b: any) => b - a).slice(0, 2);
                                            const total = top2.reduce((sum: any, val: any) => sum + val, 0);
                                            return total.toFixed(2);
                                        })()}
                                    </div>
                                    <div className="flex gap-1">
                                        {scores.filter((s: any) => s.surfer_id === surfer.id).map((score: any, idx: number) => (
                                            <div key={idx} className="bg-gray-800 text-white text-xs px-1 rounded">
                                                {Number(score.wave_score).toFixed(2)}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <ScoreInput
                                        heatId={heat.id}
                                        surferId={surfer.id}
                                        onSave={onRefresh}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-end gap-2">
                {heat.status !== 'COMPLETED' ? (
                    <>
                        {heat.status !== 'LIVE' && (
                            <button
                                onClick={() => startHeat(heat.id).then(onRefresh)}
                                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 font-bold"
                            >
                                GO LIVE
                            </button>
                        )}
                        <button
                            onClick={async () => {
                                if (confirm('Finalize Heat? Ensure all scores are saved (black boxes).')) {
                                    try {
                                        await finalizeHeat(heat.id);
                                        onRefresh();
                                        alert('Heat Finalized & Points Distributed!');
                                    } catch (e: any) {
                                        alert('Error: ' + e.message);
                                    }
                                }
                            }}
                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 font-bold"
                        >
                            FINALIZE
                        </button>
                    </>
                ) : (
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed</span>
                )}
            </div>
        </div>
    );
};



// --- Event Details Editor Component ---
const EventDetailsEditor = ({ event, onUpdate }: { event: Event, onUpdate: () => void }) => {
    // Local state to prevent "carry over" bugs. Initialized from props.
    const [headerImage, setHeaderImage] = useState(event.header_image || '');
    const [aiContext, setAiContext] = useState(event.ai_context || '');
    const [isSaving, setIsSaving] = useState(false);

    // Sync state when event prop changes (Fixes persistence bug)
    useEffect(() => {
        setHeaderImage(event.header_image || '');
        setAiContext(event.ai_context || '');
    }, [event.id]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Optimistic preview could go here
        try {
            setIsSaving(true);
            const publicUrl = await uploadEventImage(file);
            setHeaderImage(publicUrl);
            setIsSaving(false);
        } catch (error: any) {
            alert('Upload failed: ' + error.message);
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateEvent(event.id, {
                header_image: headerImage,
                ai_context: aiContext
            });
            onUpdate();
            alert('✅ Event details saved!');
        } catch (e) {
            alert('Failed to save');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mt-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="material-icons-round text-sm bg-gray-200 p-1 rounded-full">edit</span>
                Edit Event Content
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Section */}
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-gray-400 uppercase">Header Image</label>

                    {/* Preview */}
                    <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden relative border border-gray-300">
                        {headerImage ? (
                            <img src={headerImage} className="w-full h-full object-cover" alt="Header" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                        {isSaving && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-black rounded-full border-t-transparent"></div></div>}
                    </div>

                    {/* Upload Button */}
                    <div className="flex gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="text-xs w-full file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-gray-900 file:text-white hover:file:bg-black cursor-pointer"
                        />
                    </div>
                    {/* Fallback URL Input */}
                    <input
                        className="w-full text-xs border border-gray-200 rounded p-2"
                        placeholder="Or paste image URL..."
                        value={headerImage}
                        onChange={e => setHeaderImage(e.target.value)}
                    />
                </div>

                {/* AI Context Section */}
                <div className="space-y-3 flex flex-col">
                    <label className="block text-xs font-bold text-gray-400 uppercase">AI Scout Context</label>
                    <textarea
                        className="w-full flex-1 border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none"
                        placeholder="Describe the waves, conditions, or specific advice for this event..."
                        value={aiContext}
                        onChange={e => setAiContext(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                    <span className="material-icons-round text-sm">save</span>
                </button>
            </div>
        </div>
    );
};

// --- Main Page ---

const AdminDashboard: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [heats, setHeats] = useState<Heat[]>([]);

    // UI State
    const [activeRound, setActiveRound] = useState<string>('Round 1');
    const [activeTab, setActiveTab] = useState<'EVENTS' | 'USERS'>('EVENTS');

    // Forms
    const [newEventName, setNewEventName] = useState('');
    const [newEventSlug, setNewEventSlug] = useState('');
    const [newEventImage, setNewEventImage] = useState('');
    const [newEventAiContext, setNewEventAiContext] = useState('');

    const [newHeatRound, setNewHeatRound] = useState(1);
    const [newHeatNum, setNewHeatNum] = useState(1);

    // Users Data
    const [users, setUsers] = useState<any[]>([]);

    // State for CSV Import
    const [targetRound, setTargetRound] = useState<number>(0);

    useEffect(() => { checkAdmin(); }, []);
    useEffect(() => { if (isAdmin) loadEvents(); }, [isAdmin]);
    useEffect(() => { if (isAdmin && activeTab === 'USERS') loadUsers(); }, [isAdmin, activeTab]);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setIsAdmin(true);
        setLoading(false);
    };

    const loadEvents = async () => setEvents(await getEvents());
    const loadUsers = async () => setUsers(await getUsers());

    const loadHeats = async (eventId: string) => {
        const data = await getHeats(eventId);
        setHeats(data);
        // Set default active round to first found (?) or keep current
        if (data.length > 0 && activeRound === 'Round 1') {
            // Logic to determine "current" round could go here
        }
    };

    // --- Actions ---

    const handleCreateEvent = async () => {
        try {
            await createEvent(newEventName, newEventSlug, new Date().toISOString(), new Date().toISOString());
            setNewEventName(''); setNewEventSlug(''); loadEvents();
        } catch (e) { alert('Error creating event'); }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        await deleteEvent(id); setSelectedEvent(null); loadEvents();
    };

    const handleCreateHeat = async () => {
        if (!selectedEvent) return;
        await createHeat(selectedEvent.id, newHeatRound, newHeatNum);
        loadHeats(selectedEvent.id);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedEvent) return;

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: async (results) => {
                setLoading(true);
                // 1. Pre-fetch existing heats to avoid duplicates
                // We assume the state 'heats' is somewhat fresh, but better to fetch fresh or trust local optimization?
                // For safety, let's trust the 'heats' state if we just loaded, or re-fetch.
                // Let's build a map: "Round-HeatNum" -> HeatID
                const heatMap = new Map<string, string>();

                // We need to make sure we have the latest heats for this event
                let currentHeats = heats;
                if (currentHeats.length === 0) {
                    currentHeats = await getHeats(selectedEvent.id);
                }

                currentHeats.forEach(h => {
                    heatMap.set(`${h.round_number}-${h.heat_number}`, h.id);
                });

                let currentRound = targetRound > 0 ? targetRound : 1;
                let processedCount = 0;
                let assignedCount = 0;

                // Helper to detect round from section headers
                const getRoundFromLine = (line: any[]) => {
                    const text = line.join(' ').toUpperCase();
                    if (text.includes('OPEN ROUND') || text.includes('OPENING ROUND')) return 1;
                    if (text.includes('ELIM ROUND') || text.includes('ELIMINATION')) return 2;
                    if (text.includes('ROUND OF 16')) return 3;
                    if (text.includes('QUARTER') || text.includes('QF')) return 4;
                    if (text.includes('SEMI') || text.includes('SF')) return 5;
                    if (text.includes('FINAL')) return 6;
                    return null;
                };

                for (const row of results.data as any[]) {
                    // Check for header row or explicit round switch
                    const newRound = getRoundFromLine(row);
                    if (newRound) {
                        currentRound = newRound;
                        continue;
                    }

                    // Robust Header Skip: Check if col 0 is 'Heat' or 'Round'
                    const col0 = row[0]?.toString().trim().toUpperCase() || '';
                    if (col0 === 'HEAT' || col0 === 'ROUND') continue;
                    if (row.includes('Surfer') || row.includes('Total Score') || row.includes('Names')) continue;

                    const heatStr = row[0]?.toString() || '';
                    const surferName = row[1]?.toString().trim();
                    const countryCode = row[2]?.toString().trim(); // New: Read Country from Col C

                    if (!surferName) continue;

                    // Basic validation: does col 0 look like "HEAT X" or just a number?
                    // User format: "HEAT 1"
                    if (!heatStr.toUpperCase().includes('HEAT') && !heatStr.toUpperCase().includes('QF') && !heatStr.toUpperCase().includes('SF') && !heatStr.toUpperCase().includes('FINAL')) {
                        // Some files might just have numbers "1", "2" etc? 
                        // Check if it's a number
                        if (isNaN(parseInt(heatStr))) continue;
                    }

                    try {
                        const heatNumMatch = heatStr.match(/(\d+)/);
                        const heatNum = heatNumMatch ? parseInt(heatNumMatch[0]) : 1;

                        // 2. Get OR Create Heat
                        const heatKey = `${currentRound}-${heatNum}`;
                        let heatId = heatMap.get(heatKey);

                        if (!heatId) {
                            // Create it
                            const newHeat = await createHeat(selectedEvent.id, currentRound, heatNum);
                            if (newHeat) {
                                heatId = newHeat.id;
                                heatMap.set(heatKey, heatId); // Update map so next row (same heat) uses this ID
                            }
                        }

                        if (heatId) {
                            processedCount++;

                            // 3. Find OR Create Surfer (Auto-Wildcard) WITH self-healing country
                            const { data: surfer, error: surferErr } = await getOrCreateSurfer(surferName, countryCode);

                            if (surfer) {
                                // Try assignment (ignore if exists)
                                const { error: assignErr } = await createHeatAssignment(heatId, surfer.id);
                                if (!assignErr || assignErr.code === '23505') {
                                    assignedCount++;
                                } else {
                                    console.error('Assign Error:', assignErr);
                                }

                                // Scores?
                                // User Format: Heat (0) | Name (1) | Country (2) | Total (3) | Wave 1 (4) | Wave 2 (5) | Status (6)
                                if (row[4]) {
                                    const w1 = parseFloat(row[4]);
                                    if (!isNaN(w1)) await submitWaveScore(heatId, surfer.id, w1);
                                }
                                if (row[5]) {
                                    const w2 = parseFloat(row[5]);
                                    if (!isNaN(w2)) await submitWaveScore(heatId, surfer.id, w2);
                                }

                                const status = row[6]?.toString().toUpperCase() || '';
                                if (status.includes('ELIMINATED')) await eliminateSurfer(surfer.id);
                                else if (status.includes('ADV')) await advanceSurfer(surfer.id);
                            } else {
                                console.warn(`Surfer Create Failed: ${surferName}`, surferErr);
                            }
                        }

                    } catch (e) {
                        console.error('Row process error', e);
                    }
                }

                setLoading(false);
                if (processedCount === 0) {
                    alert("⚠️ No Data Detected!\n\nCheck:\n1. Did you select the correct Round?\n2. Does Column A start with 'HEAT'?");
                } else {
                    alert(`✅ Import Complete!\n\n• Heats Processed: ${processedCount}\n• Surfers Assigned: ${assignedCount}`);
                }
                loadHeats(selectedEvent.id);
            }
        });
    };

    const handleToggleBan = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'UNBAN' : 'BAN'} this user?`)) return;
        try {
            await toggleUserBan(userId, !currentStatus);
            loadUsers();
        } catch (e) {
            alert('Error updating user status');
        }
    };

    // --- Derived State ---

    // Group heats by Round
    const heatsByRound = heats.reduce((acc, heat) => {
        const rName = `${heat.round_number}`; // Use number as string for tab comparison
        if (!acc[rName]) acc[rName] = [];
        acc[rName].push(heat);
        return acc;
    }, {} as { [key: string]: Heat[] });

    // Better Round Names Mapping
    const getRoundName = (r: number) => {
        if (r === 1) return 'Opening Round';
        if (r === 2) return 'Elimination Round';
        if (r === 3) return 'Round of 16';
        if (r === 4) return 'Quarterfinals';
        if (r === 5) return 'Semifinals';
        if (r === 6) return 'Final';
        return `Round ${r}`;
    };

    const rounds = [...new Set(heats.map(h => `${h.round_number}`))] // Convert to string for tab comparison
        .sort((a, b) => parseInt(a) - parseInt(b)); // Sort numerically

    const displayedHeats = heats.filter(h => `${h.round_number}` === activeRound || (activeRound === 'All'));


    if (loading) return <div className="p-10">Loading...</div>;
    if (!isAdmin) return <div className="p-10 text-red-500">Access Denied</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">League Commissioner Mode</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('EVENTS')}
                        className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'EVENTS' ? 'bg-black text-white' : 'bg-white text-gray-400'}`}
                    >
                        Events
                    </button>
                    <button
                        onClick={() => setActiveTab('USERS')}
                        className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'USERS' ? 'bg-black text-white' : 'bg-white text-gray-400'}`}
                    >
                        Users
                    </button>
                </div>
            </header>

            {activeTab === 'USERS' && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6">User Management</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wider">
                                    <th className="pb-4">User</th>
                                    <th className="pb-4">Joined</th>
                                    <th className="pb-4">Status</th>
                                    <th className="pb-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {users.map(user => (
                                    <tr key={user.id} className="group hover:bg-gray-50/50 transition">
                                        <td className="py-4">
                                            <div className="font-bold text-gray-900">{user.username || 'No Username'}</div>
                                            <div className="text-xs text-gray-400 font-mono">{user.id}</div>
                                        </td>
                                        <td className="py-4 text-sm text-gray-500">
                                            {new Date(user.updated_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4">
                                            {user.is_banned ? (
                                                <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-black uppercase">Banned</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs font-black uppercase">Active</span>
                                            )}
                                        </td>
                                        <td className="py-4 text-right">
                                            <button
                                                onClick={() => handleToggleBan(user.id, user.is_banned)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded border transition ${user.is_banned
                                                    ? 'border-gray-200 text-gray-500 hover:border-green-500 hover:text-green-600'
                                                    : 'border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600'
                                                    }`}
                                            >
                                                {user.is_banned ? 'UNBAN' : 'BAN USER'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'EVENTS' && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* LEFT SIDEBAR: EVENT LIST & CREATE */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* CREATE EVENT */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-4">Create New Event</h3>
                            <div className="space-y-3">
                                <input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-bold" placeholder="Event Name (e.g. Pipeline Pro)" value={newEventName} onChange={e => setNewEventName(e.target.value)} />
                                <input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-mono text-gray-500" placeholder="Slug (e.g. pipeline-2024)" value={newEventSlug} onChange={e => setNewEventSlug(e.target.value)} />
                                {/* New Fields */}
                                <input className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="Header Image URL" value={newEventImage} onChange={e => setNewEventImage(e.target.value)} />
                                <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm h-24" placeholder="AI Context (e.g. 'Waves are 10ft and heavy...')" value={newEventAiContext} onChange={e => setNewEventAiContext(e.target.value)} />

                                <button onClick={handleCreateEvent} className="w-full bg-black text-white hover:bg-gray-800 font-bold py-3 rounded-xl transition-all active:scale-95">Create Event</button>
                            </div>
                        </div>

                        {/* LIST EVENTS */}
                        <div className="space-y-2">
                            {events.map(event => (
                                <div
                                    key={event.id}
                                    onClick={() => { setSelectedEvent(event); loadHeats(event.id); }}
                                    className={`relative group w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${selectedEvent?.id === event.id ? 'bg-blue-50 border-blue-500 shadow-md ring-1 ring-blue-500' : 'bg-white border-gray-200 hover:border-gray-300'}`}
                                >
                                    <div className="font-bold text-gray-900">{event.name}</div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${event.status === 'LIVE' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-500'}`}>{event.status}</span>
                                        <span className="text-xs text-gray-400 font-mono">{event.start_date.split('T')[0]}</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Delete event?')) handleDeleteEvent(event.id);
                                        }}
                                        className="mt-3 text-[10px] text-red-500 hover:underline opacity-50 hover:opacity-100"
                                    >
                                        Delete Forever
                                    </button>

                                    {/* Set Active Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setEventAsCurrent(event.id)
                                                .then(loadEvents)
                                                .catch(err => alert('Error setting active event: ' + err.message));
                                        }}
                                        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all z-50 shadow-sm border border-gray-100 ${event.is_current
                                            ? 'bg-yellow-50 text-yellow-400 scale-110 ring-2 ring-yellow-400 ring-offset-1'
                                            : 'bg-white text-gray-300 hover:text-yellow-400 hover:scale-110 hover:shadow-md'
                                            }`}
                                        title={event.is_current ? "Currently Active Event" : "Set as Current Event"}
                                    >
                                        <span className="material-icons-round text-2xl">
                                            {event.is_current ? 'star' : 'star_border'}
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="lg:col-span-3">
                        {selectedEvent ? (
                            <div className="space-y-6">
                                {/* EVENT HEADER & EDIT */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-black">{selectedEvent.name}</h2>
                                            <p className="text-gray-400 text-xs font-mono mt-1">{selectedEvent.id}</p>
                                        </div>
                                        <div className="space-x-3">
                                            <button onClick={() => updateEventStatus(selectedEvent.id, 'LIVE').then(loadEvents)} className={`px-4 py-2 rounded-lg font-bold text-sm text-white ${selectedEvent.status === 'LIVE' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}>
                                                {selectedEvent.status === 'LIVE' ? 'LIVE NOW' : 'GO LIVE'}
                                            </button>
                                            <button onClick={() => updateEventStatus(selectedEvent.id, 'COMPLETED').then(loadEvents)} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-sm">
                                                END
                                            </button>
                                        </div>
                                    </div>

                                    {/* EVENT DETAILS EDITOR */}
                                    <EventDetailsEditor
                                        event={selectedEvent}
                                        onUpdate={() => { loadEvents(); setSelectedEvent(prev => prev ? { ...prev } : null); }} // Force refresh logic could be better, but this works for MVP
                                    />
                                </div>

                                {/* ACTIONS: UPLOAD & ADD HEAT */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col justify-center">
                                        <h3 className="font-bold text-blue-900 text-sm mb-2">📄 Import Heat Draw (CSV)</h3>
                                        <div className="flex gap-2 items-center mb-2">
                                            <select
                                                value={targetRound}
                                                onChange={e => setTargetRound(parseInt(e.target.value))}
                                                className="text-xs border rounded p-1 text-blue-800 bg-white"
                                            >
                                                <option value={0}>Auto-Detect Round</option>
                                                <option value={1}>Opening Round</option>
                                                <option value={2}>Elimination Round</option>
                                                <option value={3}>Round of 16</option>
                                                <option value={4}>Quarterfinals</option>
                                                <option value={5}>Semifinals</option>
                                                <option value={6}>Final</option>
                                            </select>
                                        </div>
                                        <input type="file" accept=".csv" onChange={handleFileUpload} className="text-xs text-blue-600 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-200 file:text-blue-800 hover:file:bg-blue-300" />
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <h3 className="font-bold text-gray-600 text-sm mb-2">Manually Add Heat</h3>
                                        <div className="flex gap-2">
                                            <input type="number" className="w-16 border rounded p-1 text-sm text-center" placeholder="Rnd" value={newHeatRound} onChange={e => setNewHeatRound(parseInt(e.target.value))} />
                                            <input type="number" className="w-16 border rounded p-1 text-sm text-center" placeholder="Ht #" value={newHeatNum} onChange={e => setNewHeatNum(parseInt(e.target.value))} />
                                            <button onClick={handleCreateHeat} className="bg-black text-white px-3 py-1 rounded text-sm font-bold flex-1">Add +</button>
                                        </div>
                                    </div>
                                </div>

                                {/* ROUND TABS */}
                                {rounds.length > 0 && (
                                    <div className="flex overflow-x-auto space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                                        {rounds.map(round => (
                                            <button
                                                key={round}
                                                onClick={() => setActiveRound(round)}
                                                className={`px-4 py-2 text-sm font-bold rounded-md whitespace-nowrap transition-colors ${activeRound === round
                                                    ? 'bg-white text-black shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                {/* HUMAN READABLE ROUND NAME */}
                                                {getRoundName(parseInt(round))}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* HEAT GRID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                                    {displayedHeats.map(heat => (
                                        <AdminHeatCard key={heat.id} heat={heat} onRefresh={() => loadHeats(selectedEvent.id)} />
                                    ))}
                                </div>
                                {displayedHeats.length === 0 && <div className="text-center py-20 text-gray-300 font-bold">No heats in this round</div>}

                            </div>
                        ) : (
                            <div className="h-96 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
                                <span className="material-icons-round text-4xl mb-2">event_note</span>
                                <div className="font-bold">Select an event to begin</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div >
    );
};

export default AdminDashboard;
