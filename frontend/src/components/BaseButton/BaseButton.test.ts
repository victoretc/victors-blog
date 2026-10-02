import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from './BaseButton.vue'

function createWrapper(props = {}) {
  return mount(BaseButton, {
    props,
    slots: { default: 'Click me' },
  })
}

describe('BaseButton', () => {
  it('renders slot content', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Click me')
  })

  it('emits click event on click', () => {
    const wrapper = createWrapper()
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('applies variant class', () => {
    const wrapper = createWrapper({ variant: 'danger' })
    expect(wrapper.classes()).toContain('base-btn--danger')
  })

  it('applies full-width class when fullWidth is true', () => {
    const wrapper = createWrapper({ fullWidth: true })
    expect(wrapper.classes()).toContain('base-btn--full')
  })

  it('hides slot content when loading', () => {
    const wrapper = createWrapper({ loading: true })
    expect(wrapper.find('.base-btn__text').exists()).toBe(false)
  })

  it('disables button when loading', () => {
    const wrapper = createWrapper({ loading: true })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('does not emit click when disabled', () => {
    const wrapper = createWrapper({ disabled: true })
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
