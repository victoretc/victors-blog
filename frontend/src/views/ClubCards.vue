<script setup lang="ts">
import { onMounted, computed, ref, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useClubsStore } from '@/stores/clubs'
import { useCategoriesStore } from '@/stores/categories'
import type { Club, Member } from '@/api/Api'
import { ClubTypeEnum } from '@/api/Api'
import ClubFilters from '@/components/ClubFilters/ClubFilters.vue'
import CategorySidebar from '@/components/CategorySidebar/CategorySidebar.vue'
import BreadcrumbsNav from '@/components/Breadcrumbs/BreadcrumbsNav.vue'
import type { Crumb } from '@/components/Breadcrumbs/BreadcrumbsNav.vue'
import { useClubsView } from '@/composables/useClubsView'
import { memberReadingText } from '@/utils/plural'

const clubsStore = useClubsStore()
if (clubsStore.clubs.length === 0) {
  clubsStore.isLoading = true
}
const categoriesStore = useCategoriesStore()
const router = useRouter()
const route = useRoute()
const { viewMode } = useClubsView()

const currentSlug = computed(() => String(route.params.slug ?? ''))
const currentCategory = computed(() => categoriesStore.categoryBySlug(currentSlug.value))
const sidebarCategories = computed(() => {
  if (currentCategory.value) {
    return categoriesStore.childrenOf(currentCategory.value.id)
  }
  return categoriesStore.topLevelCategories
})
const sidebarTitle = computed(() => (currentCategory.value ? 'Подкатегории' : 'Категории'))
const breadcrumbTrail = computed<Crumb[]>(() => {
  const trail: Crumb[] = [{ label: 'Клубы', to: '/clubs' }]
  if (currentCategory.value) {
    const path = categoriesStore.pathById(currentCategory.value.id)
    path.forEach((c, i) => {
      trail.push({
        label: c.name,
        to: i < path.length - 1 ? `/categories/${c.slug}` : undefined,
      })
    })
  }
  return trail
})

onMounted(async () => {
  await categoriesStore.fetchCategories()
  await loadClubsByRoute()
})

watch(currentSlug, async () => {
  await categoriesStore.fetchCategories()
  await loadClubsByRoute()
})

const showScrollTop = ref(false)

