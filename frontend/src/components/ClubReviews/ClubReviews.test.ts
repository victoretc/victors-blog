import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useReviewsStore } from '@/stores/reviews'
import { api } from '@/api'
import type { BookReview, Member } from '@/api/Api'
import ClubReviews from './ClubReviews.vue'

const clubId = 42
const userId = 1
const mockUser = { id: userId, username: 'testuser' }
const mockMembers: Member[] = [
  { id: userId, username: 'testuser' },
  { id: 2, username: 'otheruser' },
]

const otherReview = {
  id: 1,
  club: clubId,
  user: { id: 2, username: 'otheruser' },
  review: 'Great book!',
  assessment: 5,
  readPages: 350,
  created: '2024-01-01T10:00:00Z',
  modified: null,
} as BookReview

const myReview = {
  id: 5,
  club: clubId,
  user: { id: userId, username: 'testuser' },
  review: 'My review',
  assessment: 4,
  readPages: 200,
  created: '2024-01-01T10:00:00Z',
  modified: null,
} as BookReview

function createWrapper(
  { reviews, memberList }:
  { reviews?: BookReview[]; memberList?: Member[] } = {},
) {
  const pinia = createPinia()
  setActivePinia(pinia)

  const authStore = useAuthStore()
  authStore.$patch({ accessToken: 'test', user: mockUser })

  const reviewsStore = useReviewsStore()
  vi.spyOn(reviewsStore, 'fetchClubReviews').mockResolvedValue(undefined)

  if (reviews) {
    reviewsStore.$patch({ clubReviews: { [clubId]: reviews } })
  }

  return mount(ClubReviews, {
    props: {
      clubId,
      clubMembers: memberList ?? [],
    },
    global: {
      stubs: {
        BaseButton: {
          template: '<button :class="variant"><slot/></button>',
          props: ['variant', 'loading'],
        },
      },
    },
  })
}

describe('ClubReviews', () => {
  beforeEach(() => {
    window.confirm = vi.fn(() => true) as unknown as typeof window.confirm
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('shows empty state when no reviews', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.text()).toContain('Пока нет отзывов')
  })

  it('renders review cards when reviews exist', async () => {
    const wrapper = createWrapper({ reviews: [otherReview] })
    await flushPromises()
    expect(wrapper.text()).toContain('Great book!')
    expect(wrapper.text()).toContain('otheruser')
  })

  it('shows write review button when user can review', async () => {
    const wrapper = createWrapper({ memberList: mockMembers })
    await flushPromises()
    expect(wrapper.text()).toContain('Написать отзыв')
  })

  it('hides write review button when user already reviewed', async () => {
    const wrapper = createWrapper({
      reviews: [myReview],
      memberList: mockMembers,
    })
    await flushPromises()
    expect(wrapper.text()).not.toContain('Написать отзыв')
  })

  it('shows review form when clicking write review button', async () => {
    const wrapper = createWrapper({ memberList: mockMembers })
    await flushPromises()

    const writeBtn = wrapper.find('.reviews-head button')
    await writeBtn.trigger('click')

    expect(wrapper.find('.review-form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Новый отзыв')
  })

  it('calls createReview on form submit', async () => {
    vi.spyOn(api.api, 'clubsReviewsCreate').mockResolvedValue({ data: myReview } as unknown as Awaited<ReturnType<typeof api.api.clubsReviewsCreate>>)

    const wrapper = createWrapper({ memberList: mockMembers })
    await flushPromises()

    // Click write review button
    await wrapper.find('.reviews-head button').trigger('click')

    // Fill form
    await wrapper.find('#review').setValue('My new review')
    await wrapper.find('#assessment').setValue(4)
    await wrapper.find('#readPages').setValue(200)

    // Submit the review form directly
    await wrapper.find('.review-form form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Отзыв успешно создан')
  })

  it('shows edit and delete buttons for own review', async () => {
    const wrapper = createWrapper({
      reviews: [myReview],
      memberList: mockMembers,
    })
    await flushPromises()

    expect(wrapper.text()).toContain('Редактировать')
    expect(wrapper.text()).toContain('Удалить')
  })

  it('calls deleteReview when clicking delete', async () => {
    vi.spyOn(api.api, 'clubsReviewsDestroy').mockResolvedValue(undefined as unknown as Awaited<ReturnType<typeof api.api.clubsReviewsDestroy>>)

    const wrapper = createWrapper({
      reviews: [myReview],
      memberList: mockMembers,
    })
    await flushPromises()

    const deleteBtn = wrapper.findAll('.review-actions button').at(1)
    await deleteBtn!.trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Отзыв успешно удален')
  })

  it('shows error on empty review submission', async () => {
    const wrapper = createWrapper({ memberList: mockMembers })
    await flushPromises()

    await wrapper.find('.reviews-head button').trigger('click')
    await wrapper.find('.review-form form').trigger('submit')

    expect(wrapper.text()).toContain('Пожалуйста, напишите отзыв')
  })
})
