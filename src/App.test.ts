import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App', () => {
  it('rendert die App-Wurzel', () => {
    const wrapper = mount(App, {
      global: { stubs: { RouterView: { template: '<div />' } } },
    })
    expect(wrapper.find('[data-testid="app"]').exists()).toBe(true)
  })
})
