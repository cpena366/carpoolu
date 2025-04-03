import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://xrmamhybcslbecdtuohx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybWFtaHliY3NsYmVjZHR1b2h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2NzkxNzMsImV4cCI6MjA1NTI1NTE3M30.8bkZekxnjYnczjyCHc_l5l4X-tEEVyrAD6OQELJhVdw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);