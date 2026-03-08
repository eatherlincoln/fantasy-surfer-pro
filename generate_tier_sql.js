import fs from 'fs';

const TIER_MAPPINGS = {
    // TIER A
    "Samuel Pupo": "A", "Bronson Meydi": "A", "Jorgann Couzinet": "A", "Winter Vincent": "A", "Imaikalani deVault": "A",
    "Luke Thompson": "A", "Mateus Herdy": "A", "Liam O'Brien": "A", "Jordan Lawler": "A", "Eli Hanneman": "A",
    "Ian Gentil": "A", "Kauli Vaast": "A", "Ryan Callinan": "A", "Levi Slawson": "A", "Morgan Cibilic": "A",
    "Jacob Willcox": "A", "Oscar Berry": "A", "Callum Robson": "A", "Jackson Bunch": "A", "Dimitri Poulos": "A",
    "George Pittar": "A",

    // TIER B
    "Shohei Kato": "B", "Hiroto Ohhara": "B", "Ryan Huckabee": "B", "Michael Rodrigues": "B", "Lucca Mesinas": "B",
    "Carlos Munoz": "B", "Adur Amatriain": "B", "Edgard Groggia": "B", "Nolan Rapoza": "B", "Finn McGill": "B",
    "Xavier Huxtable": "B", "Oliver Zietz": "B", "Riaru Ito": "B", "Kyuss King": "B", "Kade Matson": "B",
    "Billy Stairmand": "B", "Lucas Vicente": "B", "Franco Radziunas": "B", "Shion Crawford": "B", "Keoni Lasa": "B",
    "Mikey McDonagh": "B", "Charly Quivront": "B", "Keijiro Nishi": "B", "Taro Watanabe": "B", "Lucas Cassity": "B",
    "Lucas Silveira": "B", "Jackson Baker": "B",

    // TIER C
    "Igor Moraes": "C", "Dakoda Walters": "C", "Mihimana Braye": "C", "Dom Thomas": "C", "Luke Swanson": "C",
    "Tenshi Iwami": "C", "Lennix Smith": "C", "Caleb Tancred": "C", "Dylan Moffat": "C", "Daiki Tanaka": "C",
    "Rylan Beavers": "C", "Eden Hasson": "C", "Maxime Huscenot": "C", "Alister Reginato": "C", "Taj Stokes": "C",
    "Willem Watson": "C", "Jarvis Earle": "C", "Julian Wilson": "C", "Makana Franzmann": "C", "Ocean Lancaster": "C",
    "Joh Azuchi": "C", "Rafael Teixeira": "C", "Reef Heazlewood": "C", "Harley Walters": "C", "Luke Tema": "C",
    "Jose Francisco": "C", "Slade Prestwich": "C", "Oliver Ryssenbeek": "C", "Justin Becret": "C", "Tully Wylie": "C",
    "Hayden Rodgers": "C", "Ben Lorentson": "C"
};

let sql = `-- Migration to set Correct Tiers and Simulated Values for Live Database\n\n`;

for (const [name, tier] of Object.entries(TIER_MAPPINGS)) {
    let value = 1.0;
    if (tier === 'A') {
        value = Number((Math.random() * (11.0 - 8.0) + 8.0).toFixed(1)); // 8.0 to 11.0M
    } else if (tier === 'B') {
        value = Number((Math.random() * (7.5 - 4.5) + 4.5).toFixed(1)); // 4.5 to 7.5M
    } else if (tier === 'C') {
        value = Number((Math.random() * (4.0 - 1.0) + 1.0).toFixed(1)); // 1.0 to 4.0M
    }

    // Escape single quotes for SQL (e.g., Liam O'Brien -> Liam O''Brien)
    const escapedName = name.replace(/'/g, "''");

    sql += `UPDATE public.surfers SET tier = '${tier}', value = ${value} WHERE name = '${escapedName}';\n`;
}

// Generate the proper migration file format based on timestamp
const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
const filename = `supabase/migrations/${timestamp}_update_live_tiers.sql`;

fs.writeFileSync(filename, sql);
console.log(`Generated migration file: ${filename}`);
