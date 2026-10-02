import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { showToast, hideToast } from '@/stores/toast'
import ToastNotification from './ToastNotification.vue'

function createWrapper() {
  return mount(ToastNotification, {
    global: {
      stubs: {
        Teleport: true,
      },
    },
  })
}

describe('ToastNotification', () => {
  beforeEach(() => {
    hideToast()
  })

  it('renders nothing when toast is hidden', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.toast').exists()).toBe(false)
  })

  it('shows toast message when visible', () => {
    showToast('Test message', 'error')
    const wrapper = createWrapper()
    expect(wrapper.find('.toast').exists()).toBe(true)
    expect(wrapper.find('.toast').text()).toContain('Test message')
  })

  it('applies error class for error type', () => {
    showToast('Error', 'error')
    const wrapper = createWrapper()
    expect(wrapper.find('.toast').classes()).toContain('toast--error')
  })

  it('applies success class for success type', () => {
    showToast('Success', 'success')
    const wrapper = createWrapper()
    expect(wrapper.find('.toast').classes()).toContain('toast--success')
  })

  it('hides toast on click', async () => {
    showToast('Click to dismiss', 'error')
    const wrapper = createWrapper()
    expect(wrapper.find('.toast').exists()).toBe(true)
    await wrapper.find('.toast').trigger('click')
    await nextTick()
    expect(wrapper.find('.toast').exists()).toBe(false)
  })

  it('renders close button for every toast type', () => {
    showToast('Success', 'success')
    const wrapper = createWrapper()
    expect(wrapper.find('.toast-close').exists()).toBe(true)
  })

  it('hides toast on close button click', async () => {
    showToast('Close me', 'success')
    const wrapper = createWrapper()
    expect(wrapper.find('.toast').exists()).toBe(true)
    await wrapper.find('.toast-close').trigger('click')
    await nextTick()
    expect(wrapper.find('.toast').exists()).toBe(false)
  })
})
