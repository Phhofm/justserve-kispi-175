import { describe, it, expect } from 'vitest'
import { mosaikLayout } from './mosaic'

describe('mosaikLayout', () => {
  it('liefert 0×0 bei leerer Eingabe', () => {
    expect(mosaikLayout(0)).toEqual({ spalten: 0, zeilen: 0 })
  })

  it('ist für 9 Einträge quadratisch', () => {
    expect(mosaikLayout(9)).toEqual({ spalten: 3, zeilen: 3 })
  })

  it('deckt 10 Einträge mit genug Kacheln ab', () => {
    const { spalten, zeilen } = mosaikLayout(10)
    expect(spalten * zeilen).toBeGreaterThanOrEqual(10)
  })

  it('bleibt auch bei wenigen Einträgen rechteckig', () => {
    expect(mosaikLayout(1)).toEqual({ spalten: 1, zeilen: 1 })
    expect(mosaikLayout(2)).toEqual({ spalten: 2, zeilen: 1 })
  })
})
