import * as fs from 'fs';
import { supabase } from './services/supabase.ts';
import {
    createHeat, getHeats, getOrCreateSurfer,
    createHeatAssignment, submitWaveScore, advanceSurfer, eliminateSurfer
} from './services/adminService.ts';

const mockCsv = `OPENING ROUND
Heat 1,Igor Moraes,BRA,8.40,ELIMINATED
Heat 1,Dakoda Walters,AUS,13.07,ADV`;

const testImport = async () => {
    console.log("Starting CSV Import Test...");

    // We'll use the first event ID we can find
    const { data: events } = await supabase.from('events').select('id').limit(1);
    if (!events || events.length === 0) {
        console.log("No events!");
        process.exit(1);
    }
    const eventId = events[0].id;
    console.log("Event:", eventId);

    const records = mockCsv.split('\n').map(line => line.split(','));

    // Map same as AdminDashboard logic
    const heatMap = new Map();
    let currentHeats = await getHeats(eventId);
    currentHeats.forEach(h => {
        heatMap.set(h.round_number + "-" + h.heat_number, h.id);
    });

    let currentRound = 1;

    for (const row of records) {
        const text = (row[0] || '').toString().toUpperCase();
        if (text.includes('OPENING ROUND')) { currentRound = 1; continue; }
        if (text === 'HEAT' || text === 'ROUND') continue;

        const heatStr = row[0]?.toString() || '';
        const surferName = row[1]?.toString().trim();
        const countryCode = row[2]?.toString().trim();

        if (!surferName) continue;

        const heatNumMatch = heatStr.match(/(\d+)/);
        const heatNum = heatNumMatch ? parseInt(heatNumMatch[0]) : 1;

        const heatKey = currentRound + "-" + heatNum;
        let heatId = heatMap.get(heatKey);

        if (!heatId) {
            console.log("Creating heat", currentRound, heatNum);
            const newHeat = await createHeat(eventId, currentRound, heatNum);
            if (newHeat) {
                heatId = newHeat.id;
                heatMap.set(heatKey, heatId);
            }
        }

        if (heatId) {
            console.log("Got Heat ID", heatId);
            const { data: surfer } = await getOrCreateSurfer(surferName, countryCode);
            if (surfer) {
                console.log("Got Surfer ID", surfer.id);
                const { error: assignErr } = await createHeatAssignment(heatId, surfer.id);
                if (assignErr) {
                    console.error("Assign error", assignErr.message);
                }

                // ---- SCORE PARSING BLOCK ----
                console.log("Row score value:", row[3]);
                if (row[3]) {
                    const score = parseFloat(row[3]);
                    console.log("Parsed score:", score);
                    if (!isNaN(score)) {
                        console.log("Upserting Score: ", score, " for ", surferName);
                        try {
                            const res = await submitWaveScore(heatId, surfer.id, score);
                            console.log("Score inserted", res);
                        } catch (e) {
                            console.error("Error inserting score:", e);
                        }
                    }
                }
                // -----------------------------
            }
        }
    }

    console.log("Done!");
    process.exit(0);
};

testImport().catch(console.error);
