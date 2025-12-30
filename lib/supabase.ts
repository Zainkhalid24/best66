import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '';

const missing = [
  !supabaseUrl ? 'EXPO_PUBLIC_SUPABASE_URL' : null,
  !supabaseKey ? 'EXPO_PUBLIC_SUPABASE_KEY' : null,
]
  .filter(Boolean)
  .join(', ');

if (missing) {
  console.warn(`Supabase env vars missing: ${missing}`);
}

const fallbackUrl = supabaseUrl || 'https://example.supabase.co';
const fallbackKey = supabaseKey || 'public-anon-key';

export const supabase = createClient(fallbackUrl, fallbackKey);
