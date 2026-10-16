export interface Zielmasse {
  breite: number
  hoehe: number
}

export const MAX_BILD_BYTES = 10 * 1024 * 1024
const ERLAUBTE_TYPEN = ['image/jpeg', 'image/png', 'image/webp']

export function berechneZielmasse(breite: number, hoehe: number, maxKante: number): Zielmasse {
  const laengste = Math.max(breite, hoehe)
  if (laengste <= maxKante) return { breite, hoehe }
  const faktor = maxKante / laengste
  return { breite: Math.round(breite * faktor), hoehe: Math.round(hoehe * faktor) }
}

export function istErlaubtesBild(datei: File): boolean {
  return (
    ERLAUBTE_TYPEN.includes(datei.type) &&
    datei.size > 0 &&
    datei.size <= MAX_BILD_BYTES
  )
}

export async function komprimiereBild(
  datei: File,
  maxKante = 800,
  qualitaet = 0.72,
): Promise<Blob> {
  const bitmap = await createImageBitmap(datei)
  const { breite, hoehe } = berechneZielmasse(bitmap.width, bitmap.height, maxKante)

  const canvas = document.createElement('canvas')
  canvas.width = breite
  canvas.height = hoehe
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Bild konnte nicht verarbeitet werden.')
  ctx.drawImage(bitmap, 0, 0, breite, hoehe)
  bitmap.close()

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Bild konnte nicht komprimiert werden.'))),
      'image/jpeg',
      qualitaet,
    )
  })
}
