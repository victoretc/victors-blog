import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { createPinia, setActivePinia } from 'pinia'
import { provide } from 'vue'
import { createMemoryHistory, createRouter, routerKey, routeLocationKey } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import ClubFilters from './ClubFilters.vue'

const meta = {
  title: 'Components/ClubFilters',
  component: ClubFilters,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ClubFilters>

export default meta
type Story = StoryObj<typeof meta>

const mockRouter = createRouter({
  history: createMemoryHistory(),
  routes: [],
})
const mockRoute = { path: '/', query: {}, params: {}, hash: '', fullPath: '/', matched: [], name: undefined, redirectedFrom: undefined, meta: {} } as RouteLocationNormalizedLoaded

export const Default: Story = {
  decorators: [
    (story) => {
      const pinia = createPinia()
      setActivePinia(pinia)
      return {
        components: { story },
        template: '<story />',
        setup() {
          provide(routerKey, mockRouter)
          provide(routeLocationKey, mockRoute)
        },
      }
    },
  ],
}
