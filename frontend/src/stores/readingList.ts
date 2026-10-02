import { defineStore } from 'pinia'
import { api } from '@/api'
import type { ReadingListBook, ReadingListUser } from '@/api/Api'

interface ReadingListState {
  userId: number | null
  books: ReadingListBook[]
  owner: ReadingListUser | null
  isLoading: boolean
  error: string | null
  isHidden: boolean
  pagination: {
    count: number
    next: string | null
    previous: string | null
    currentPage: number
    pageSize: number
  }
}

export const useReadingListStore = defineStore('readingList', {
  state: (): ReadingListState => ({
    userId: null,
    books: [],
    owner: null,
    isLoading: false,
    error: null,
    isHidden: false,
    pagination: {
      count: 0,
      next: null,
      previous: null,
      currentPage: 1,
      pageSize: 10,
    },
  }),

  actions: {
    async fetchReadingList(userId: number, page: number = 1, pageSize: number = 10) {
      this.userId = userId
      this.isLoading = true
      this.error = null
      this.isHidden = false
      try {
        const response = await api.api.usersBooksRetrieve(userId, { page, page_size: pageSize })
        this.books = response.data.results
        this.owner = response.data.user
        this.pagination = {
          count: response.data.count,
          next: response.data.next ?? null,
          previous: response.data.previous ?? null,
          currentPage: page,
          pageSize: pageSize,
        }
      } catch (error: unknown) {
        const apiError = error as { status?: number }
        if (apiError.status === 404) {
          this.isHidden = true
        } else {
          this.error = 'Не удалось загрузить прочитанные книги'
        }
        console.error('Error fetching reading list:', error)
      } finally {
        this.isLoading = false
      }
    },

    async nextPage() {
      if (this.pagination.next && this.userId) {
        await this.fetchReadingList(this.userId, this.pagination.currentPage + 1, this.pagination.pageSize)
      }
    },

    async prevPage() {
      if (this.pagination.previous && this.userId) {
        await this.fetchReadingList(this.userId, this.pagination.currentPage - 1, this.pagination.pageSize)
      }
    },

    async goToPage(page: number) {
      if (this.userId && page >= 1 && page <= this.totalPages) {
        await this.fetchReadingList(this.userId, page, this.pagination.pageSize)
      }
    },

    async changePageSize(size: number) {
      if (this.userId) {
        await this.fetchReadingList(this.userId, 1, size)
      }
    },
  },

  getters: {
    totalPages(state): number {
      return Math.ceil(state.pagination.count / state.pagination.pageSize)
    },
  },
})
