<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useClubsStore } from '@/stores/clubs'
import { useAuthStore } from '@/stores/auth'
import type { Category } from '@/api/Api'

defineProps<{
  title: string
  categories: Category[]
  activeId?: number | null
}>()

const router = useRouter()
const route = useRoute()
const clubsStore = useClubsStore()
const authStore = useAuthStore()

const openCategory = (slug: string) => {
  router.push(`/categories/${slug}`)
}

const goToAllCategories = () => {
  router.push('/clubs')
}

const handleMemberToggle = () => {
  if (!authStore.isAuthenticated) {
    const from = route.fullPath
    router.push({ name: 'signin', query: { redirect: from } })
    return
  }
  const next = clubsStore.activeFilter === 'member' ? 'all' : 'member'
  clubsStore.filterByMembership(next)
}
</script>

<template>
  <aside class="sidebar">
    <label class="member-checkbox">
      <input
        type="checkbox"
        class="member-checkbox-input"
        :checked="clubsStore.activeFilter === 'member'"
        @change="handleMemberToggle"
      />
      <span class="member-checkbox-box">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span class="member-checkbox-label">Участвую</span>
    </label>

    <h2 class="sidebar-title">{{ title }}</h2>

    <div v-if="categories.length" class="cat-list">
      <button
        v-for="c in categories"
        :key="c.id"
        type="button"
        class="cat-item"
        :class="{ active: activeId === c.id }"
        @click="openCategory(c.slug)"
      >
        <span class="cat-name">{{ c.name }}</span>
        <svg class="cat-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>

    <div v-else class="sidebar-empty">
      {{ activeId != null ? 'Подкатегорий пока нет' : 'Категории появятся позже' }}
    </div>

    <div v-if="activeId != null" class="sidebar-footer">
      <button type="button" class="sidebar-back" @click="goToAllCategories">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Все категории
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--color-surface);
  border-radius: var(--radius-2xl);
  padding: 20px 16px;
  position: sticky;
  top: 96px;
}

.member-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  padding: 10px 12px;
}

.member-checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.member-checkbox-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1.5px solid var(--color-text-secondary);
  color: transparent;
  background: var(--color-surface);
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.member-checkbox-input:checked + .member-checkbox-box {
  background: var(--color-brand);
  border-color: var(--color-brand);
  color: #FFFFFF;
}

.member-checkbox-input:focus-visible + .member-checkbox-box {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
}

.member-checkbox-label {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  line-height: 1;
  color: var(--color-text);
  white-space: nowrap;
}

.sidebar-title {
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.2;
  color: var(--color-text);
  padding: 12px 12px 8px;
}

.cat-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.cat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  color: var(--color-text);
  cursor: pointer;
  text-align: left;
  transition: background var(--duration-fast) ease, color var(--duration-fast) ease;
}

.cat-item:hover {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}

.cat-item.active {
  background: var(--color-brand);
  color: #FFFFFF;
}

.cat-arrow {
  flex-shrink: 0;
  color: var(--color-text-muted);
  transition: color var(--duration-fast) ease, transform var(--duration-fast) ease;
}

.cat-item:hover .cat-arrow {
  color: var(--color-brand);
  transform: translateX(2px);
}

.cat-item.active .cat-arrow {
  color: rgba(255, 255, 255, 0.85);
}

.sidebar-empty {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.5;
  color: var(--color-text-secondary);
  padding: 8px 12px;
}

.sidebar-footer {
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-stroke-subtle);
}

.sidebar-back {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-brand-soft);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-brand);
  cursor: pointer;
  transition: background var(--duration-fast) ease;
}

.sidebar-back:hover {
  background: var(--color-brand-ring);
}

@media (max-width: 768px) {
  .sidebar {
    position: static;
    border-radius: var(--radius-xl);
    padding: 16px 12px;
  }
}
</style>
