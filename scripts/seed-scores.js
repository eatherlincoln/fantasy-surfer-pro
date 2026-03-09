import { supabase } from './services/supabase.js';

const heats = [
    { heat: 1, surfer: 'Igor Moraes', score: 8.40, status: 'ELIMINATED' },
    { heat: 1, surfer: 'Dakoda Walters', score: 13.07, status: 'ACTIVE' },
    { heat: 1, surfer: 'Mihimana Braye', score: 11.44, status: 'ACTIVE' },
    { heat: 1, surfer: 'Dom Thomas', score: 11.27, status: 'ELIMINATED' },
    { heat: 2, surfer: 'Luke Swanson', score: 9.50, status: 'ELIMINATED' },
    { heat: 2, surfer: 'Tenshi Iwami', score: 10.03, status: 'ELIMINATED' },
    { heat: 2, surfer: 'Lennix Smith', score: 11.34, status: 'ACTIVE' },
    { heat: 2, surfer: 'Caleb Tancred', score: 14.07, status: 'ACTIVE' },
    { heat: 3, surfer: 'Dylan Moffat', score: 9.27, status: 'ACTIVE' },
    { heat: 3, surfer: 'Daiki Tanaka', score: 7.96, status: 'ELIMINATED' },
    { heat: 3, surfer: 'Rylan Beavers', score: 9.00, status: 'ELIMINATED' },
    { heat: 3, surfer: 'Eden Hasson', score: 9.37, status: 'ACTIVE' },
    { heat: 4, surfer: 'Maxime Huscenot', score: 7.57, status: 'ELIMINATED' },
    { heat: 4, surfer: 'Alister Reginato', score: 13.84, status: 'ACTIVE' },
    { heat: 4, surfer: 'Taj Stokes', score: 8.86, status: 'ELIMINATED' },
    { heat: 4, surfer: 'Willem Watson', score: 10.40, status: 'ACTIVE' },
    { heat: 5, surfer: 'Jarvis Earle', score: 7.20, status: 'ELIMINATED' },
    { heat: 5, surfer: 'Julian Wilson', score: 7.84, status: 'ELIMINATED' },
    { heat: 5, surfer: 'Makana Franzmann', score: 10.06, status: 'ACTIVE' },
    { heat: 5, surfer: 'Ocean Lancaster', score: 11.17, status: 'ACTIVE' },
    { heat: 6, surfer: 'Joh Azuchi', score: 9.70, status: 'ELIMINATED' },
    { heat: 6, surfer: 'Rafael Teixeira', score: 10.34, status: 'ACTIVE' },
    { heat: 6, surfer: 'Reef Heazlewood', score: 14.50, status: 'ACTIVE' },
    { heat: 6, surfer: 'Harley Walters', score: 6.17, status: 'ELIMINATED' },
    { heat: 7, surfer: 'Luke Tema', score: 8.10, status: 'ELIMINATED' },
    { heat: 7, surfer: 'Jose Francisco', score: 8.83, status: 'ACTIVE' },
    { heat: 7, surfer: 'Slade Prestwich', score: 8.17, status: 'ACTIVE' },
    { heat: 7, surfer: 'Oliver Ryssenbeek', score: 5.04, status: 'ELIMINATED' },
    { heat: 8, surfer: 'Justin Becret', score: 7.70, status: 'ELIMINATED' },
    { heat: 8, surfer: 'Tully Wylie', score: 5.20, status: 'ELIMINATED' },
    { heat: 8, surfer: 'Hayden Rodgers', score: 14.23, status: 'ACTIVE' },
    { heat: 8, surfer: 'Ben Lorentson', score: 12.03, status: 'ACTIVE' }
];

async function run() {
    const { data: events } = await supabase.from('events').select('id').limit(1);
    const eventId = events[0].id;

    const { data: dbHeats } = await supabase.from('heats').select('*').eq('event_id', eventId).eq('round_number', 1);
    const heatMap = new Map();
    dbHeats.forEach(h => heatMap.set(h.heat_number, h.id));

    const { data: surfers } = await supabase.from('surfers').select('id, name');
    const surferMap = new Map();
    surfers.forEach(s => surferMap.set(s.name, s.id));

    for (const h of heats) {
        const heatId = heatMap.get(h.heat);
        const surferId = surferMap.get(h.surfer);

        if (!heatId || !surferId) {
            console.log("Missing", h.surfer);
            continue;
        }

        console.log(\`Inserting \${h.score} for \${h.surfer}\`);
    
    const { error: scoreErr } = await supabase.from('scores').insert({
      heat_id: heatId,
      surfer_id: surferId,
      wave_score: h.score
    });
    
    if (scoreErr) console.error(scoreErr);

    const { error: surfErr } = await supabase.from('surfers').update({
        points: h.score,
        status: h.status
    }).eq('id', surferId);
    
    if (surfErr) console.error(surfErr);
  }
}

run().catch(console.error);
