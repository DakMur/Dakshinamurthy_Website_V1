import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

async function checkTeams() {
  const { data, error } = await supabase.from('teams').select('*').limit(1);
  console.log('Teams Data:', data);
  console.log('Teams Error:', error);
}

checkTeams();
