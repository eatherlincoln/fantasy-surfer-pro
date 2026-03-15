
import { createClient } from '@supabase/supabase-js';

const PROD_URL = 'https://irtlqpjyohydkcwbcgny.supabase.co';
const PROD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzA3MDM4NSwiZXhwIjoyMDgyNjQ2Mzg1fQ.bX0V6vbBQMucHPPZWNDx9Td8Pwt0_Zs0YrgVO6jDl80';
const supabase = createClient(PROD_URL, PROD_KEY);

async function checkRLS() {
    console.log("--- RLS Audit ---");
    
    // Check which tables have RLS enabled
    const { data: tables, error: tErr } = await supabase.rpc('get_rls_status');
    // If RPC doesn't exist, we can try to query or just use a known list
    
    // Let's just query the pg_policies directly via RPC if possible, 
    // or try a trick: query pg_catalog if we have permissions
    
    const { data: policies, error: pErr } = await supabase.from('pg_policies').select('*').catch(e => ({error: e}));
    
    // Since we usually can't query pg_catalog via standard client even with service_role 
    // unless explicitly exposed, let's try to query the tables as 'anon' to see what happens.
    
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydGxxcGp5b2h5ZGtjd2JjZ255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNzAzODUsImV4cCI6MjA4MjY0NjM4NX0.O1nLhG3y2NfN4v6LzY3zN6P3mN3k7zN6P3mN3k7zN6P'; 
    // Wait, I should get the actual anon key from .env.local
}

// Better yet, let's just use the migrations as the source of truth for "design intent" 
// and then use the service role to check actual data visibility.

async function auditData() {
    const tables = ['profiles', 'user_teams', 'surfers', 'leagues', 'league_members', 'events', 'heats', 'heat_assignments', 'scores'];
    
    console.log("Checking table RLS and potential data leaks...");
    
    for (const table of tables) {
        console.log(`\nTable: ${table}`);
        // 1. Try to fetch one row
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.log(`  Error fetching ${table}: ${error.message}`);
        } else {
            console.log(`  Successfully fetched from ${table}. Sample:`, data[0] ? "Found row" : "Empty");
        }
    }
}

auditData().catch(console.error);
