import { createClient } from '@supabase/supabase-js';

function assertEnv() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url)  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL (check .env.local)');
  if (!anon) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY (check .env.local)');
  return { url, anon };
}

export function getSupabaseLite() {
  const { url, anon } = assertEnv();
  return createClient(url, anon);
}