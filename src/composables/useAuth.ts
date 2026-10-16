import { ref, computed, type Ref, type ComputedRef } from 'vue'
import type { User } from '@supabase/supabase-js'
import { getSupabase } from '../lib/supabase'

export function useAuth(): {
  benutzer: Ref<User | null>
  angemeldet: ComputedRef<boolean>
  fehler: Ref<string | null>
  init: () => Promise<void>
  anmelden: (email: string, passwort: string) => Promise<void>
  abmelden: () => Promise<void>
} {
  const benutzer = ref<User | null>(null)
  const fehler = ref<string | null>(null)
  const angemeldet = computed(() => benutzer.value !== null)

  async function init(): Promise<void> {
    const { data } = await getSupabase().auth.getSession()
    benutzer.value = data.session?.user ?? null
  }

  async function anmelden(email: string, passwort: string): Promise<void> {
    fehler.value = null
    const { data, error } = await getSupabase().auth.signInWithPassword({
      email,
      password: passwort,
    })
    if (error || !data.user) {
      fehler.value = 'Anmeldung fehlgeschlagen. Bitte E-Mail und Passwort prüfen.'
      benutzer.value = null
      return
    }
    benutzer.value = data.user
  }

  async function abmelden(): Promise<void> {
    await getSupabase().auth.signOut()
    benutzer.value = null
  }

  return { benutzer, angemeldet, fehler, init, anmelden, abmelden }
}
