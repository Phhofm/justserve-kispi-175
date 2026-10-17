import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DonationSection from './DonationSection.vue'

describe('DonationSection', () => {
  it('zeigt das Spendenbild mit Alt-Text', () => {
    const w = mount(DonationSection)
    const img = w.find('img')
    expect(img.exists()).toBe(true)
    expect((img.attributes('alt') ?? '').length).toBeGreaterThan(0)
  })

  it('zeigt «Bald verfügbar» und noch keinen Spendenlink', () => {
    const w = mount(DonationSection)
    expect(w.text()).toContain('Bald verfügbar')
    expect(w.html()).not.toContain('spendenaktion.kispi.uzh.ch')
  })

  it('erklärt, dass Spenden direkt ans Kinderspital gehen und nicht in Trösterli', () => {
    const w = mount(DonationSection)
    expect(w.text()).toContain('Kinderspital')
    expect(w.text()).toContain('keine Trösterli')
  })

  it('zeigt ein Spendenziel', () => {
    const w = mount(DonationSection)
    expect(w.text()).toContain('CHF')
  })
})
