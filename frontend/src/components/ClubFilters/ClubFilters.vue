<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useClubsStore } from '@/stores/clubs'
import { useClubsView } from '@/composables/useClubsView'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import type { ClubTypeEnum } from '@/api/Api'

const clubsStore = useClubsStore()
const { viewMode } = useClubsView()

const searchQuery = ref('')
const activeType = ref<ClubTypeEnum>('book')
const searchInput = ref<HTMLInputElement | null>(null)
const mounted = ref(false)
const isSticky = ref(false)
const filtersRef = ref<HTMLElement | null>(null)

const typeFilters = ['book', 'author'] as const

const typeLabels: Record<string, string> = {
  book: 'По книге',
  author: 'Авторские',
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => clubsStore.activeType,
  (val) => {
    activeType.value = val ?? 'book'
  },
  { immediate: true },
)

function onScroll() {
  if (!filtersRef.value) return
  isSticky.value = filtersRef.value.getBoundingClientRect().top <= 0
}

onMounted(() => {
  mounted.value = true
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const doSearch = (query: string) => {
  if (query.trim()) {
    clubsStore.searchClubs(query.trim())
  } else {
    clubsStore.fetchClubs()
  }
}

watch(searchQuery, (val) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => doSearch(val), 200)
})

const handleSearch = () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  doSearch(searchQuery.value)
}

const handleSearchKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleSearch()
  }
}

const applyTypeFilter = (type: 'book' | 'author') => {
  activeType.value = type
  clubsStore.filterByType(type)
}
</script>

<template>
  <div ref="filtersRef" class="filters-section" :class="{ 'is-sticky': isSticky }">
    <div class="search-row">
      <div class="search-bar">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Найти книжный клуб"
          class="search-input"
          @keydown="handleSearchKeydown"
        />
        <BaseButton variant="primary" class="search-btn" aria-label="Найти" @click="handleSearch">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </BaseButton>
      </div>

      <div class="view-toggle" role="group" aria-label="Вид карточек">
        <button
          type="button"
          class="view-toggle-btn"
          :class="{ active: viewMode === 'grid' }"
          aria-label="Блоки"
          :aria-pressed="viewMode === 'grid'"
          data-testid="view-toggle-grid"
          @click="viewMode = 'grid'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
          </svg>
        </button>
        <button
          type="button"
          class="view-toggle-btn"
          :class="{ active: viewMode === 'list' }"
          aria-label="Длинные карточки"
          :aria-pressed="viewMode === 'list'"
          data-testid="view-toggle-list"
          @click="viewMode = 'list'"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="4" width="18" height="4" rx="2" />
            <rect x="3" y="10" width="18" height="4" rx="2" />
            <rect x="3" y="16" width="18" height="4" rx="2" />
          </svg>
        </button>
      </div>
    </div>

        <div class="right-filters">
      <div class="type-tabs" role="group" aria-label="Тип клуба" data-testid="club-type-tabs">
        <button
          v-for="t in typeFilters"
          :key="t"
          type="button"
          class="type-tab"
          :class="{ active: activeType === t, 'active-pop': activeType === t && mounted }"
          :aria-pressed="activeType === t"
          data-testid="club-type-tab"
          :data-type="t"
          @click="applyTypeFilter(t)"
        >
          {{ typeLabels[t] }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filters-section {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 704px) 300px;
  justify-content: center;
  align-items: start;
  gap: 16px;
}

.right-filters {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
}

.type-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: var(--color-surface);
  border-radius: 30px;
  width: 100%;
  height: 64px;
  box-sizing: border-box;
}

.type-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 10px 20px;
  background: transparent;
  border: none;
  border-radius: 30px;
  font-family: var(--font-body);
  font-size: 20px;
  font-weight: 500;
  line-height: 1.21;
  color: var(--color-text);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.25s ease, color 0.25s ease;
}

.type-tab-icon {
  flex-shrink: 0;
  color: var(--color-text-secondary);
}

.type-tab.active {
  background: var(--color-brand);
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(59, 62, 255, 0.25);
}

.type-tab:not(.active):hover {
  background: var(--color-brand-soft);
}

.type-tab.active-pop {
  animation: active-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (min-width: 769px) {
  .filters-section {
    position: sticky;
    top: 0;
    z-index: 30;
    padding-top: 12px;
    margin-top: -12px;
    background: var(--color-bg);
  }

  .filters-section::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -40px;
    height: 40px;
    background: linear-gradient(to bottom, var(--color-bg), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .filters-section.is-sticky::after {
    opacity: 1;
  }
}

.search-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  background: var(--color-surface);
  border-radius: 30px;
  padding: 8px 10px 8px 24px;
  gap: 8px;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  font-family: var(--font-body);
  font-size: 20px;
  font-weight: 400;
  line-height: 1.21;
  color: var(--color-text);
  outline: none;
  min-width: 0;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.search-btn {
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 30px;
  flex-shrink: 0;
}

.search-icon {
  display: block;
}

.view-toggle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: var(--color-surface);
  border-radius: 30px;
}

.view-toggle-btn {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 30px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.view-toggle-btn:hover {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}

.view-toggle-btn.active {
  background: var(--color-brand);
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(59, 62, 255, 0.25);
}

@keyframes active-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.06); }
  100% { transform: scale(1); }
}

@media (max-width: 900px) {
  .filters-section {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .search-bar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .view-toggle {
    display: none;
  }

  .search-bar {
    width: 100%;
    padding: 6px 6px 6px 16px;
    gap: 6px;
  }

  .search-input {
    font-size: 16px;
  }

  .search-btn {
    width: 40px;
    height: 40px;
    border-radius: 30px;
  }

  .view-toggle {
    gap: 2px;
    padding: 6px;
  }

  .view-toggle-btn {
    width: 40px;
    height: 40px;
    border-radius: 30px;
  }
}

@media (max-width: 480px) {
  .filters-section {
    gap: 8px;
  }

  .search-bar {
    padding: 4px 4px 4px 12px;
    gap: 4px;
  }

  .search-input {
    font-size: 16px;
  }

  .search-btn {
    width: 34px;
    height: 34px;
    border-radius: 30px;
  }

  .search-icon {
    width: 18px;
    height: 18px;
  }

  .view-toggle-btn {
    width: 34px;
    height: 34px;
    border-radius: 30px;
  }

  .view-toggle-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>