function onScroll() {
  showScrollTop.value = window.scrollY > window.innerHeight * 0.6

  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = window.scrollY
  const clientHeight = window.innerHeight
  if (scrollHeight - scrollTop - clientHeight < 400) {
    clubsStore.loadMore()
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const loadClubsByRoute = async () => {
  if (currentCategory.value) {
    await clubsStore.filterByCategory(currentCategory.value.id)
  } else {
    await clubsStore.fetchClubs()
  }
}

const goBackToCategories = () => {
  router.push('/clubs')
}

const openCategory = (slug: string) => {
  router.push(`/categories/${slug}`)
}

const isMember = (club: Club) => clubsStore.isCurrentUserMember(club)

const isAuthorClub = (club: Club) => club.clubType === ClubTypeEnum.Author

const authorInitial = (club: Club): string => {
  const name = club.authorName?.trim()
  return name ? name[0].toUpperCase() : '?'
}

const openClubPage = (clubId: number) => {
  router.push(`/clubs/${clubId}`)
}

const avatarColors = [
  { bg: '#E6E4FF', text: '#4A46C7' },
  { bg: '#DFF3E7', text: '#2E8B57' },
  { bg: '#FFECDD', text: '#C96A33' },
  { bg: '#F2E9FF', text: '#7A5CBB' },
  { bg: '#DEF2F4', text: '#2E8B8F' },
  { bg: '#FDE8EF', text: '#D15C8A' },
]

const getInitials = (m: Member): string => {
  if (m.firstName) return m.firstName[0].toUpperCase()
  return '?'
}

const memberInitials = (club: Club) => {
  return club.members.slice(0, 3).map((m, i) => ({
    initials: getInitials(m),
    color: avatarColors[i % avatarColors.length],
  }))
}
</script>

<template>
  <div class="clubs-page">
    <div class="clubs-content">
      <BreadcrumbsNav :trail="breadcrumbTrail" :trailing-slash="!currentCategory" />

    <ClubFilters />

    <nav class="category-chips" aria-label="Категории">
      <button
        v-if="currentCategory"
        type="button"
        class="chip chip--all"
        :class="{ 'chip--active': !currentCategory }"
        @click="goBackToCategories"
      >
        Все категории
      </button>
      <button
        v-for="c in sidebarCategories"
        :key="c.id"
        type="button"
        class="chip"
        :class="{ 'chip--active': currentCategory?.id === c.id }"
        @click="openCategory(c.slug)"
      >
        {{ c.name }}
      </button>
    </nav>

    <div class="content-grid">
      <div class="clubs-column">
        <Transition name="fade-slide" mode="out-in">
          <div v-if="clubsStore.isLoading" key="loading" class="clubs-list clubs-loading" :class="`clubs-list--${viewMode}`">
            <div v-for="n in 3" :key="n" class="skeleton-card" :class="`skeleton-card--${viewMode}`">
              <div class="skeleton-heading">
                <div class="skeleton-line skeleton-title" />
              </div>
              <div class="skeleton-line skeleton-author" />
              <div class="skeleton-line skeleton-desc" />
              <div class="skeleton-line skeleton-desc skeleton-desc--short" />
              <div class="skeleton-footer">
                <div class="skeleton-line skeleton-members" />
                <div class="skeleton-line skeleton-arrow" />
              </div>
            </div>
          </div>
          <div v-else-if="clubsStore.clubs.length === 0" key="empty" class="no-results">
            <img src="@/assets/images/not-found.png" alt="Ничего не найдено" class="not-found-img" />
          </div>
          <div v-else class="clubs-list" :class="`clubs-list--${viewMode}`">
            <div
              v-for="club in clubsStore.clubs"
              :key="club.id"
              class="club-card"
              :class="`club-card--${viewMode}`"
              @click="openClubPage(club.id)"
            >
              <div class="card-header">
                <h3 class="card-title">
                  <template v-if="isAuthorClub(club)">{{ club.authorName }}</template>
                  <template v-else>{{ club.bookTitle }}<span v-if="club.publicationYear" class="title-year"> &lt;{{ club.publicationYear }}&gt;</span></template>
                </h3>
              </div>

              <div v-if="isAuthorClub(club)" class="card-author-club">
                <img
                  v-if="club.authorPhoto"
                  :src="club.authorPhoto"
                  alt=""
                  class="author-avatar"
                />
              </div>

              <p v-if="isAuthorClub(club) && club.authorBio" class="card-desc">{{ club.authorBio }}</p>
              <p v-else class="card-desc">{{ club.description }}</p>

              <div v-if="isAuthorClub(club)" class="now-reading">
                Читают сейчас: «{{ club.bookTitle }}» ({{ club.publicationYear }})
              </div>

              <div class="card-footer">
                <div class="card-members">
                  <div class="member-avatars">
                    <span
                      v-for="(item, i) in memberInitials(club)"
                      :key="i"
                      class="member-avatar"
                      :style="{ backgroundColor: item.color.bg, color: item.color.text }"
                    >
                      {{ item.initials }}
                    </span>
                  </div>
                  <span class="member-count">{{ memberReadingText(club.members.length, isMember(club)) }}</span>
                </div>

                <span class="card-arrow" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </Transition>
        <div v-if="clubsStore.isLoadingMore" class="load-more-spinner">
          <div class="spinner" />
        </div>
      </div>

      <CategorySidebar
        class="category-sidebar"
        :title="sidebarTitle"
        :categories="sidebarCategories"
        :active-id="currentCategory?.id"
      />
    </div>

    <Transition name="scroll-top">
      <button
        v-if="showScrollTop"
        type="button"
        class="scroll-top"
        aria-label="Наверх"
        data-testid="scroll-top-button"
        @click="scrollToTop"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </Transition>
    </div>
  </div>
</template>

<style scoped>
.clubs-page {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
}

.clubs-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.category-chips {
  display: none;
}

.category-sidebar {
  display: block;
}

.chip {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-stroke-subtle);
  border-radius: 9999px;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.21;
  color: var(--color-text);
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.chip:not(.chip--active):hover {
  background: var(--color-brand-soft);
  color: var(--color-brand);
  border-color: var(--color-brand-ring);
}

.chip--active {
  background: var(--color-brand);
  border-color: rgba(59, 62, 255, 0.4);
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(59, 62, 255, 0.25);
}

.chip--all {
  border-style: dashed;
  border-color: var(--color-brand-ring);
  color: var(--color-brand);
  background: var(--color-brand-soft);
}

.chip--all.chip--active {
  border-style: solid;
}

.content-grid {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 704px) 300px;
  justify-content: center;
  gap: 24px 16px;
  align-items: start;
}

.clubs-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  min-width: 0;
}

