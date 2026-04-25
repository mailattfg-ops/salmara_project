
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables missing.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSettings() {
    console.log("Checking for 'settings' table...");
    const { data, error } = await supabase.from('settings').select('*');
    if (error) {
        console.error("Settings table error:", error.message);
    } else {
        console.log("Settings table data:", data);
    }

    console.log("Checking for 'admin_settings' table...");
    const { data: data2, error: error2 } = await supabase.from('admin_settings').select('*');
    if (error2) {
        console.error("Admin settings table error:", error2.message);
    } else {
        console.log("Admin settings table data:", data2);
    }
}

checkSettings();
