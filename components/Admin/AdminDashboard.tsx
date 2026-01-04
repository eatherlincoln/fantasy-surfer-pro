import React, { useState, useEffect } from 'react';
import { createEvent, getEvents, createHeat, getHeats, startHeat, endHeat, updateEventStatus, Event, Heat } from '../../services/adminService';
import { supabase } from '../../services/supabase';

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

    if (loading) return <div className="p-10">Loading...</div>;
    if (!isAdmin) return <div className="p-10 text-red-500">Access Denied</div>;

    return (
        <div className="p-8 pb-24 max-w-6xl mx-auto">
            <h1 className="text-3xl font-black mb-8 text-gray-900 border-b pb-4">Admin Control Room 🎛️</h1>

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
        </div>
    );
};

export default AdminDashboard;