.clubs-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

@media (min-width: 768px) {
  .clubs-list--grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: stretch;
  }

  .clubs-list--grid .club-card,
  .clubs-list--grid .skeleton-card {
    max-width: none;
  }
}

.pagination-wrap {
  width: 100%;
}

.club-card {
  width: 100%;
  max-width: 704px;
  background: var(--color-surface);
  border-radius: 32px;
  padding: 28px;
  cursor: pointer;
  transition: box-shadow var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.club-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

@media (min-width: 768px) {
  .club-card--grid {
    height: 100%;
    border-radius: 24px;
    padding: 20px;
    gap: 0;
    overflow: hidden;
  }

  .club-card--grid .card-header {
    margin-bottom: 8px;
  }

  .club-card--grid .card-author-club {
    margin-bottom: 8px;
  }

  .club-card--grid .now-reading {
    margin-bottom: 8px;
  }

  .club-card--grid .card-title {
    font-size: 18px;
  }

  .club-card--grid .card-author {
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .club-card--grid .author-avatar {
    width: 44px;
    height: 44px;
  }

  .club-card--grid .author-name {
    font-size: 16px;
  }

  .club-card--grid .now-reading {
    font-size: 12px;
  }

  .club-card--grid .card-desc {
    margin-top: auto;
    font-size: 14px;
    line-height: 1.55;
    -webkit-line-clamp: 2;
  }

  .club-card--grid .card-footer {
    margin-top: 12px;
    padding-top: 12px;
    gap: 8px;
  }

  .club-card--grid .title-year {
    font-size: 12px;
  }

  .club-card--grid .member-avatar,
  .club-card--grid .you-badge {
    width: 28px;
    height: 28px;
    font-size: 10px;
  }

  .club-card--grid .member-count {
    font-size: 13px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-title {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 500;
  line-height: 1.1;
  color: var(--color-text);
  overflow-wrap: break-word;
}

.title-year {
  font-family: var(--font-heading);
  font-weight: 500;
  color: var(--color-text-secondary);
}


.card-author {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.21;
  color: var(--color-text-secondary);
}

.card-author-club {
  display: flex;
  align-items: center;
  gap: 14px;
}

.author-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: var(--color-brand-soft);
}

.author-avatar--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-brand);
}

.now-reading {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-top: 8px;
}

.card-desc {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-stroke-subtle);
}

.card-members {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.member-avatars {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  color: #FFFFFF;
  border: 2px solid var(--color-surface);
  margin-left: -8px;
  flex-shrink: 0;
}

.member-avatar:first-child {
  margin-left: 0;
}

.you-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-brand);
  border: 2px solid var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  color: #FFFFFF;
  margin-left: -8px;
  flex-shrink: 0;
}

.member-count {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 400;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-arrow {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
}

.no-results {
  display: flex;
  justify-content: center;
  width: 100%;
}

.clubs-loading {
  gap: 16px;
}

.load-more-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 0;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--color-stroke-subtle);
  border-top-color: var(--color-brand);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.skeleton-card {
  width: 100%;
  max-width: 704px;
  background: var(--color-surface);
  border-radius: 32px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 768px) {
  .skeleton-card--grid {
    height: 100%;
    min-height: 260px;
    border-radius: 24px;
    padding: 20px;
    gap: 8px;
    overflow: hidden;
  }
}

