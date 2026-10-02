import { defineStore } from 'pinia'
import { api } from '@/api'
import type { BookReview, PatchedBookReviewRequest } from '@/api/Api'

interface ClubsReviewsListParams {
  club?: number
  page?: number
  page_size?: number
}

interface ReviewsState {
  reviews: BookReview[]
  clubReviews: Record<number, BookReview[]>
  isLoading: boolean
  error: string | null
  pagination: {
    count: number
    next: string | null
    previous: string | null
    currentPage: number
    pageSize: number
  }
}

export const useReviewsStore = defineStore('reviews', {
  state: (): ReviewsState => ({
    reviews: [],
    clubReviews: {},
    isLoading: false,
    error: null,
    pagination: {
      count: 0,
      next: null,
      previous: null,
      currentPage: 1,
      pageSize: 10,
    },
  }),

  actions: {
    async fetchReviews(page: number = 1, pageSize: number = 10) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.api.clubsReviewsList({ page, page_size: pageSize })
        this.reviews = response.data.results
        this.pagination = {
          count: response.data.count,
          next: response.data.next ?? null,
          previous: response.data.previous ?? null,
          currentPage: page,
          pageSize: pageSize,
        }
      } catch (error) {
        this.error = 'Не удалось загрузить отзывы'
        console.error('Error fetching reviews:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchClubReviews(clubId: number, page: number = 1, pageSize: number = 100) {
      this.isLoading = true
      this.error = null
      try {
        const params: ClubsReviewsListParams = { club: clubId, page, page_size: pageSize }
        const response = await api.api.clubsReviewsList(params)
        this.clubReviews = {
          ...this.clubReviews,
          [clubId]: response.data.results,
        }
      } catch (error) {
        this.error = 'Не удалось загрузить отзывы клуба'
        console.error('Error fetching club reviews:', error)
      } finally {
        this.isLoading = false
      }
    },

    async createReview(clubId: number, reviewData: Partial<BookReview>) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.api.clubsReviewsCreate({
          club: clubId,
          review: reviewData.review || '',
          assessment: reviewData.assessment || 5,
          readPages: reviewData.readPages || 0,
        } as unknown as BookReview)

        if (this.clubReviews[clubId]) {
          this.clubReviews[clubId] = [response.data, ...this.clubReviews[clubId]]
        } else {
          this.clubReviews[clubId] = [response.data]
        }

        return response.data
      } catch (error) {
        this.error = 'Не удалось создать отзыв'
        console.error('Error creating review:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateReview(reviewId: number, reviewData: Partial<BookReview>) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.api.clubsReviewsPartialUpdate(
          reviewId,
          reviewData as unknown as PatchedBookReviewRequest,
        )

        Object.keys(this.clubReviews).forEach((clubId) => {
          const index = this.clubReviews[Number(clubId)]?.findIndex((r) => r.id === reviewId)
          if (index !== undefined && index !== -1) {
            this.clubReviews[Number(clubId)][index] = response.data
          }
        })

        return response.data
      } catch (error) {
        this.error = 'Не удалось обновить отзыв'
        console.error('Error updating review:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteReview(reviewId: number, clubId: number) {
      this.isLoading = true
      this.error = null
      try {
        await api.api.clubsReviewsDestroy(reviewId)

        if (this.clubReviews[clubId]) {
          this.clubReviews[clubId] = this.clubReviews[clubId].filter((r) => r.id !== reviewId)
        }
      } catch (error) {
        this.error = 'Не удалось удалить отзыв'
        console.error('Error deleting review:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async getUserReviewForClub(clubId: number, userId: number) {
      await this.fetchClubReviews(clubId)
      return this.clubReviews[clubId]?.find((review) => review.user.id === userId)
    },
  },

  getters: {
    getClubReviews: (state) => (clubId: number) => {
      return state.clubReviews[clubId] || []
    },
    hasUserReviewed: (state) => (clubId: number, userId: number) => {
      return state.clubReviews[clubId]?.some((review) => review.user.id === userId) || false
    },
  },
})
