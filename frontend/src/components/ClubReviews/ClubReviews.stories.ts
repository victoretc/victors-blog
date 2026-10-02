import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useReviewsStore } from '@/stores/reviews'
import ClubReviews from './ClubReviews.vue'

const meta = {
  title: 'Components/ClubReviews',
  component: ClubReviews,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ClubReviews>

export default meta
type Story = StoryObj<typeof meta>

const mockUser = { id: 1, username: 'reader' }
const mockMembers = [
  { id: 1, username: 'reader', role: 'member' as const },
  { id: 2, username: 'author', role: 'member' as const },
]
const mockClubId = 42

const mockReviews = [
  {
    id: 1,
    user: { id: 2, username: 'author' },
    review: 'Отличная книга, очень рекомендую!',
    assessment: 5,
    readPages: 350,
    created: '2024-06-15T10:00:00Z',
  },
  {
    id: 2,
    user: { id: 3, username: 'critic' },
    review: 'Неплохо, но могло быть и лучше.',
    assessment: 3,
    readPages: 200,
    created: '2024-06-10T14:30:00Z',
  },
]

function setupStore(user = mockUser) {
  const pinia = createPinia()
  setActivePinia(pinia)
  const reviewsStore = useReviewsStore()
  reviewsStore.$patch({ clubReviews: { [mockClubId]: mockReviews } })
  const authStore = useAuthStore()
  authStore.$patch({ accessToken: 'test', user })
}

export const Default: Story = {
  decorators: [
    (story) => {
      setupStore({ id: 999, username: 'guest' })
      return {
        components: { story },
        template: '<story />',
      }
    },
  ],
  args: {
    clubId: mockClubId,
    clubMembers: mockMembers,
    clubOwner: 2,
  },
}
