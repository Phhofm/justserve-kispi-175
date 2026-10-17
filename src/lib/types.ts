export type CategorySlug =
  | 'autos'
  | 'sticker'
  | 'stempel'
  | 'tiere'
  | 'buecher'
  | 'mutmacher'

export type Status = 'pending' | 'approved' | 'rejected'

export interface Kategorie {
  slug: CategorySlug
  label: string
  farbe: string
  beschreibung: string
  /** Zählt diese Kategorie zum Gesamtziel (875)? Mutmacher-Karten zählen separat. */
  imGesamtziel: boolean
}

export interface Beitrag {
  id: string
  created_at: string
  kategorie: CategorySlug
  menge: number
  einreicher: string | null
  foto_pfad: string
  status: Status
  freigegeben_am: string | null
}
