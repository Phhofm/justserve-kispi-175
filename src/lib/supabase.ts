import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (client) return client

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Supabase ist nicht konfiguriert. Bitte VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY in .env setzen.',
    )
  }

  client = createClient(url, anonKey)
  return client
}

export function fotoUrl(pfad: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL ?? ''
  return `${base}/storage/v1/object/public/fotos/${pfad}`
}
