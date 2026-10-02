import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import AppFooter from './AppFooter.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/clubs/create', component: { template: '<div />' } },
    { path: '/profile', component: { template: '<div />' } },
    { path: '/agreement', component: { template: '<div />' } },
  ],
})

function createWrapper() {
  return mount(AppFooter, {
    global: {
      plugins: [router],
    },
  })
}

describe('AppFooter', () => {
  it('renders brand link', () => {
    const wrapper = createWrapper()
    const brand = wrapper.find('.footer-brand-link')
    expect(brand.exists()).toBe(true)
    expect(brand.text()).toContain('Читальная')
    expect(brand.attributes('href')).toBe('/')
  })

  it('renders navigation links', () => {
    const wrapper = createWrapper()
    const links = wrapper.findAll('.footer-link')
    const labels = links.map((link) => link.text())
    expect(labels).toContain('Все клубы')
    expect(labels).toContain('Создать клуб')
    expect(labels).toContain('Мой профиль')
    expect(labels).toContain('Согласие на обработку персональных данных')
  })

  it('renders current year in copyright', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.footer-copyright').text()).toContain(String(new Date().getFullYear()))
  })
})