.skeleton-heading {
  display: flex;
  align-items: center;
  gap: 16px;
}

.skeleton-line {
  height: 16px;
  border-radius: 8px;
  background: var(--color-stroke-subtle);
  position: relative;
  overflow: hidden;
}

.skeleton-line::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: skeleton-shimmer 1.6s ease-in-out infinite;
}

.skeleton-title {
  flex: 1;
  height: 32px;
}

.skeleton-author {
  width: 40%;
  height: 18px;
}

.skeleton-desc {
  width: 100%;
}

.skeleton-desc--short {
  width: 65%;
}

.skeleton-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--color-stroke-subtle);
}

.skeleton-members {
  width: 120px;
  height: 32px;
}

.skeleton-arrow {
  width: 18px;
  height: 18px;
}

@keyframes skeleton-shimmer {
  0% { translate: -100%; }
  100% { translate: 100%; }
}

.not-found-img {
  max-width: 100%;
  height: auto;
  width: 360px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .clubs-column {
    order: 1;
  }
}

@media (max-width: 768px) {
  .clubs-page {
    gap: 0;
  }

  .category-chips {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    padding: 2px 2px 6px;
    -webkit-overflow-scrolling: touch;
  }

  .category-chips::-webkit-scrollbar {
    display: none;
  }

  .category-sidebar {
    display: none;
  }

  .club-card {
    width: 100%;
    padding: 20px;
    gap: 10px;
  }

  .card-header {
    gap: 10px;
  }

  .card-title {
    font-size: 24px;
    flex: 1;
  }

  .card-author {
    font-size: 14px;
  }

  .card-desc {
    font-size: 14px;
  }

  .card-footer {
    gap: 12px;
    padding-top: 12px;
  }

  .member-count {
    font-size: 13px;
  }

  .not-found-img {
    max-width: 100%;
    width: 240px;
    height: auto;
  }

  .no-results {
    width: 100%;
  }
}

@media (hover: none) {
  .club-card:hover {
    box-shadow: none;
    transform: none;
  }
}

@media (max-width: 480px) {
  .clubs-page {
    gap: 12px;
  }

  .clubs-list {
    gap: 10px;
  }

  .clubs-column {
    gap: 16px;
  }

  .club-card {
    padding: 16px;
    gap: 8px;
  }

  .card-header {
    gap: 8px;
  }

  .card-title {
    font-size: 20px;
    flex: 1;
  }

  .card-author {
    font-size: 13px;
  }

  .card-desc {
    font-size: 13px;
    line-height: 1.5;
    -webkit-line-clamp: 2;
  }

  .card-footer {
    gap: 8px;
    padding-top: 10px;
  }

  .card-members {
    gap: 8px;
  }

  .member-avatar,
  .you-badge {
    width: 28px;
    height: 28px;
    font-size: 10px;
    border-width: 1.5px;
    margin-left: -6px;
  }

  .member-count {
    font-size: 12px;
  }

  .card-arrow svg {
    width: 16px;
    height: 16px;
  }

  .skeleton-card {
    padding: 16px;
    gap: 8px;
  }

  .skeleton-heading {
    gap: 8px;
  }

  .skeleton-title {
    height: 24px;
  }

  .skeleton-author {
    height: 15px;
  }

  .skeleton-desc {
    height: 14px;
  }

  .skeleton-footer {
    padding-top: 10px;
  }

  .skeleton-members {
    width: 100px;
    height: 28px;
  }
}

.scroll-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border: none;
  border-radius: 50%;
  background: var(--color-brand);
  color: #FFFFFF;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(59, 62, 255, 0.35);
  z-index: 40;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.scroll-top:hover {
  background: var(--color-brand);
  filter: brightness(1.08);
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(59, 62, 255, 0.4);
}

.scroll-top:active {
  transform: translateY(0);
}

.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 480px) {
  .scroll-top {
    right: 16px;
    bottom: 16px;
    width: 48px;
    height: 48px;
  }
}
</style>
