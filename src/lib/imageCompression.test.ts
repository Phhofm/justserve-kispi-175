import { describe, it, expect } from 'vitest'
import { berechneZielmasse, istErlaubtesBild } from './imageCompression'

describe('berechneZielmasse', () => {
  it('skaliert die längere Kante auf maxKante', () => {
    expect(berechneZielmasse(1600, 900, 800)).toEqual({ breite: 800, hoehe: 450 })
  })

  it('skaliert auch, wenn die Höhe die längere Kante ist', () => {
    expect(berechneZielmasse(600, 1200, 800)).toEqual({ breite: 400, hoehe: 800 })
  })

  it('lässt kleinere Bilder unverändert', () => {
    expect(berechneZielmasse(400, 300, 800)).toEqual({ breite: 400, hoehe: 300 })
  })
})

describe('istErlaubtesBild', () => {
  const datei = (type: string, size: number) => ({ type, size }) as File

  it('akzeptiert jpeg, png und webp', () => {
    expect(istErlaubtesBild(datei('image/jpeg', 1000))).toBe(true)
    expect(istErlaubtesBild(datei('image/png', 1000))).toBe(true)
    expect(istErlaubtesBild(datei('image/webp', 1000))).toBe(true)
  })

  it('lehnt andere Dateitypen ab', () => {
    expect(istErlaubtesBild(datei('application/pdf', 1000))).toBe(false)
  })

  it('lehnt zu grosse Dateien ab', () => {
    expect(istErlaubtesBild(datei('image/jpeg', 20 * 1024 * 1024))).toBe(false)
  })
})
