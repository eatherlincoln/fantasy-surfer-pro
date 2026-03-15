
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

const surfersData = [
  { name: 'Yago Dora', tier: 'A', country: 'Brazil', stance: 'Goofy' },
  { name: 'Griffin Colapinto', tier: 'A', country: 'USA', stance: 'Natural' },
  { name: 'Jordy Smith', tier: 'A', country: 'South Africa', stance: 'Natural' },
  { name: 'Italo Ferreira', tier: 'A', country: 'Brazil', stance: 'Goofy' },
  { name: 'Jack Robinson', tier: 'A', country: 'Australia', stance: 'Natural' },
  { name: 'Ethan Ewing', tier: 'A', country: 'Australia', stance: 'Natural' },
  { name: 'Kanoa Igarashi', tier: 'A', country: 'Japan', stance: 'Natural' },
  { name: 'Filipe Toledo', tier: 'A', country: 'Brazil', stance: 'Natural' },
  { name: 'Leonardo Fioravanti', tier: 'A', country: 'Italy', stance: 'Natural' },
  { name: 'Cole Houshmand', tier: 'A', country: 'USA', stance: 'Goofy' },
  { name: 'Barron Mamiya', tier: 'B', country: 'Hawaii', stance: 'Natural' },
  { name: 'Connor O\'Leary', tier: 'B', country: 'Japan', stance: 'Goofy' },
  { name: 'Miguel Pupo', tier: 'B', country: 'Brazil', stance: 'Goofy' },
  { name: 'Jake Marshall', tier: 'B', country: 'USA', stance: 'Natural' },
  { name: 'Crosby Colapinto', tier: 'B', country: 'USA', stance: 'Natural' },
  { name: 'Marco Mignot', tier: 'B', country: 'France', stance: 'Natural' },
  { name: 'Joao Chianca', tier: 'B', country: 'Brazil', stance: 'Natural' },
  { name: 'Joel Vaughan', tier: 'B', country: 'Australia', stance: 'Natural' },
  { name: 'Alan Cleland', tier: 'B', country: 'Mexico', stance: 'Natural' },
  { name: 'Rio Waida', tier: 'B', country: 'Indonesia', stance: 'Natural' },
  { name: 'Seth Moniz', tier: 'B', country: 'Hawaii', stance: 'Natural' },
  { name: 'Alejo Muniz', tier: 'B', country: 'Brazil', stance: 'Natural' },
  { name: 'Kauli Vaast', tier: 'B', country: 'France', stance: 'Goofy' },
  { name: 'Eli Hannerman', tier: 'B', country: 'Hawaii', stance: 'Natural' },
  { name: 'Morgan Cibilic', tier: 'B', country: 'Australia', stance: 'Natural' },
  { name: 'George Pittar', tier: 'B', country: 'Australia', stance: 'Natural' },
  { name: 'Samuel Pupo', tier: 'C', country: 'Brazil', stance: 'Natural' },
  { name: 'Callum Robson', tier: 'C', country: 'Australia', stance: 'Natural' },
  { name: 'Luke Thompson', tier: 'C', country: 'South Africa', stance: 'Natural' },
  { name: 'Oscar Berry', tier: 'C', country: 'Australia', stance: 'Natural' },
  { name: 'Mateus Herdy', tier: 'C', country: 'Brazil', stance: 'Natural' },
  { name: 'Liam O\'Brien', tier: 'C', country: 'Australia', stance: 'Natural' },
  { name: 'Wildcard', tier: 'C', country: 'na', stance: 'na' },
  { name: 'Ramzi Boukhiam', tier: 'B', country: 'Morocco', stance: 'Natural' }, // Based on R1 photo
  { name: 'Dane Henry', tier: 'C', country: 'Australia', stance: 'Natural' }, // Based on R1 photo
  { name: 'Gabriel Medina', tier: 'A', country: 'Brazil', stance: 'Goofy' } // High tier traditionally
];

