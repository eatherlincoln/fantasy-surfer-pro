import { createEvent, getEvents, uploadEventImage, getOrCreateSurfer, createHeatAssignment, createHeat } from './services/adminService';
import fs from 'fs';
import path from 'path';

async function runTest() {
    console.log('--- Starting Admin Upload Test ---');

    try {
        // 1. Test Event Header Upload (using a dummy file)
        console.log('1. Testing Storage Upload...');
        const dummyHtml = new File(['<html><body>test</body></html>'], 'test.html', { type: 'text/html' });
        try {
            const url = await uploadEventImage(dummyHtml);
            console.log('Upload Success!', url);
        } catch (e: any) {
            console.error('Upload Error:', e.message || e);
        }

        // 2. Fetch Events
        let events = await getEvents();
        if (!events.length) {
            console.log('2. No events found, creating dummy event...');
            await createEvent('Test Event', 'test-event-1', new Date().toISOString(), new Date().toISOString());
            events = await getEvents();
        }
        const event = events[0];
        console.log('Event used for tests:', event.name);

        // 3. Create Heat & Heat Assignment
        console.log('3. Testing Heat Assignment...');
        const heat = await createHeat(event.id, 10, 10);
        if (!heat) {
            console.error('Failed to create heat');
            return;
        }
        const { data: surfer, error: surferErr } = await getOrCreateSurfer('Test Surfer', 'USA');
        if (surferErr) {
            console.error('Surfer Create Error:', surferErr);
        } else if (surfer) {
            const { error: assignErr } = await createHeatAssignment(heat.id, surfer.id);
            if (assignErr) {
                console.error('Heat Assignment Error:', assignErr);
            } else {
                console.log('Heat Assignment Success!');
            }
        }
    } catch (err) {
        console.error('Fatal crash:', err);
    }
}

runTest();
