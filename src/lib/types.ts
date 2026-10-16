export type CategorySlug = 'autos' | 'sticker' | 'stempel' | 'tiere' | 'buecher'

export type Status = 'pending' | 'approved' | 'rejected'

export interface Kategorie {
  slug: CategorySlug
  label: string
  farbe: string
  beschreibung: string
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
