import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Use Service Role Key in production for deletes!

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const surfers = [
    // --- MEN ---
    { name: 'John John Florence', country: 'HAW', flag: '🇺🇸', stance: 'Regular', age: 31, value: 10.0, tier: 'A', gender: 'Male', image: 'https://ui-avatars.com/api/?name=John+John+Florence&background=random' },
    { name: 'Jack Robinson', country: 'AUS', flag: '🇦🇺', stance: 'Regular', age: 26, value: 9.5, tier: 'A', gender: 'Male', image: 'https://ui-avatars.com/api/?name=Jack+Robinson&background=random' },
    { name: 'Griffin Colapinto', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 25, value: 9.0, tier: 'A', gender: 'Male', image: 'https://ui-avatars.com/api/?name=Griffin+Colapinto&background=random' },
    { name: 'Ethan Ewing', country: 'AUS', flag: '🇦🇺', stance: 'Regular', age: 25, value: 8.5, tier: 'A', gender: 'Male', image: 'https://ui-avatars.com/api/?name=Ethan+Ewing&background=random' },
    { name: 'Gabriel Medina', country: 'BRA', flag: '🇧🇷', stance: 'Goofy', age: 30, value: 8.0, tier: 'B', gender: 'Male', image: 'https://ui-avatars.com/api/?name=Gabriel+Medina&background=random' },
    { name: 'Italo Ferreira', country: 'BRA', flag: '🇧🇷', stance: 'Goofy', age: 29, value: 7.5, tier: 'B', gender: 'Male', image: 'https://ui-avatars.com/api/?name=Italo+Ferreira&background=random' },
    { name: 'Jordy Smith', country: 'RSA', flag: '🇿🇦', stance: 'Regular', age: 36, value: 7.0, tier: 'B', gender: 'Male', image: 'https://ui-avatars.com/api/?name=Jordy+Smith&background=random' },
    { name: 'Kanoa Igarashi', country: 'JPN', flag: '🇯🇵', stance: 'Regular', age: 26, value: 6.5, tier: 'B', gender: 'Male', image: 'https://ui-avatars.com/api/?name=Kanoa+Igarashi&background=random' },
    { name: 'Kelly Slater', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 52, value: 5.0, tier: 'C', gender: 'Male', image: 'https://ui-avatars.com/api/?name=Kelly+Slater&background=random' },

    // --- WOMEN ---
    { name: 'Caitlin Simmers', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 18, value: 10.0, tier: 'A', gender: 'Female', image: 'https://ui-avatars.com/api/?name=Caity+Simmers&background=random' },
    { name: 'Caroline Marks', country: 'USA', flag: '🇺🇸', stance: 'Goofy', age: 22, value: 9.5, tier: 'A', gender: 'Female', image: 'https://ui-avatars.com/api/?name=Caroline+Marks&background=random' },
    { name: 'Molly Picklum', country: 'AUS', flag: '🇦🇺', stance: 'Regular', age: 21, value: 9.0, tier: 'A', gender: 'Female', image: 'https://ui-avatars.com/api/?name=Molly+Picklum&background=random' },
    { name: 'Tyler Wright', country: 'AUS', flag: '🇦🇺', stance: 'Regular', age: 29, value: 8.0, tier: 'B', gender: 'Female', image: 'https://ui-avatars.com/api/?name=Tyler+Wright&background=random' },
    { name: 'Stephanie Gilmore', country: 'AUS', flag: '🇦🇺', stance: 'Regular', age: 36, value: 7.5, tier: 'B', gender: 'Female', image: 'https://ui-avatars.com/api/?name=Steph+Gilmore&background=random' },
];

async function seed() {
    console.log('🌊 Starting Seeding Process...');

    // 1. Clear Surfers
    console.log('Cleaning old data...');
    await supabase.from('scores').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('heats').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('surfers').delete().neq('id', 0); // BigInt ID 0

    // 2. Insert Surfers
    console.log('Inserting Surfers...');
    const { error: surferError } = await supabase.from('surfers').insert(surfers);
    if (surferError) throw surferError;

    // 3. Create Event
    console.log('Creating Event: Lexus Pipe Pro...');
    const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
            name: 'Lexus Pipe Pro',
            slug: 'lexus-pipe-pro-2024',
            status: 'UPCOMING',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

    if (eventError) throw eventError;

    // 4. Create Heats (Round 1)
    console.log('Creating Heats...');
    const heats = [
        { event_id: event.id, round_number: 1, heat_number: 1, status: 'UPCOMING' },
        { event_id: event.id, round_number: 1, heat_number: 2, status: 'UPCOMING' },
        { event_id: event.id, round_number: 1, heat_number: 3, status: 'UPCOMING' },
    ];

    const { error: heatError } = await supabase.from('heats').insert(heats);
    if (heatError) throw heatError;

    console.log('✅ Seeding Complete!');
}

seed().catch(e => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
});
