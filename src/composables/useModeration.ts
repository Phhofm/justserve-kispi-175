import { ref, type Ref } from 'vue'
import { getSupabase } from '../lib/supabase'
import type { Beitrag } from '../lib/types'

export function useModeration(): {
  offene: Ref<Beitrag[]>
  fehler: Ref<string | null>
  laden: () => Promise<void>
  freigeben: (id: string) => Promise<void>
  ablehnen: (id: string) => Promise<void>
} {
  const offene = ref<Beitrag[]>([])
  const fehler = ref<string | null>(null)

  async function laden(): Promise<void> {
    try {
      const { data, error } = await getSupabase()
        .from('beitraege')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true })
      if (error) throw error
      offene.value = (data ?? []) as Beitrag[]
      fehler.value = null
    } catch {
      fehler.value = 'Die offenen Beiträge konnten nicht geladen werden.'
    }
  }

  async function freigeben(id: string): Promise<void> {
    const beitrag = offene.value.find((b) => b.id === id)
    if (!beitrag) return

    const ziel = beitrag.foto_pfad.replace(/^pending\//, 'approved/')
    let endPfad = beitrag.foto_pfad
    if (ziel !== beitrag.foto_pfad) {
      const { error: moveError } = await getSupabase()
        .storage.from('fotos')
        .move(beitrag.foto_pfad, ziel)
      // Schlägt das Verschieben fehl, bleibt der Pfad unverändert – der
      // öffentliche Bucket liefert das Bild trotzdem aus.
      if (!moveError) endPfad = ziel
    }

    const { error } = await getSupabase()
      .from('beitraege')
      .update({ status: 'approved', freigegeben_am: new Date().toISOString(), foto_pfad: endPfad })
      .eq('id', id)
    if (error) throw new Error('Freigabe fehlgeschlagen.')

    offene.value = offene.value.filter((b) => b.id !== id)
  }

  async function ablehnen(id: string): Promise<void> {
    const beitrag = offene.value.find((b) => b.id === id)

    const { error } = await getSupabase()
      .from('beitraege')
      .update({ status: 'rejected' })
      .eq('id', id)
    if (error) throw new Error('Ablehnen fehlgeschlagen.')

    if (beitrag) {
      await getSupabase().storage.from('fotos').remove([beitrag.foto_pfad])
    }
    offene.value = offene.value.filter((b) => b.id !== id)
  }

  return { offene, fehler, laden, freigeben, ablehnen }
}
