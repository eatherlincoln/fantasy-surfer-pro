
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const normalizedNames = [
  { old: 'Cole Houshmand', new: 'Cole Houshman' },
  { old: 'Ramzi Boukhiam', new: 'Ramzi Boukhaim' },
  { old: 'Liam O\'Brien', new: 'Liam O\'Brien' }, // Ensure apostrophes are consistent
  { old: 'Connor O\'Leary', new: 'Connor O\'Leary' }
];

async function updateHeats() {
  console.log("--- Updating Heat Draws with Normalized Names ---");

  const { data: event } = await supabase
    .from('events')
    .select('id')
    .eq('slug', 'bells-beach-2026')
    .single();

  if (!event) {
    console.error("Event not found!");
    return;
  }

  const heatDraw = {
    round1: [
      { heat: 1, surfers: ['Mateus Herdy', 'Liam O\'Brien'] },
      { heat: 2, surfers: ['Oscar Berry', 'Ramzi Boukhaim'] },
      { heat: 3, surfers: ['Luke Thompson', 'Dane Henry'] },
      { heat: 4, surfers: ['Callum Robson', 'Wildcard'] }
    ],
    round2: [
      { heat: 1, surfers: ['Miguel Pupo', 'Joel Vaughan'] },
      { heat: 2, surfers: ['Barron Mamiya', 'Seth Moniz'] },
      { heat: 4, surfers: ['Ethan Ewing', 'George Pittar'] },
      { heat: 5, surfers: ['Jake Marshall', 'Joao Chianca'] },
      { heat: 7, surfers: ['Cole Houshman', 'Alejo Muniz'] },
      { heat: 8, surfers: ['Kanoa Igarashi', 'Morgan Cibilic'] },
      { heat: 10, surfers: ['Crosby Colapinto', 'Marco Mignot'] },
      { heat: 11, surfers: ['Leonardo Fioravanti', 'Kauli Vaast'] },
      { heat: 12, surfers: ['Filipe Toledo', 'Eli Hannerman'] },
      { heat: 14, surfers: ['Gabriel Medina', 'Alan Cleland'] },
      { heat: 15, surfers: ['Connor O\'Leary', 'Rio Waida'] },
      { heat: 16, surfers: ['Jack Robinson', 'Samuel Pupo'] }
    ]
  };

  for (const round of [1, 2]) {
    const roundHeats = round === 1 ? heatDraw.round1 : heatDraw.round2;
    for (const h of roundHeats) {
      const { data: heat } = await supabase
        .from('heats')
        .select('id')
        .eq('event_id', event.id)
        .eq('round_number', round)
        .eq('heat_number', h.heat)
        .single();
      
      if (heat) {
        // Clear existing assignments for this heat to avoid duplicates or old names
        await supabase.from('heat_assignments').delete().eq('heat_id', heat.id);
        
        for (const sName of h.surfers) {
          const { data: surfer } = await supabase.from('surfers').select('id').ilike('name', sName).single();
          if (surfer) {
            console.log(`Linking ${sName} to Heat ${round}-${h.heat}`);
            await supabase.from('heat_assignments').insert({ heat_id: heat.id, surfer_id: surfer.id });
          } else {
            console.warn(`Surfer not found: ${sName}`);
          }
        }
      }
    }
  }

  console.log("--- Heat update complete ---");
}

updateHeats().catch(console.error);
