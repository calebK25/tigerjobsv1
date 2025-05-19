
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sapqzpssmxsfctzlsbip.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhcHF6cHNzbXhzZmN0emxzYmlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMzU5MjAsImV4cCI6MjA2MDYxMTkyMH0.TgJ7dFg0TGSsLkYtTqvavzeJZyExb2n_pxRZQrK86Y8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
