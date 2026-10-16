import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { getSupabase } from '../lib/supabase'
import { berechneFortschritt, type GesamtFortschritt } from '../lib/progress'
import { KATEGORIEN } from '../lib/categories'
import type { Beitrag, CategorySlug } from '../lib/types'
import { komprimiereBild, istErlaubtesBild } from '../lib/imageCompression'

export interface NeuerBeitrag {
  kategorie: CategorySlug
  menge: number
  einreicher?: string
  datei: File
}

const GUELTIGE_KATEGORIEN = new Set<CategorySlug>(KATEGORIEN.map((k) => k.slug))

export function useContributions(): {
  beitraege: Ref<Beitrag[]>
  fortschritt: ComputedRef<GesamtFortschritt>
  fehler: Ref<string | null>
  laden: () => Promise<void>
} {
  const beitraege = ref<Beitrag[]>([])
  const fehler = ref<string | null>(null)
  const fortschritt = computed(() => berechneFortschritt(beitraege.value))

  async function laden(): Promise<void> {
    try {
      const { data, error } = await getSupabase()
        .from('beitraege')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) throw error
      beitraege.value = (data ?? []) as Beitrag[]
      fehler.value = null
    } catch {
      fehler.value = 'Die Beiträge konnten gerade nicht geladen werden.'
    }
  }

  return { beitraege, fortschritt, fehler, laden }
}

export async function reicheBeitragEin(input: NeuerBeitrag): Promise<void> {
  if (!GUELTIGE_KATEGORIEN.has(input.kategorie)) {
    throw new Error('Unbekannte Kategorie.')
  }
  if (!Number.isInteger(input.menge) || input.menge < 1 || input.menge > 175) {
    throw new Error('Die Menge muss zwischen 1 und 175 liegen.')
  }
  if (!istErlaubtesBild(input.datei)) {
    throw new Error('Bitte ein Bild wählen (JPEG, PNG oder WebP, max. 10 MB).')
  }

  const supabase = getSupabase()
  const komprimiert = await komprimiereBild(input.datei)
  const pfad = `pending/${crypto.randomUUID()}.jpg`

  const { error: uploadError } = await supabase.storage
    .from('fotos')
    .upload(pfad, komprimiert, { contentType: 'image/jpeg' })
  if (uploadError) throw new Error('Das Foto konnte nicht hochgeladen werden.')

  const einreicher = input.einreicher?.trim() ? input.einreicher.trim().slice(0, 120) : null
  const { error: insertError } = await supabase.from('beitraege').insert({
    kategorie: input.kategorie,
    menge: input.menge,
    einreicher,
    foto_pfad: pfad,
    status: 'pending',
  })
  if (insertError) throw new Error('Der Beitrag konnte nicht gespeichert werden.')
}
