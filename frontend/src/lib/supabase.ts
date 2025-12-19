import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gvcghnvglrkatbmcqeoz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2Y2dobnZnbHJrYXRibWNxZW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMzIwNDYsImV4cCI6MjA4MTcwODA0Nn0.ys4sLvwBQmgjhZRlHB2hdAUgDkgPLsb1ritWrEZmso8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
