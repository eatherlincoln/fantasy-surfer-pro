import React, { useState, useEffect } from 'react';
import { createEvent, getEvents, createHeat, getHeats, startHeat, endHeat, updateEventStatus, deleteEvent, deleteHeat, createHeatAssignment, findSurferByName, submitWaveScore, eliminateSurfer, advanceSurfer, Event, Heat } from '../../services/adminService';
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
    // Local state for score inputs to avoid excessive re-renders/db calls while typing
    const [inputs, setInputs] = useState<{ [surferId: string]: string }>({});

    const handleScoreSubmit = async (surferId: string, value: string) => {
        const score = parseFloat(value);
        if (!isNaN(score) && score >= 0 && score <= 10) {
            await submitWaveScore(heat.id, surferId, score);
            // Clear input after submit or keep it? Usually keep to show last entered? 
            // Better to just refresh data to show it "logged".
            setInputs(prev => ({ ...prev, [surferId]: '' })); // Clear input
            onRefresh();
        }
    };

    const getSurferTotal = (surferId: string) => {
        // Simple sum of top 2 waves? Or just sum all for now? 
        // User requested top 2.
        const surferScores = heat.scores?.filter(s => s.surfer_id === surferId).map(s => s.wave_score) || [];
        surferScores.sort((a, b) => b - a);
        const top2 = surferScores.slice(0, 2);
        return top2.reduce((sum, s) => sum + s, 0).toFixed(2);
    };

    const getSurferLastWaves = (surferId: string) => {
        const surferScores = heat.scores?.filter(s => s.surfer_id === surferId).map(s => s.wave_score) || [];
        // Return last 2 distinct scores for display context (optional)
        return surferScores.slice(-2).join(', ');
    };

    return (
        <div className="bg-white border text-left border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <div className="font-bold text-gray-800">
                    Heat {heat.heat_number}
                    <button onClick={() => deleteHeat(heat.id).then(onRefresh)} className="ml-2 text-gray-300 hover:text-red-500 text-xs material-icons-round align-middle">
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
                    const surfer = assignment.surfers;
                    return (
                        <div key={surfer.id} className="p-3 flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <img src={surfer.image} alt={surfer.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 bg-gray-100" />
                                <div>
                                    <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                                        {surfer.name}
                                        <span className="text-xs font-normal opacity-50">{surfer.country} {surfer.flag}</span>
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

                                {heat.status === 'LIVE' && (
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
                                )}
                            </div>
                        </div>
                    );
                })}
                {(!heat.heat_assignments || heat.heat_assignments.length === 0) && (
                    <div className="p-4 text-center text-xs text-gray-400">Empty Heat</div>
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
                let currentRound = 1;
                const getRoundFromLine = (line: any[]) => {
                    const text = line.join(' ').toUpperCase();
                    if (text.includes('OPEN ROUND')) return 1;
                    if (text.includes('ELIM ROUND')) return 2;
                    if (text.includes('ROUND OF 16')) return 3;
                    if (text.includes('QUARTER') || text.includes('QF')) return 4;
                    if (text.includes('SEMI') || text.includes('SF')) return 5;
                    if (text.includes('FINAL')) return 6;
                    return null;
                };

                for (const row of results.data as any[]) {
                    const newRound = getRoundFromLine(row);
                    if (newRound) { currentRound = newRound; continue; }
                    if (row.includes('Surfer') || row.includes('Total Score')) continue;

                    const heatStr = row[0]?.toString() || '';
                    const surferName = row[1]?.toString();
                    if (!surferName) continue;

                    if (!heatStr.toUpperCase().includes('HEAT') && !heatStr.toUpperCase().includes('QF') && !heatStr.toUpperCase().includes('SEMI') && !heatStr.toUpperCase().includes('FINAL')) continue;

                    try {
                        const heatNumMatch = heatStr.match(/(\d+)/);
                        const heatNum = heatNumMatch ? parseInt(heatNumMatch[0]) : 1;

                        // Use simple create (ignoring duplication handling for MVP)
                        const heatRes = await createHeat(selectedEvent.id, currentRound, heatNum);
                        if (heatRes?.id) {
                            const surfer = await findSurferByName(surferName);
                            if (surfer) {
                                await createHeatAssignment(heatRes.id, surfer.id).catch(() => { });
                                const w1 = parseFloat(row[3]);
                                const w2 = parseFloat(row[4]);
                                if (!isNaN(w1)) await submitWaveScore(heatRes.id, surfer.id, w1);
                                if (!isNaN(w2)) await submitWaveScore(heatRes.id, surfer.id, w2);

                                const status = row[5]?.toString().toUpperCase() || '';
                                if (status.includes('ELIMINATED')) await eliminateSurfer(surfer.id);
                                else if (status.includes('ADV')) await advanceSurfer(surfer.id);
                            }
                        }
                    } catch (e) { console.error(e); }
                }
                alert('Import Complete!');
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
                <h1 className="text-3xl font-black text-gray-900">Admin Control Room V2 🎛️</h1>
                <div className="text-sm text-gray-400">Manage live events and scoring</div>
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
