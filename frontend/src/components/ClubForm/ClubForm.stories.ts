import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { createPinia, setActivePinia } from 'pinia'
import { provide } from 'vue'
import { createMemoryHistory, createRouter, routerKey, routeLocationKey } from 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { useClubsStore } from '@/stores/clubs'
import ClubForm from './ClubForm.vue'

const meta = {
  title: 'Components/ClubForm',
  component: ClubForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ClubForm>

export default meta
type Story = StoryObj<typeof meta>

const mockRouter = createRouter({
  history: createMemoryHistory(),
  routes: [],
})
const mockRoute = { path: '/', query: {}, params: {}, hash: '', fullPath: '/', matched: [], name: undefined, redirectedFrom: undefined, meta: {} } as RouteLocationNormalizedLoaded

export const Create: Story = {
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

export const Edit: Story = {
  decorators: [
    (story) => {
      const pinia = createPinia()
      setActivePinia(pinia)
      const clubsStore = useClubsStore()
      clubsStore.fetchClub = async () => ({
        id: 1,
        bookTitle: 'Test Book',
        bookAuthors: 'Test Author',
        publicationYear: 2020,
        description: 'Test description',
        category: 11,
        categoryName: 'Программирование',
        telegramChatLink: 'https://t.me/test',
        maxChatLink: '',
        owner: 1,
        members: [],
        reviews: [],
        created: '2024-01-01T00:00:00Z',
        modified: null,
      })
      return {
        components: { story },
        template: '<story :clubId="1" />',
        setup() {
          provide(routerKey, mockRouter)
          provide(routeLocationKey, mockRoute)
        },
      }
    },
  ],
}
