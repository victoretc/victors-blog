import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import AppHeader from './AppHeader.vue'

const meta = {
  title: 'Components/AppHeader',
  component: AppHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AppHeader>

export default meta
type Story = StoryObj<typeof meta>

function setupPinia() {
  const pinia = createPinia()
  setActivePinia(pinia)
}

export const Default: Story = {
  decorators: [
    (story) => {
      setupPinia()
      return {
        components: { story },
        template: '<story />',
      }
    },
  ],
}

export const Authenticated: Story = {
  decorators: [
    (story) => {
      setupPinia()
      const authStore = useAuthStore()
      authStore.$patch({ accessToken: 'mock-token', refreshToken: 'mock-refresh' })
      return {
        components: { story },
        template: '<story />',
      }
    },
  ],
}
