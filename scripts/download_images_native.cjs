
const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directory
const downloadDir = path.join(process.cwd(), 'public', 'images', 'surfers');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

// Read fullMockData.ts and extract ID/Image pairs
const content = fs.readFileSync('fullMockData.ts', 'utf8');
const standardRegex = /{ id: '([^']+)',.*?image: '([^']+)'/g;

let match;
while ((match = standardRegex.exec(content)) !== null) {
    const id = match[1];
    const url = match[2];

    if (url.includes('supabase')) {
        const dest = path.join(downloadDir, `${id}.png`);
        console.log(`Downloading ${id}...`);

        const file = fs.createWriteStream(dest);
        https.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close();
                console.log(`Saved ${id}.png`);
            });
        }).on('error', function (err) {
            fs.unlink(dest);
            console.error(`Error downloading ${id}: ${err.message}`);
        });
    } else {
        console.log(`Skipping ${id} (not supabase URL)`);
    }
}
