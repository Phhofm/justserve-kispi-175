import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressBar from './ProgressBar.vue'

describe('ProgressBar', () => {
  it('zeigt Zähler und Prozent', () => {
    const w = mount(ProgressBar, { props: { gesammelt: 45, ziel: 175, prozent: 26 } })
    expect(w.text()).toContain('45 / 175')
    expect(w.text()).toContain('26')
  })

  it('cappt die Balkenbreite bei 100 % und meldet das erreichte Ziel', () => {
    const w = mount(ProgressBar, { props: { gesammelt: 210, ziel: 175, prozent: 120 } })
    expect(w.find('[data-testid="balken"]').attributes('style')).toContain('width: 100%')
    expect(w.text()).toContain('210 / 175')
    expect(w.text()).toContain('120')
    expect(w.text()).toContain('Ziel erreicht')
  })

  it('zeigt kein «Ziel erreicht» unterhalb des Ziels', () => {
    const w = mount(ProgressBar, { props: { gesammelt: 10, ziel: 175, prozent: 6 } })
    expect(w.text()).not.toContain('Ziel erreicht')
  })
})
