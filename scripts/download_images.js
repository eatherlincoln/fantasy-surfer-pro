
import fs from 'fs';
import path from 'path';
import { https } from 'follow-redirects';
import { FULL_MOCK_SURFERS } from '../fullMockData.js'; // Note: .js extension for node execution if needed, or I'll just regex it.

// Actually, I can't easily import TS in a node script without setup.
// I'll regex the file for simplicity and robustness.
const downloadImages = async () => {
    const content = fs.readFileSync('fullMockData.ts', 'utf8');
    const regex = /id:\s*'([^']+)',.*?image:\s*'([^']+)'/g;
    let match;

    const downloadDir = path.join(process.cwd(), 'public', 'images', 'surfers');
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
    }

    while ((match = regex.exec(content)) !== null) {
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
                });
            }).on('error', function (err) {
                fs.unlink(dest);
                console.error(`Error downloading ${id}: ${err.message}`);
            });
        }
    }
};

downloadImages();
