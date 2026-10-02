import { defineStore } from 'pinia'
import { api } from '@/api'
import { ContentType } from '@/api/Api'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/stores/toast'
import type { BookClubRequestRequest, Club, PatchedClubRequest } from '@/api/Api'
import { ClubTypeEnum } from '@/api/Api'

interface ClubsListParams {
  category?: number
  membership?: string
  page?: number
  page_size?: number
  search?: string
  club_type?: string
}

interface ClubsState {
  clubs: Club[]
  isLoading: boolean
  isLoadingMore: boolean
  activeFilter: 'member' | 'all' | null
  activeSearch: string | null
  activeCategory: number | null
  activeType: ClubTypeEnum
  pagination: {
    count: number
    next: string | null
    previous: string | null
    currentPage: number
    pageSize: number
  }
}

export const useClubsStore = defineStore('clubs', {
  state: (): ClubsState => ({
    clubs: [],
    isLoading: false,
    isLoadingMore: false,
    activeFilter: null,
    activeSearch: null,
    activeCategory: null,
    activeType: ClubTypeEnum.Book,
    pagination: {
      count: 0,
      next: null,
      previous: null,
      currentPage: 1,
      pageSize: 10,
    },
  }),

  actions: {
    async _fetchClubsWithParams(params: ClubsListParams, errorMessage: string) {
      this.isLoading = true
      try {
        const response = await api.api.clubsList(params)
        this.clubs = response.data.results
        this.pagination = {
          count: response.data.count,
          next: response.data.next ?? null,
          previous: response.data.previous ?? null,
          currentPage: params.page ?? 1,
          pageSize: params.page_size ?? 10,
        }
      } catch (error) {
        showToast(errorMessage)
        console.error('Error fetching clubs:', error)
      } finally {
        this.isLoading = false
      }
    },

    _fetchWithCurrentParams(page: number, pageSize: number) {
      if (this.activeSearch) {
        return this.searchClubs(this.activeSearch, page, pageSize)
      }
      if (this.activeFilter && this.activeFilter !== 'all') {
        return this.filterByMembership(this.activeFilter, page, pageSize)
      }
      if (this.activeCategory) {
        return this.filterByCategory(this.activeCategory, page, pageSize)
      }
      if (this.activeType) {
        return this.filterByType(this.activeType, page, pageSize)
      }
      return this.fetchClubs(page, pageSize)
    },

    async loadMore() {
      if (!this.pagination.next || this.isLoadingMore) return
      const page = this.pagination.currentPage + 1
      const pageSize = this.pagination.pageSize
      this.isLoadingMore = true
      try {
        const params: ClubsListParams = { page, page_size: pageSize, club_type: this.activeType }
        if (this.activeSearch) params.search = this.activeSearch
        if (this.activeFilter && this.activeFilter !== 'all') params.membership = this.activeFilter
        if (this.activeCategory) params.category = this.activeCategory
        if (this.activeType) params.club_type = this.activeType
        const response = await api.api.clubsList(params)
        this.clubs = [...this.clubs, ...response.data.results]
        this.pagination = {
          count: response.data.count,
          next: response.data.next ?? null,
          previous: response.data.previous ?? null,
          currentPage: page,
          pageSize,
        }
      } catch (error) {
        showToast('Ошибка при загрузке клубов')
        console.error('Error loading more clubs:', error)
      } finally {
        this.isLoadingMore = false
      }
    },

    async fetchClubs(page: number = 1, pageSize: number = 10) {
      this.activeFilter = 'all'
      this.activeSearch = null
      this.activeCategory = null
      this.activeType = ClubTypeEnum.Book
      await this._fetchClubsWithParams(
        { page, page_size: pageSize, club_type: 'book' },
        'Не удалось загрузить список клубов',
      )
    },

    async searchClubs(query: string, page: number = 1, pageSize: number = 10) {
      this.activeSearch = query
      this.activeFilter = null
      this.activeCategory = null
      this.activeType = ClubTypeEnum.Book
      await this._fetchClubsWithParams(
        { search: query, page, page_size: pageSize, club_type: 'book' },
        'Ошибка при поиске клубов',
      )
    },

    async filterByMembership(
      type: 'member' | 'all',
      page: number = 1,
      pageSize: number = 10,
    ) {
      this.activeFilter = type
      this.activeSearch = null
      const params: ClubsListParams = { page, page_size: pageSize }
      if (this.activeCategory) params.category = this.activeCategory
      if (this.activeType) params.club_type = this.activeType
      if (type !== 'all') params.membership = type
      await this._fetchClubsWithParams(params, 'Ошибка при фильтрации клубов')
    },

    async filterByCategory(categoryId: number, page: number = 1, pageSize: number = 10) {
      this.activeCategory = categoryId
      this.activeSearch = null
      const params: ClubsListParams = { category: categoryId, club_type: this.activeType, page, page_size: pageSize }
      if (this.activeFilter && this.activeFilter !== 'all') {
        params.membership = this.activeFilter
      }
      await this._fetchClubsWithParams(params, 'Ошибка при фильтрации по категории')
    },

    async filterByType(type: ClubTypeEnum, page: number = 1, pageSize: number = 10) {
      this.activeType = type
      this.activeSearch = null
      const params: ClubsListParams = { club_type: type, page, page_size: pageSize }
      if (this.activeCategory) params.category = this.activeCategory
      if (this.activeFilter && this.activeFilter !== 'all') {
        params.membership = this.activeFilter
      }
      await this._fetchClubsWithParams(params, 'Ошибка при фильтрации по типу клуба')
    },

    async nextPage() {
      if (this.pagination.next) {
        await this._fetchWithCurrentParams(this.pagination.currentPage + 1, this.pagination.pageSize)
      }
    },

    async prevPage() {
      if (this.pagination.previous) {
        await this._fetchWithCurrentParams(this.pagination.currentPage - 1, this.pagination.pageSize)
      }
    },

    async goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        await this._fetchWithCurrentParams(page, this.pagination.pageSize)
      }
    },

    async changePageSize(size: number) {
      await this._fetchWithCurrentParams(1, size)
    },

    async joinClub(clubId: number) {
      try {
        await api.api.clubsMembersMeCreate(clubId)
      } catch (error) {
        console.error('Error joining club:', error)
        throw error
      }
    },

    async leaveClub(clubId: number) {
      try {
        await api.api.clubsMembersMeDestroy(clubId)
      } catch (error) {
        console.error('Error leaving club:', error)
        throw error
      }
    },

    isCurrentUserMember(club: Club): boolean {
      const authStore = useAuthStore()
      return authStore.user ? club.members.some(m => m.id === Number(authStore.user!.id)) : false
    },

    isCurrentUserOwner(club: Club): boolean {
      const authStore = useAuthStore()
      return authStore.user ? Number(club.owner) === Number(authStore.user.id) : false
    },

    async createClubRequest(data: BookClubRequestRequest, photo?: File | null) {
      this.isLoading = true
      try {
        if (photo) {
          const formData = new FormData()
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) formData.append(key, String(value))
          })
          formData.append('author_photo', photo)
          const response = await api.api.clubsClubRequestsCreate(
            formData as unknown as BookClubRequestRequest,
            { type: ContentType.FormData },
          )
          return response.data
        }
        const response = await api.api.clubsClubRequestsCreate(data)
        return response.data
      } catch (error) {
        console.error('Error creating club request:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateClub(clubId: number, data: Partial<Club>, photo?: File | null) {
      this.isLoading = true
      try {
        if (photo) {
          const formData = new FormData()
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) formData.append(key, String(value))
          })
          formData.append('author_photo', photo)
          const response = await api.api.clubsPartialUpdate(
            clubId,
            formData as unknown as PatchedClubRequest,
            { type: ContentType.FormData },
          )
          return response.data
        }
        const response = await api.api.clubsPartialUpdate(clubId, data as PatchedClubRequest)
        return response.data
      } catch (error) {
        console.error('Error updating club:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchClub(clubId: number) {
      this.isLoading = true
      try {
        const response = await api.api.clubsRetrieve(clubId)
        return response.data
      } catch (error) {
        console.error('Error fetching club:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async ownedClubsCount(): Promise<number> {
      const response = await api.api.clubsList({ membership: 'owner', page: 1, page_size: 1 })
      return response.data.count
    },
  },

  getters: {
    totalPages(state): number {
      return Math.ceil(state.pagination.count / state.pagination.pageSize)
    },
    hasNextPage(state): boolean {
      return state.pagination.next !== null
    },
    hasPrevPage(state): boolean {
      return state.pagination.previous !== null
    },
    clubsCount(state): number {
      return state.clubs.length
    },
  },
})
