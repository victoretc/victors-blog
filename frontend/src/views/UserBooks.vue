<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useReadingListStore } from '@/stores/readingList'
import PaginationControls from '@/components/PaginationControls/PaginationControls.vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { getStars, formatDate, userDisplayName } from '@/utils/format'
import { pagesLabel } from '@/utils/plural'

const route = useRoute()
const readingListStore = useReadingListStore()

const userId = () => Number(route.params.id)

onMounted(() => {
  readingListStore.fetchReadingList(userId())
})

watch(
  () => route.params.id,
  () => {
    readingListStore.fetchReadingList(userId())
  },
)
</script>

<template>
  <div class="books-page" data-testid="user-books-page">
    <Transition name="fade-slide" mode="out-in">
      <div v-if="readingListStore.isLoading" key="loading" class="books-list books-loading">
        <div v-for="n in 3" :key="n" class="skeleton-card">
          <div class="skeleton-heading">
            <div class="skeleton-line skeleton-title" />
            <div class="skeleton-line skeleton-badge" />
          </div>
          <div class="skeleton-line skeleton-author" />
          <div class="skeleton-line skeleton-desc" />
          <div class="skeleton-line skeleton-desc skeleton-desc--short" />
        </div>
      </div>

      <div v-else-if="readingListStore.isHidden" key="hidden" class="no-results">
        <img src="@/assets/images/not-found.png" alt="Страница скрыта" class="not-found-img" />
        <p class="hidden-text">Страница скрыта или не существует</p>
      </div>

      <div v-else-if="readingListStore.error" key="error" class="error-state">
        <p class="error-text" data-testid="user-books-error">{{ readingListStore.error }}</p>
        <BaseButton variant="outline" testId="user-books-retry-button" @click="readingListStore.fetchReadingList(userId())">
          Попробовать снова
        </BaseButton>
      </div>

      <div v-else-if="readingListStore.owner" key="content" class="books-content">
        <div class="books-head">
          <h1 class="books-title">Прочитанные книги</h1>
          <span v-if="readingListStore.owner" class="books-owner" data-testid="user-books-owner">
            {{ userDisplayName(readingListStore.owner) }}
          </span>
        </div>

        <div v-if="readingListStore.books.length === 0" class="no-results">
          <img src="@/assets/images/not-found.png" alt="Пока нет книг" class="not-found-img" />
        </div>

        <div v-else class="books-list">
          <div
            v-for="book in readingListStore.books"
            :key="book.id"
            class="book-card"
            data-testid="user-books-card"
          >
            <div class="card-header">
              <h3 class="card-title" data-testid="user-books-book-title">{{ book.bookTitle }}</h3>
              <span class="year-badge">{{ book.publicationYear }}</span>
            </div>

            <div class="card-author">{{ book.bookAuthors }}</div>

            <p class="card-desc">{{ book.description }}</p>

            <div class="card-divider" />

            <div v-if="book.review" class="review-block" data-testid="user-books-review">
              <div class="review-meta">
                <span class="stars">{{ getStars(book.review.assessment) }}</span>
                <span class="pages-badge">{{ pagesLabel(book.review.readPages) }}</span>
              </div>
              <p class="review-text">{{ book.review.review }}</p>
              <span class="review-date">{{ formatDate(book.review.created) }}</span>
            </div>

            <p v-else class="review-empty" data-testid="user-books-review-empty">Отзыв не оставлен</p>
          </div>
        </div>

        <PaginationControls
          v-if="readingListStore.books.length > 0 && !readingListStore.isLoading"
          class="pagination-wrap"
          :current-page="readingListStore.pagination.currentPage"
          :total-pages="readingListStore.totalPages"
          :page-size="readingListStore.pagination.pageSize"
          @page-change="readingListStore.goToPage"
          @page-size-change="readingListStore.changePageSize"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.books-page {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.books-content {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.books-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.books-title {
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 500;
  line-height: 1.1;
  color: var(--color-text);
  margin: 0;
}

.books-owner {
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text-secondary);
}

.books-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.pagination-wrap {
  margin-top: auto;
}

.book-card {
  width: 704px;
  max-width: 100%;
  background: var(--color-surface);
  border-radius: 32px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.card-title {
  font-family: var(--font-heading);
  font-size: 30px;
  font-weight: 500;
  line-height: 1.1;
  color: var(--color-text);
  word-break: break-word;
}

.year-badge {
  padding: 4px 10px;
  background: var(--color-bg);
  border: 1px solid var(--color-stroke-subtle);
  border-radius: 30px;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.21;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.card-author {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 400;
  line-height: 1.21;
  color: var(--color-text-secondary);
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
  margin: 0;
}

.card-divider {
  height: 1px;
  background: var(--color-stroke-subtle);
}

.review-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stars {
  color: var(--color-brand);
  font-size: 18px;
  letter-spacing: 2px;
}

.pages-badge {
  padding: 6px 14px;
  background: var(--color-bg);
  border-radius: 30px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.review-text {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text);
  white-space: pre-line;
  margin: 0;
}

.review-date {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.review-empty {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 704px;
  max-width: 100%;
}

.not-found-img {
  max-width: 100%;
  height: auto;
  width: 360px;
}

.hidden-text {
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text-secondary);
  text-align: center;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 24px;
  text-align: center;
}

.error-text {
  color: var(--color-error);
  font-weight: 500;
}

.books-loading {
  gap: 16px;
}

.skeleton-card {
  width: 704px;
  max-width: 100%;
  background: var(--color-surface);
  border-radius: 32px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-heading {
  display: flex;
  justify-content: space-between;
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

.skeleton-badge {
  width: 60px;
  height: 28px;
  flex-shrink: 0;
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

@keyframes skeleton-shimmer {
  0% { translate: -100%; }
  100% { translate: 100%; }
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

@media (max-width: 768px) {
  .book-card {
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

  .not-found-img {
    max-width: 100%;
    height: auto;
  }

  .no-results {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .books-page {
    gap: 12px;
  }

  .books-list {
    gap: 12px;
  }

  .book-card {
    padding: 16px;
    gap: 8px;
  }

  .card-title {
    font-size: 20px;
  }

  .year-badge {
    font-size: 12px;
    padding: 3px 8px;
  }

  .card-author {
    font-size: 13px;
  }

  .card-desc {
    font-size: 13px;
    line-height: 1.5;
    -webkit-line-clamp: 2;
  }

  .review-text {
    font-size: 14px;
  }

  .skeleton-card {
    padding: 16px;
    gap: 8px;
  }

  .skeleton-title {
    height: 24px;
  }

  .skeleton-badge {
    width: 48px;
    height: 22px;
  }

  .skeleton-author {
    height: 15px;
  }

  .skeleton-desc {
    height: 14px;
  }
}
</style>
