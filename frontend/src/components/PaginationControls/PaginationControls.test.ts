import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PaginationControls from './PaginationControls.vue'

function createWrapper(props: Partial<InstanceType<typeof PaginationControls>['$props']> = {}) {
  return mount(PaginationControls, {
    props: {
      currentPage: 1,
      totalPages: 5,
      pageSize: 10,
      ...props,
    },
  })
}

describe('PaginationControls', () => {
  it('renders page buttons based on total pages', () => {
    const wrapper = createWrapper()
    const buttons = wrapper.findAll('.page-btn')
    expect(buttons.length).toBeGreaterThan(1)
  })

  it('disables previous button on first page', () => {
    const wrapper = createWrapper()
    const buttons = wrapper.findAll('.page-btn')
    const prevBtn = buttons.at(0)
    expect(prevBtn?.attributes('disabled')).toBeDefined()
  })

  it('disables next button on last page', () => {
    const wrapper = createWrapper({ currentPage: 5, totalPages: 5 })
    const buttons = wrapper.findAll('.page-btn')
    const nextBtn = buttons.at(buttons.length - 1)
    expect(nextBtn?.attributes('disabled')).toBeDefined()
  })

  it('highlights current page button', () => {
    const wrapper = createWrapper({ currentPage: 3 })
    const active = wrapper.find('.page-btn.active')
    expect(active.exists()).toBe(true)
    expect(active.text()).toBe('3')
  })

  it('opens page size selector on click', async () => {
    const wrapper = createWrapper()
    await wrapper.find('.select-header').trigger('click')
    expect(wrapper.find('.select-dropdown').classes()).toContain('open')
  })

  it('emits pageChange when clicking a page button', async () => {
    const wrapper = createWrapper()
    const buttons = wrapper.findAll('.page-btn')
    await buttons.at(2)!.trigger('click')
    expect(wrapper.emitted('pageChange')?.[0]).toEqual([2])
  })
})
