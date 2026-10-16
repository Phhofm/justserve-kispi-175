export function mosaikLayout(anzahl: number): { spalten: number; zeilen: number } {
  if (anzahl <= 0) return { spalten: 0, zeilen: 0 }
  const spalten = Math.ceil(Math.sqrt(anzahl))
  const zeilen = Math.ceil(anzahl / spalten)
  return { spalten, zeilen }
}
