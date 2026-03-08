import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import Papa from 'papaparse';

dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
    const email = `test-${Date.now()}@example.com`;
    const { data: authData } = await supabase.auth.signUp({ email, password: 'password123' });
    console.log("Logged in:", authData.user.id);

    // Get current events or create one
    let { data: events } = await supabase.from('events').select();
    if (!events || events.length === 0) {
        const { data: eventData } = await supabase.from('events').insert({ name: 'Test Event', slug: 'test-event', start_date: new Date().toISOString(), end_date: new Date().toISOString() }).select().single();
        events = [eventData];
    }
    const selectedEvent = events[0];
    console.log("Using Event:", selectedEvent.id);

    const fileContent = fs.readFileSync('cs-newcastle-heats.csv', 'utf8');

    Papa.parse(fileContent, {
        header: false,
        skipEmptyLines: true,
        complete: async (results) => {
            const heatMap = new Map();
            let currentRound = 1;
            let processedCount = 0;
            let assignedCount = 0;

            const getRoundFromLine = (line) => {
                const text = line.join(' ').toUpperCase();
                if (text.includes('OPEN ROUND') || text.includes('OPENING ROUND')) return 1;
                if (text.includes('ELIM ROUND') || text.includes('ELIMINATION')) return 2;
                if (text.includes('ROUND OF 16')) return 3;
                if (text.includes('QUARTER') || text.includes('QF')) return 4;
                if (text.includes('SEMI') || text.includes('SF')) return 5;
                if (text.includes('FINAL')) return 6;
                return null;
            };

            for (const row of results.data) {
                const newRound = getRoundFromLine(row);
                if (newRound) {
                    currentRound = newRound;
                    continue;
                }

                const col0 = row[0]?.toString().trim().toUpperCase() || '';
                if (col0 === 'HEAT' || col0 === 'ROUND') continue;
                if (row.includes('Surfer') || row.includes('Total Score') || row.includes('Names')) continue;

                const heatStr = row[0]?.toString() || '';
                const surferName = row[1]?.toString().trim();
                const countryCode = row[2]?.toString().trim();

                if (!surferName) continue;

                if (!heatStr.toUpperCase().includes('HEAT') && !heatStr.toUpperCase().includes('QF') && !heatStr.toUpperCase().includes('SF') && !heatStr.toUpperCase().includes('FINAL')) {
                    if (isNaN(parseInt(heatStr))) continue;
                }

                try {
                    const heatNumMatch = heatStr.match(/(\d+)/);
                    const heatNum = heatNumMatch ? parseInt(heatNumMatch[0]) : 1;

                    const heatKey = `${currentRound}-${heatNum}`;
                    let heatId = heatMap.get(heatKey);

                    if (!heatId) {
                        const { data: newHeat, error: heatErr } = await supabase.from('heats').insert({ event_id: selectedEvent.id, round_number: currentRound, heat_number: heatNum }).select().single();
                        if (newHeat) {
                            heatId = newHeat.id;
                            heatMap.set(heatKey, heatId);
                        } else {
                            console.error("Heat Create Error:", heatErr);
                        }
                    }

                    if (heatId) {
                        processedCount++;
                        let surferData = null;
                        const { data: existing } = await supabase.from('surfers').select('*').ilike('name', surferName).limit(1).single();
                        if (existing) {
                            surferData = existing;
                        } else {
                            const { data: newSurf, error: surfErr } = await supabase.from('surfers').insert({ name: surferName, flag: '🏳️' }).select('*').single();
                            if (surfErr) console.error("Surfer Create Error:", surfErr);
                            surferData = newSurf;
                        }

                        if (surferData) {
                            const { error: assignErr } = await supabase.from('heat_assignments').insert({ heat_id: heatId, surfer_id: surferData.id });
                            if (!assignErr || assignErr.code === '23505') {
                                assignedCount++;
                            } else {
                                console.error('Assign Error:', assignErr);
                            }
                        }
                    }
                } catch (e) {
                    console.error('Row process error', e);
                }
            }
            console.log(`Processed: ${processedCount}, Assigned: ${assignedCount}`);
        }
    });
}
run();
