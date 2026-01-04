import React, { useState, useEffect } from 'react';
import {
    createEvent, getEvents, createHeat, getHeats, startHeat, endHeat, updateEventStatus, deleteEvent, deleteHeat, createHeatAssignment, deleteHeatAssignment, submitWaveScore,
    eliminateSurfer, advanceSurfer, getOrCreateSurfer,
    finalizeHeat
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
            // Support "Name/Country" syntax (e.g. "Joel/AUS")
            const parts = searchName.split('/');
            const cleanName = parts[0].trim();
            const countryCode = parts[1]?.trim(); // Optional

            // Use getOrCreate so we can add ANYONE manually if they are missing
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
                // If we get here, creation failed
                alert(`Failed to create surfer '${cleanName}'.\n\nDB Error: ${surferErr?.message || 'Unknown'}\nCode: ${surferErr?.code}\n\nAsk Developer to check 'surfers' table permissions.`);
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
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="Score..."
                                        className="bg-gray-50 border border-gray-200 text-sm p-1 w-20 rounded font-mono text-right"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                const val = parseFloat(e.currentTarget.value);
                                                if (!isNaN(val)) {
                                                    submitWaveScore(heat.id, surfer.id, val).then(() => {
                                                        e.currentTarget.value = ''; // Clear
                                                        onRefresh();
                                                    });
                                                }
                                            }
                                        }}
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
                                if (confirm('Finalize Heat? This will calculate totals and distribute FANTASY POINTS to all users. Undo is difficult.')) {
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
