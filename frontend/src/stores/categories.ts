import { defineStore } from 'pinia'
import { api } from '@/api'
import type { Category } from '@/api/Api'

interface CategoriesState {
  categories: Category[]
  isLoading: boolean
}

export const useCategoriesStore = defineStore('categories', {
  state: (): CategoriesState => ({
    categories: [],
    isLoading: false,
  }),

  actions: {
    async fetchCategories() {
      if (this.categories.length > 0) return
      this.isLoading = true
      try {
        const response = await api.api.clubsCategoriesList({ page_size: 100 })
        this.categories = response.data.results
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        this.isLoading = false
      }
    },
  },

  getters: {
    topLevelCategories(state): Category[] {
      return state.categories.filter(c => c.parent === null)
    },
    childrenOf: (state) => (parentId: number): Category[] => {
      return state.categories.filter(c => c.parent === parentId)
    },
    categoryById: (state) => (id: number | null | undefined): Category | null => {
      if (id == null) return null
      return state.categories.find(c => c.id === id) ?? null
    },
    categoryBySlug: (state) => (slug: string | undefined): Category | null => {
      if (!slug) return null
      return state.categories.find(c => c.slug === slug) ?? null
    },
    pathById: (state) => (id: number): Category[] => {
      const path: Category[] = []
      let current: Category | null = state.categories.find(c => c.id === id) ?? null
      while (current) {
        path.unshift(current)
        const parentId = current.parent
        current = parentId != null
          ? state.categories.find(c => c.id === parentId) ?? null
          : null
      }
      return path
    },
    nameById: (state) => (id: number | null | undefined): string => {
      const category = state.categories.find(c => c.id === id)
      return category ? category.name : ''
    },
  },
})
