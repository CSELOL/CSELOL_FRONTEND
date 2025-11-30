import { createClient } from '@supabase/supabase-js';

// You get these from your Supabase Dashboard -> Project Settings -> API
// Ensure you use the "ANON" (Public) key, NOT the service_role key.
const SUPABASE_URL = 'https://mwwmqemjugziqnvvxfoa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13d21xZW1qdWd6aXFudnZ4Zm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0NDczMjksImV4cCI6MjA4MDAyMzMyOX0.rXXOx4UjLWU8YknwNZ9b2sFZNfAu4C5woljJSqWqarU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);