import React, { useState, useEffect } from 'react';
import { createEvent, getEvents, createHeat, getHeats, startHeat, endHeat, updateEventStatus, deleteEvent, deleteHeat, createHeatAssignment, deleteHeatAssignment, findSurferByName, getOrCreateSurfer, submitWaveScore, eliminateSurfer, advanceSurfer, Event, Heat } from '../../services/adminService';
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

const AdminHeatCard: React.FC<{ heat: Heat, onRefresh: () => void }> = ({ heat, onRefresh }) => {
    const [inputs, setInputs] = useState<{ [surferId: string]: string }>({});
    const [isAdding, setIsAdding] = useState(false);
    const [searchName, setSearchName] = useState('');

    const handleScoreSubmit = async (surferId: string, value: string) => {
        const score = parseFloat(value);
        if (!isNaN(score) && score >= 0 && score <= 10) {
            await submitWaveScore(heat.id, surferId, score);
            setInputs(prev => ({ ...prev, [surferId]: '' }));
            onRefresh();
        }
    };

    const handleAddSurfer = async () => {
        if (!searchName.trim()) return;
        try {
            // Use getOrCreate so we can add ANYONE manually if they are missing
            const surfer = await getOrCreateSurfer(searchName);
            if (surfer) {
                const { error } = await createHeatAssignment(heat.id, surfer.id);
                if (error) {
                    if (error.code === '23505') {
                        alert(`Info: ${surfer.name} is already in this heat.`);
                        onRefresh(); // Refresh anyway just in case
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
                alert(`Surfer '${searchName}' not found in database. Check spelling.`);
            }
        } catch (e: any) {
            alert(`System Error: ${e.message}`);
        }
    };

    const getSurferTotal = (surferId: string) => {
        const surferScores = heat.scores?.filter(s => s.surfer_id === surferId).map(s => s.wave_score) || [];
        surferScores.sort((a, b) => b - a);
        const top2 = surferScores.slice(0, 2);
        return top2.reduce((sum, s) => sum + s, 0).toFixed(2);
    };

    const getSurferLastWaves = (surferId: string) => {
        const surferScores = heat.scores?.filter(s => s.surfer_id === surferId).map(s => s.wave_score) || [];
        return surferScores.slice(-2).join(', ');
    };

    return (
        <div className="bg-white border text-left border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <div className="font-bold text-gray-800 flex items-center gap-2">
                    <span>Heat {heat.heat_number}</span>
                    <button onClick={() => deleteHeat(heat.id).then(onRefresh)} className="text-gray-300 hover:text-red-500 text-xs material-icons-round">
                        delete
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {heat.status === 'LIVE' && <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></span>}
                    <span className="text-xs font-bold text-gray-400 uppercase">{heat.status}</span>
                    {heat.status === 'UPCOMING' && <button onClick={() => startHeat(heat.id).then(onRefresh)} className="text-xs bg-green-500 text-white px-2 py-1 rounded">Start</button>}
                    {heat.status === 'LIVE' && <button onClick={() => endHeat(heat.id).then(onRefresh)} className="text-xs bg-black text-white px-2 py-1 rounded">End</button>}
                </div>
            </div>

            <div className="divide-y divide-gray-50">
                {heat.heat_assignments?.map(assignment => {
                    const surfer = Array.isArray(assignment.surfers) ? assignment.surfers[0] : assignment.surfers;
                    if (!surfer) return null;

                    return (
                        <div key={surfer.id} className="p-3 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <img src={surfer.image} alt={surfer.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-gray-100" />
                                <div>
                                    <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                        {surfer.name}
                                        <span className="text-xs font-normal opacity-50">{surfer.country} {surfer.flag}</span>
                                        <button
                                            onClick={() => deleteHeatAssignment(heat.id, surfer.id).then(onRefresh)}
                                            className="text-gray-200 hover:text-red-500 material-icons-round text-[10px]"
                                            title="Remove Surfer"
                                        >
                                            close
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        Waves: <span className="font-mono text-gray-600">{getSurferLastWaves(surfer.id)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 uppercase">Total</div>
                                    <div className="font-black text-lg font-mono">{getSurferTotal(surfer.id)}</div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <input
                                        type="number"
                                        placeholder="Score"
                                        className="w-16 border rounded p-1 text-right font-mono text-sm focus:ring-2 focus:ring-black focus:outline-none"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleScoreSubmit(surfer.id, (e.target as HTMLInputElement).value);
                                                (e.target as HTMLInputElement).value = '';
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Manual Add Surfer UI */}
                <div className="p-2 text-center">
                    {isAdding ? (
                        <div className="flex gap-2">
                            <input
                                className="border rounded px-2 py-1 text-sm flex-1"
                                placeholder="Surfer Name..."
                                value={searchName}
                                onChange={e => setSearchName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddSurfer()}
                                autoFocus
                            />
                            <button onClick={handleAddSurfer} className="bg-black text-white px-2 rounded text-xs">Add</button>
                            <button onClick={() => setIsAdding(false)} className="text-gray-400 text-xs px-1">Cancel</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsAdding(true)} className="text-xs text-blue-500 font-bold hover:underline">+ Add Surfer</button>
                    )}
                </div>
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

    // Forms
    const [newEventName, setNewEventName] = useState('');
    const [newEventSlug, setNewEventSlug] = useState('');
    const [newHeatRound, setNewHeatRound] = useState(1);
    const [newHeatNum, setNewHeatNum] = useState(1);

    // State for CSV Import
    const [targetRound, setTargetRound] = useState<number>(0);

    useEffect(() => { checkAdmin(); }, []);
    useEffect(() => { if (isAdmin) loadEvents(); }, [isAdmin]);
    useEffect(() => {
        if (selectedEvent) loadHeats(selectedEvent.id);
    }, [selectedEvent]);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setIsAdmin(true);
        setLoading(false);
    };

    const loadEvents = async () => setEvents(await getEvents());

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

                            // 3. Find Surfer & Assign
                            const surfer = await findSurferByName(surferName);
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
                                console.warn(`Surfer not found: ${surferName}`);
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

    // --- Derived State ---

    // Group heats by Round
    const heatsByRound = heats.reduce((acc, heat) => {
        const rName = `Round ${heat.round_number}`; // Or map 1->Opening, 2->Elim, etc
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

    const rounds = [...new Set(heats.map(h => getRoundName(h.round_number)))].sort((a, b) => {
        // Custom sort order based on expected progression
        const order = ['Opening Round', 'Elimination Round', 'Round of 16', 'Quarterfinals', 'Semifinals', 'Final'];
        return order.indexOf(a) - order.indexOf(b);
    });

    const displayedHeats = heats.filter(h => getRoundName(h.round_number) === activeRound || (activeRound === 'All'));


    if (loading) return <div className="p-10">Loading...</div>;
    if (!isAdmin) return <div className="p-10 text-red-500">Access Denied</div>;

    return (
        <div className="p-8 pb-24 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
                        Admin Control Room <span className="text-xs bg-black text-white px-2 py-1 rounded-full">v2.1</span>
                    </h1>
                    <div className="text-sm text-gray-400">Manage live events and scoring</div>
                </div>
                <button
                    onClick={() => { console.log('Raw Heats:', heats); alert('Data logged to console. Check Developer Tools.'); }}
                    className="text-xs text-gray-400 hover:text-black underline"
                >
                    Debug Data
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* LEFT SIDEBAR: EVENTS */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4">Events</h2>
                        <div className="space-y-2">
                            {events.map(ev => (
                                <div
                                    key={ev.id}
                                    onClick={() => setSelectedEvent(ev)}
                                    className={`p-3 rounded-xl cursor-pointer border-2 transition ${selectedEvent?.id === ev.id ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                                >
                                    <div className="font-bold text-sm">{ev.name}</div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${ev.status === 'LIVE' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {ev.status}
                                        </span>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(ev.id) }} className="text-gray-300 hover:text-red-500">
                                            <span className="material-icons-round text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">New Event</h3>
                            <div className="space-y-2">
                                <input className="w-full text-sm border p-2 rounded bg-gray-50" placeholder="Name" value={newEventName} onChange={e => setNewEventName(e.target.value)} />
                                <input className="w-full text-sm border p-2 rounded bg-gray-50" placeholder="Slug" value={newEventSlug} onChange={e => setNewEventSlug(e.target.value)} />
                                <button onClick={handleCreateEvent} className="w-full bg-black text-white text-sm font-bold py-2 rounded">Create Event</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT: HEATS */}
                <div className="lg:col-span-3">
                    {selectedEvent ? (
                        <div className="space-y-6">
                            {/* EVENT HEADER */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
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
                                <AdminRoundTabs rounds={rounds} activeRound={activeRound} onSelect={setActiveRound} />
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
        </div>
    );
};

export default AdminDashboard;
