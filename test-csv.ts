import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import { supabase } from './services/supabase';
import {
    createHeat, getHeats, getOrCreateSurfer,
    createHeatAssignment, submitWaveScore, advanceSurfer, eliminateSurfer
} from './services/adminService';

const mockCsv = `OPENING ROUND
Heat 1,Igor Moraes,BRA,14.50
Heat 1,Dakoda Walters,AUS,12.33
Heat 1,Mihimana Braye,PYF,10.00
Heat 1,Dom Thomas,AUS,8.50`;

const testImport = async () => {
    console.log("Starting CSV Import Test...");

    // We'll use the first event ID we can find
    const { data: events } = await supabase.from('events').select('id').limit(1);
    const eventId = events[0].id;

    const records = parse(mockCsv, {
        skip_empty_lines: true,
        relax_column_count: true
    });

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
            const newHeat = await createHeat(eventId, currentRound, heatNum);
            heatId = newHeat.id;
            heatMap.set(heatKey, heatId);
        }

        if (heatId) {
            const { data: surfer } = await getOrCreateSurfer(surferName, countryCode);
            if (surfer) {
                await createHeatAssignment(heatId, surfer.id);

                // ---- SCORE PARSING BLOCK ----
                if (row[3]) {
                    const score = parseFloat(row[3]);
                    if (!isNaN(score)) {
                        console.log("Upserting Score: ", score, " for ", surferName);
                        await submitWaveScore(heatId, surfer.id, score);
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