const heatDraw = {
  round1: [
    { heat: 1, surfers: ['Mateus Herdy', 'Liam O\'Brien'] },
    { heat: 2, surfers: ['Oscar Berry', 'Ramzi Boukhiam'] },
    { heat: 3, surfers: ['Luke Thompson', 'Dane Henry'] },
    { heat: 4, surfers: ['Callum Robson', 'Wildcard'] }
  ],
  round2: [
    { heat: 1, surfers: ['Miguel Pupo', 'Joel Vaughan'] },
    { heat: 2, surfers: ['Barron Mamiya', 'Seth Moniz'] },
    { heat: 3, surfers: ['Jordy Smith'] }, // Slot for R1 Heat 3 Winner
    { heat: 4, surfers: ['Ethan Ewing', 'George Pittar'] },
    { heat: 5, surfers: ['Jake Marshall', 'Joao Chianca'] },
    { heat: 6, surfers: ['Griffin Colapinto'] }, // Slot for R1 Heat 2 Winner
    { heat: 7, surfers: ['Cole Houshmand', 'Alejo Muniz'] },
    { heat: 8, surfers: ['Kanoa Igarashi', 'Morgan Cibilic'] },
    { heat: 9, surfers: ['Yago Dora'] }, // Slot for R1 Heat 1 Winner
    { heat: 10, surfers: ['Crosby Colapinto', 'Marco Mignot'] },
    { heat: 11, surfers: ['Leonardo Fioravanti', 'Kauli Vaast'] },
    { heat: 12, surfers: ['Filipe Toledo', 'Eli Hannerman'] },
    { heat: 13, surfers: ['Italo Ferreira'] }, // Slot for R1 Heat 4 Winner
    { heat: 14, surfers: ['Gabriel Medina', 'Alan Cleland'] },
    { heat: 15, surfers: ['Connor O\'Leary', 'Rio Waida'] },
    { heat: 16, surfers: ['Jack Robinson', 'Samuel Pupo'] }
  ]
};

async function setup() {
  console.log("--- Starting Bells Beach Setup ---");

  // 1. Create Event
  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert({
      name: 'Rip Curl Pro Bells Beach',
      slug: 'bells-beach-2026',
      status: 'UPCOMING',
      start_date: '2026-03-26T00:00:00Z',
      end_date: '2026-04-05T00:00:00Z',
      location: 'Bells Beach, Victoria, Australia',
      swell_height: '6-8ft',
      swell_status: 'Building ENE Swell',
      conditions: 'Classic clean Bells lines. Light offshore.',
      header_image: 'https://irtlqpjyohydkcwbcgny.supabase.co/storage/v1/object/public/event-headers/bells-beach-banner.jpg'
    })
    .select()
    .single();

  if (eventError) {
    console.error("Error creating event:", eventError);
    return;
  }
  console.log("Event created:", event.id);

  // 2. Update Surfers
  console.log("Updating surfers...");
  for (const s of surfersData) {
    const { data: existing } = await supabase
      .from('surfers')
      .select('id')
      .ilike('name', s.name)
      .single();

    if (existing) {
      await supabase
        .from('surfers')
        .update({
          tier: s.tier,
          country: s.country,
          stance: s.stance,
          status: 'ACTIVE' // Reset all to active for new event
        })
        .eq('id', existing.id);
    } else {
      // Create new surfer if missing
      await supabase
        .from('surfers')
        .insert({
          name: s.name,
          tier: s.tier,
          country: s.country,
          stance: s.stance,
          status: 'ACTIVE',
          gender: 'Male',
          value: s.tier === 'A' ? 10.0 : s.tier === 'B' ? 7.5 : 5.0,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`
        });
    }
  }

  // 3. Create Heats and Assignments
  console.log("Setting up heats...");
  
  // Helper to find surfer by name
  async function getSurferId(name: string) {
    const { data } = await supabase.from('surfers').select('id').ilike('name', name).single();
    return data?.id;
  }

  // Round 1
  for (const h of heatDraw.round1) {
    const { data: heat } = await supabase
      .from('heats')
      .insert({ event_id: event.id, round_number: 1, heat_number: h.heat, status: 'UPCOMING' })
      .select()
      .single();
    
    if (heat) {
      for (const sName of h.surfers) {
        const id = await getSurferId(sName);
        if (id) {
          await supabase.from('heat_assignments').insert({ heat_id: heat.id, surfer_id: id });
        }
      }
    }
  }

  // Round 2
  for (const h of heatDraw.round2) {
    const { data: heat } = await supabase
      .from('heats')
      .insert({ event_id: event.id, round_number: 2, heat_number: h.heat, status: 'UPCOMING' })
      .select()
      .single();
    
    if (heat) {
      for (const sName of h.surfers) {
        const id = await getSurferId(sName);
        if (id) {
          await supabase.from('heat_assignments').insert({ heat_id: heat.id, surfer_id: id });
        }
      }
    }
  }

  console.log("--- Bells Beach Setup Complete ---");
}

setup().catch(console.error);
