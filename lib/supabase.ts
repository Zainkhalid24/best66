import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '';

if (!supabaseUrl || !supabaseKey) {
  const missing = [
    !supabaseUrl ? 'EXPO_PUBLIC_SUPABASE_URL' : null,
    !supabaseKey ? 'EXPO_PUBLIC_SUPABASE_KEY' : null,
  ]
    .filter(Boolean)
    .join(', ');
  console.warn(`Supabase env vars missing: ${missing}`);
  throw new Error(`Supabase env vars are missing: ${missing}`);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
