
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const maleSurfers = [
    { name: 'John John Florence', country: 'HAW', flag: '🇺🇸', stance: 'Regular', age: 31, value: 10.0, tier: 'A', image: 'https://placehold.co/400x400/png?text=JJF' },
    { name: 'Griffin Colapinto', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 25, value: 9.5, tier: 'A', image: 'https://placehold.co/400x400/png?text=Griffin' },
    { name: 'Jack Robinson', country: 'AUS', flag: '🇦🇺', stance: 'Regular', age: 26, value: 9.0, tier: 'A', image: 'https://placehold.co/400x400/png?text=Jack' },
    { name: 'Ethan Ewing', country: 'AUS', flag: '🇦🇺', stance: 'Regular', age: 25, value: 8.5, tier: 'A', image: 'https://placehold.co/400x400/png?text=Ethan' },
    { name: 'Italo Ferreira', country: 'BRA', flag: '🇧🇷', stance: 'Goofy', age: 29, value: 8.0, tier: 'A', image: 'https://placehold.co/400x400/png?text=Italo' },
    // Tier B
    { name: 'Gabriel Medina', country: 'BRA', flag: '🇧🇷', stance: 'Goofy', age: 30, value: 7.5, tier: 'B', image: 'https://placehold.co/400x400/png?text=Gabe' },
    { name: 'Jordy Smith', country: 'RSA', flag: '🇿🇦', stance: 'Regular', age: 36, value: 7.0, tier: 'B', image: 'https://placehold.co/400x400/png?text=Jordy' },
    { name: 'Jake Marshall', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 25, value: 6.5, tier: 'B', image: 'https://placehold.co/400x400/png?text=Jake' },
    { name: 'Barron Mamiya', country: 'HAW', flag: '🇺🇸', stance: 'Regular', age: 24, value: 6.0, tier: 'B', image: 'https://placehold.co/400x400/png?text=Barron' },
    { name: 'Cole Houshmand', country: 'USA', flag: '🇺🇸', stance: 'Goofy', age: 23, value: 6.0, tier: 'B', image: 'https://placehold.co/400x400/png?text=Cole' },
    { name: 'Kanoa Igarashi', country: 'JPN', flag: '🇯🇵', stance: 'Regular', age: 26, value: 6.0, tier: 'B', image: 'https://placehold.co/400x400/png?text=Kanoa' },
    { name: 'Ryan Callinan', country: 'AUS', flag: '🇦🇺', stance: 'Goofy', age: 31, value: 5.5, tier: 'B', image: 'https://placehold.co/400x400/png?text=Ryan' },
    { name: 'Rio Waida', country: 'INA', flag: '🇮🇩', stance: 'Regular', age: 24, value: 5.5, tier: 'B', image: 'https://placehold.co/400x400/png?text=Rio' },
    { name: 'Liam O\'Brien', country: 'AUS', flag: '🇦🇺', stance: 'Regular', age: 24, value: 5.0, tier: 'B', image: 'https://placehold.co/400x400/png?text=Liam' },
    { name: 'Leonardo Fioravanti', country: 'ITA', flag: '🇮🇹', stance: 'Regular', age: 26, value: 5.0, tier: 'B', image: 'https://placehold.co/400x400/png?text=Leo' },
    // Tier C
    { name: 'Matthew McGillivray', country: 'RSA', flag: '🇿🇦', stance: 'Regular', age: 26, value: 4.5, tier: 'C', image: 'https://placehold.co/400x400/png?text=Matt' },
    { name: 'Connor O\'Leary', country: 'JPN', flag: '🇯🇵', stance: 'Goofy', age: 30, value: 4.5, tier: 'C', image: 'https://placehold.co/400x400/png?text=Connor' },
    { name: 'Yago Dora', country: 'BRA', flag: '🇧🇷', stance: 'Goofy', age: 27, value: 4.5, tier: 'C', image: 'https://placehold.co/400x400/png?text=Yago' },
    { name: 'Imaikalani deVault', country: 'HAW', flag: '🇺🇸', stance: 'Regular', age: 26, value: 4.0, tier: 'C', image: 'https://placehold.co/400x400/png?text=Imai' },
    { name: 'Seth Moniz', country: 'HAW', flag: '🇺🇸', stance: 'Regular', age: 26, value: 4.0, tier: 'C', image: 'https://placehold.co/400x400/png?text=Seth' },
    { name: 'Ramzi Boukhiam', country: 'MOR', flag: '🇲🇦', stance: 'Goofy', age: 30, value: 3.5, tier: 'C', image: 'https://placehold.co/400x400/png?text=Ramzi' },
    { name: 'Crosby Colapinto', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 22, value: 3.5, tier: 'C', image: 'https://placehold.co/400x400/png?text=Crosby' },
];

const femaleSurfers = [
    { name: 'Caitlin Simmers', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 18, value: 10.0, tier: 'A', image: 'https://placehold.co/400x400/png?text=Caity' },
    { name: 'Caroline Marks', country: 'USA', flag: '🇺🇸', stance: 'Goofy', age: 22, value: 9.5, tier: 'A', image: 'https://placehold.co/400x400/png?text=Caroline' },
    { name: 'Molly Picklum', country: 'AUS', flag: '🇦🇺', stance: 'Regular', age: 21, value: 9.0, tier: 'A', image: 'https://placehold.co/400x400/png?text=Molly' },
    // Tier B
    { name: 'Brisa Hennessy', country: 'CRC', flag: '🇨🇷', stance: 'Regular', age: 24, value: 7.5, tier: 'B', image: 'https://placehold.co/400x400/png?text=Brisa' },
    { name: 'Johanne Defay', country: 'FRA', flag: '🇫🇷', stance: 'Regular', age: 30, value: 7.0, tier: 'B', image: 'https://placehold.co/400x400/png?text=Johanne' },
    { name: 'Tatiana Weston-Webb', country: 'BRA', flag: '🇧🇷', stance: 'Goofy', age: 27, value: 6.5, tier: 'B', image: 'https://placehold.co/400x400/png?text=Tati' },
    { name: 'Tyler Wright', country: 'AUS', flag: '🇦🇺', stance: 'Regular', age: 29, value: 6.0, tier: 'B', image: 'https://placehold.co/400x400/png?text=Tyler' },
    { name: 'Luana Silva', country: 'BRA', flag: '🇧🇷', stance: 'Regular', age: 19, value: 5.5, tier: 'B', image: 'https://placehold.co/400x400/png?text=Luana' },
    // Tier C
    { name: 'Lakey Peterson', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 29, value: 4.5, tier: 'C', image: 'https://placehold.co/400x400/png?text=Lakey' },
    { name: 'Sawyer Lindblad', country: 'USA', flag: '🇺🇸', stance: 'Regular', age: 18, value: 4.0, tier: 'C', image: 'https://placehold.co/400x400/png?text=Sawyer' },
];

async function seed() {
    console.log('Clearing existing surfers...');
    // WARNING: This deletes all data
    await supabase.from('surfers').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Seeding Male Surfers...');
    const { error: menError } = await supabase.from('surfers').insert(maleSurfers);
    if (menError) console.error('Error seeding men:', menError);

    console.log('Seeding Female Surfers...');
    const { error: womenError } = await supabase.from('surfers').insert(femaleSurfers);
    if (womenError) console.error('Error seeding women:', womenError);

    // Verify
    const { count } = await supabase.from('surfers').select('*', { count: 'exact' });
    console.log(`\nSuccess! Database now has ${count} surfers.`);
}

seed().catch(console.error);
