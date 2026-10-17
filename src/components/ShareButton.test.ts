import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ShareButton from './ShareButton.vue'

describe('ShareButton', () => {
  it('zeigt einen Teilen-Button', () => {
    const w = mount(ShareButton)
    expect(w.text()).toContain('teilen')
  })

  it('öffnet ohne Web-Share-API einen WhatsApp-Link', async () => {
    const open = vi.fn()
    vi.stubGlobal('open', open)
    const w = mount(ShareButton)
    await w.find('button').trigger('click')
    expect(open).toHaveBeenCalled()
    vi.unstubAllGlobals()
  })
})
