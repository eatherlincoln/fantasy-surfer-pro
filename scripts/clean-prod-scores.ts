
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const EVENT_ID = '81bcf839-162d-4d7a-a4c1-3b0edf30e68b';

async function cleanProductionScores() {
    console.log('--- CLEANING PRODUCTION SCORES ---');

    // 1. Get Round 1 Heats
    const { data: r1Heats } = await supabase.from('heats').select('id, heat_number').eq('event_id', EVENT_ID).eq('round_number', 1);

    for (const heat of r1Heats || []) {
        console.log(`Cleaning Heat ${heat.heat_number}...`);

        // Fetch all scores for this heat
        const { data: scores } = await supabase.from('scores').select('*').eq('heat_id', heat.id);

        // Identify unique scores (per surfer, we want all their waves but only once)
        // Actually, in Round 1, it seems each surfer just has ONE total score already and it was duplicated?
        // Let's look at the scores I fetched earlier:
        // Dakoda Walters 13.07, 13.07
        // Mihimana Braye 11.44

        const uniqueScores = new Map<string, any>();
        scores?.forEach(s => {
            const key = `${s.surfer_id}-${s.wave_score}`;
            if (!uniqueScores.has(key)) {
                uniqueScores.set(key, { heat_id: s.heat_id, surfer_id: s.surfer_id, wave_score: s.wave_score });
            }
        });

        // Delete all scores for this heat
        await supabase.from('scores').delete().eq('heat_id', heat.id);

        // Re-insert unique ones
        const toInsert = Array.from(uniqueScores.values());
        if (toInsert.length > 0) {
            await supabase.from('scores').insert(toInsert);
        }
        console.log(`  Inserted ${toInsert.length} unique scores.`);
    }

    console.log('--- CLEANUP SUCCESSFUL ---');
}

cleanProductionScores().catch(console.error);
