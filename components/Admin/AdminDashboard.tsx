import React, { useState, useEffect } from 'react';
import { createEvent, getEvents, createHeat, getHeats, startHeat, endHeat, updateEventStatus, deleteEvent, deleteHeat, createHeatAssignment, findSurferByName, submitWaveScore, eliminateSurfer, advanceSurfer, Event, Heat } from '../../services/adminService';
import { supabase } from '../../services/supabase';
import Papa from 'papaparse';

const AdminDashboard: React.FC = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [heats, setHeats] = useState<Heat[]>([]);

    // Forms
    const [newEventName, setNewEventName] = useState('');
    const [newEventSlug, setNewEventSlug] = useState('');
    const [newHeatRound, setNewHeatRound] = useState(1);
    const [newHeatNum, setNewHeatNum] = useState(1);

    useEffect(() => {
        checkAdmin();
    }, []);

    useEffect(() => {
        if (isAdmin) loadEvents();
    }, [isAdmin]);

    useEffect(() => {
        if (selectedEvent) loadHeats(selectedEvent.id);
    }, [selectedEvent]);

    const checkAdmin = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        // For MVP, just checking if logged in. In prod, check specific role/claim
        if (user) {
            setIsAdmin(true);
        }
        setLoading(false);
    };

    const loadEvents = async () => {
        try {
            const data = await getEvents();
            setEvents(data);
        } catch (e) {
            console.error(e);
        }
    };

    const loadHeats = async (eventId: string) => {
        try {
            const data = await getHeats(eventId);
            setHeats(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateEvent = async () => {
        try {
            await createEvent(newEventName, newEventSlug, new Date().toISOString(), new Date().toISOString());
            setNewEventName('');
            setNewEventSlug('');
            loadEvents();
        } catch (e) {
            alert('Error creating event');
            console.error(e);
        }
    };

    const handleCreateHeat = async () => {
        if (!selectedEvent) return;
        try {
            await createHeat(selectedEvent.id, newHeatRound, newHeatNum);
            loadHeats(selectedEvent.id);
        } catch (e) {
            alert('Error creating heat');
            console.error(e);
        }
    };

    const toggleHeatStatus = async (heat: Heat) => {
        try {
            if (heat.status === 'UPCOMING') await startHeat(heat.id);
            else if (heat.status === 'LIVE') await endHeat(heat.id);
            if (selectedEvent) loadHeats(selectedEvent.id);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event? This cannot be undone.')) return;
        try {
            await deleteEvent(id);
            setSelectedEvent(null);
            loadEvents();
        } catch (e) {
            alert('Error deleting event' + e);
        }
    };

    const handleDeleteHeat = async (id: string) => {
        if (!confirm('Delete heat?')) return;
        try {
            await deleteHeat(id);
            if (selectedEvent) loadHeats(selectedEvent.id);
        } catch (e) {
            alert('Error deleting heat');
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !selectedEvent) return;

        Papa.parse(file, {
            header: false, // We use false because header lines appear mid-file
            skipEmptyLines: true,
            complete: async (results) => {
                console.log('Parsed Raw CSV:', results.data);

                let currentRound = 1;
                let processedCount = 0;
                let assignedCount = 0;
                let scoresCount = 0;

                // Helper to detect round from section headers
                const getRoundFromLine = (line: any[]) => {
                    const text = line.join(' ').toUpperCase();
                    if (text.includes('OPEN ROUND')) return 1;
                    if (text.includes('ELIM ROUND')) return 2;
                    if (text.includes('ROUND OF 16')) return 3; // Or 3
                    if (text.includes('QUARTER') || text.includes('QF')) return 4;
                    if (text.includes('SEMI') || text.includes('SF')) return 5;
                    if (text.includes('FINAL')) return 6;
                    return null;
                };

                for (const row of results.data as any[]) {
                    // 1. Detect Round Change
                    const newRound = getRoundFromLine(row);
                    if (newRound) {
                        currentRound = newRound;
                        console.log(`Switched to Round ${currentRound}`);
                        continue;
                    }

                    // 2. Skip Header Rows (rows containing "Surfer" or "Total Score")
                    if (row.includes('Surfer') || row.includes('Total Score')) continue;

                    // 3. Process Data Row
                    const heatStr = row[0]?.toString() || '';
                    const surferName = row[1]?.toString();

                    if (!heatStr.toUpperCase().includes('HEAT') && !heatStr.toUpperCase().includes('QF') && !heatStr.toUpperCase().includes('SEMI') && !heatStr.toUpperCase().includes('FINAL')) {
                        continue; // Skip lines that don't look like heat rows
                    }

                    if (!surferName) continue;

                    try {
                        const heatNumMatch = heatStr.match(/(\d+)/);
                        const heatNum = heatNumMatch ? parseInt(heatNumMatch[0]) : 1;

                        const heatRes = await createHeat(selectedEvent.id, currentRound, heatNum);
                        const heatId = heatRes?.id;

                        if (heatId) {
                            processedCount++;
                            const surfer = await findSurferByName(surferName);
                            if (surfer) {
                                await createHeatAssignment(heatId, surfer.id).catch(e =>
                                    console.log('Assignment likely exists', e.message)
                                );
                                assignedCount++;

                                const w1 = parseFloat(row[3]);
                                const w2 = parseFloat(row[4]);

                                if (!isNaN(w1)) {
                                    await submitWaveScore(heatId, surfer.id, w1);
                                    scoresCount++;
                                }
                                if (!isNaN(w2)) {
                                    await submitWaveScore(heatId, surfer.id, w2);
                                    scoresCount++;
                                }

                                const status = row[5]?.toString().toUpperCase() || '';
                                if (status.includes('ELIMINATED')) {
                                    await eliminateSurfer(surfer.id);
                                } else if (status.includes('ADV')) {
                                    await advanceSurfer(surfer.id);
                                }

                            } else {
                                console.warn(`Surfer NOT FOUND: ${surferName}`);
                            }
                        }

                    } catch (e) {
                        console.error('Row Error:', row, e);
                    }
                }

                alert(`Import Complete!\nProcessed Heats: ${processedCount}\nAssignments: ${assignedCount}\nScored Waves: ${scoresCount}`);
                loadHeats(selectedEvent.id);
            }
        });
    };

    if (loading) return <div className="p-10">Loading...</div>;
    if (!isAdmin) return <div className="p-10 text-red-500">Access Denied</div>;

    return (
        <div className="p-8 pb-24 max-w-6xl mx-auto">
            <h1 className="text-3xl font-black mb-8 text-gray-900 border-b pb-4">Admin Control Room V2 🎛️</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* LEFT COLUMN: EVENTS */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">Create Event</h2>
                        <div className="space-y-3">
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Event Name (e.g. Pipeline Pro)"
                                value={newEventName}
                                onChange={e => setNewEventName(e.target.value)}
                            />
                            <input
                                className="w-full border p-2 rounded"
                                placeholder="Slug (e.g. pipeline-2024)"
                                value={newEventSlug}
                                onChange={e => setNewEventSlug(e.target.value)}
                            />
                            <button
                                onClick={handleCreateEvent}
                                className="w-full bg-black text-white font-bold py-2 rounded hover:opacity-80"
                            >
                                Create
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-bold text-gray-400 uppercase text-xs">Existing Events</h3>
                        {events.map(ev => (
                            <div
                                key={ev.id}
                                onClick={() => setSelectedEvent(ev)}
                                className={`p-4 rounded-xl cursor-pointer border-2 transition ${selectedEvent?.id === ev.id ? 'border-primary bg-primary/5' : 'border-transparent bg-white shadow-sm hover:border-gray-200'}`}
                            >
                                <div className="font-bold">{ev.name}</div>
                                <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${ev.status === 'LIVE' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {ev.status}
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteEvent(ev.id); }}
                                    className="ml-2 text-red-300 hover:text-red-500"
                                >
                                    <span className="material-icons-round text-sm">delete</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: HEATS & CONTROL */}
                <div className="md:col-span-2">
                    {selectedEvent ? (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-black">{selectedEvent.name}</h2>
                                    <p className="text-gray-400 text-sm font-mono">{selectedEvent.id}</p>
                                </div>
                                <div className="space-x-2">
                                    {selectedEvent.status !== 'LIVE' && (
                                        <button
                                            onClick={() => { updateEventStatus(selectedEvent.id, 'LIVE'); loadEvents(); }}
                                            className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-sm"
                                        >
                                            GO LIVE 🔴
                                        </button>
                                    )}
                                    {selectedEvent.status === 'LIVE' && (
                                        <button
                                            onClick={() => { updateEventStatus(selectedEvent.id, 'COMPLETED'); loadEvents(); }}
                                            className="bg-gray-800 text-white font-bold px-4 py-2 rounded-lg text-sm"
                                        >
                                            END EVENT 🏁
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Heat Creator */}
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h3 className="font-bold mb-3">Add Heat</h3>
                                <div className="flex gap-4">
                                    <input
                                        type="number"
                                        className="w-20 border p-2 rounded"
                                        placeholder="Round"
                                        value={newHeatRound}
                                        onChange={e => setNewHeatRound(parseInt(e.target.value))}
                                    />
                                    <input
                                        type="number"
                                        className="w-20 border p-2 rounded"
                                        placeholder="Heat #"
                                        value={newHeatNum}
                                        onChange={e => setNewHeatNum(parseInt(e.target.value))}
                                    />
                                    <button
                                        onClick={handleCreateHeat}
                                        className="bg-primary text-white font-bold px-6 rounded hover:bg-primary-dark"
                                    >
                                        Add +
                                    </button>
                                </div>
                            </div>


                            {/* Bulk CSV Upload */}
                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <h3 className="font-bold mb-3 text-blue-900">📄 Upload Heat Draw (CSV)</h3>
                                <p className="text-xs text-blue-700 mb-2">Format: Round, Heat, Surfer1, Surfer2, Surfer3</p>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="text-sm text-blue-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                                />
                            </div>

                            {/* Heats List */}
                            <div className="space-y-4">
                                {heats.map(heat => (
                                    <div key={heat.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                                        <div>
                                            <div className="font-bold text-lg">Heat {heat.heat_number} <span className="text-gray-400 text-sm font-normal">Round {heat.round_number}</span></div>
                                            <div className="text-xs text-gray-400 font-mono">{heat.id}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`font-bold text-xs ${heat.status === 'LIVE' ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                                                {heat.status}
                                            </span>
                                            <button
                                                onClick={() => toggleHeatStatus(heat)}
                                                className={`px-4 py-2 rounded-lg font-bold text-sm text-white ${heat.status === 'UPCOMING' ? 'bg-green-500' : heat.status === 'LIVE' ? 'bg-red-500' : 'bg-gray-300'}`}
                                            >
                                                {heat.status === 'UPCOMING' ? 'START' : heat.status === 'LIVE' ? 'FINISH' : 'DONE'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteHeat(heat.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 transition"
                                            >
                                                <span className="material-icons-round">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {heats.length === 0 && <div className="text-center text-gray-400 py-10">No heats created yet.</div>}
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-3xl">
                            Select an event to manage
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default AdminDashboard;
