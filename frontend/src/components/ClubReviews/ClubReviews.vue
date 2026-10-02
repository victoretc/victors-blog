<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { useReviewsStore } from '@/stores/reviews'
import { useAuthStore } from '@/stores/auth'
import { showToast } from '@/stores/toast'
import type { BookReview, Member } from '@/api/Api'
import { getStars, formatDate } from '@/utils/format'
import BaseButton from '@/components/BaseButton/BaseButton.vue'

const props = defineProps<{
  clubId: number
  clubMembers: Member[]
  clubOwner?: number
}>()

const reviewsStore = useReviewsStore()
const authStore = useAuthStore()

const formState = ref<'idle' | 'creating' | 'editing'>('idle')
const editingReviewId = ref<number | null>(null)
const isLoading = ref(false)
const error = ref('')

const formRef = ref<HTMLElement | null>(null)



const reviewForm = ref({
  review: '',
  assessment: 5,
  readPages: 0,
})

const userReview = ref<BookReview | null>(null)

const clubReviews = computed(() => {
  return reviewsStore.getClubReviews(props.clubId)
})

const canReview = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user) return false
  return props.clubMembers.some(m => m.id === authStore.user!.id) && !userReview.value
})

const canEditReview = (review: BookReview) => {
  return authStore.user?.id === review.user.id
}

const loadReviews = async () => {
  await reviewsStore.fetchClubReviews(props.clubId)

  if (authStore.user) {
    userReview.value = clubReviews.value.find((r) => r.user.id === authStore.user?.id) || null
  }
}

const startCreate = () => {
  formState.value = 'creating'
  editingReviewId.value = null
  reviewForm.value = { review: '', assessment: 5, readPages: 0 }
  error.value = ''
  nextTick(() => {
    formRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

const startEdit = (review: BookReview) => {
  formState.value = 'editing'
  editingReviewId.value = review.id
  reviewForm.value = {
    review: review.review,
    assessment: review.assessment,
    readPages: review.readPages ?? 0,
  }
  error.value = ''
  nextTick(() => {
    formRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

const cancelForm = () => {
  formState.value = 'idle'
  editingReviewId.value = null
  error.value = ''
}

const createReview = async () => {
  if (!reviewForm.value.review.trim()) {
    error.value = 'Пожалуйста, напишите отзыв'
    return
  }

  if (reviewForm.value.readPages < 0) {
    error.value = 'Количество прочитанных страниц не может быть отрицательным'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const newReview = await reviewsStore.createReview(props.clubId, {
      review: reviewForm.value.review,
      assessment: reviewForm.value.assessment,
      readPages: reviewForm.value.readPages,
    })

    userReview.value = newReview
    showToast('Отзыв успешно создан', 'success')
    formState.value = 'idle'
  } catch {
    error.value = 'Ошибка при создании отзыва'
  } finally {
    isLoading.value = false
  }
}

const updateReview = async () => {
  if (!editingReviewId.value) return

  if (!reviewForm.value.review.trim()) {
    error.value = 'Пожалуйста, напишите отзыв'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const updatedReview = await reviewsStore.updateReview(editingReviewId.value, {
      review: reviewForm.value.review,
      assessment: reviewForm.value.assessment,
      readPages: reviewForm.value.readPages,
    })

    if (userReview.value?.id === editingReviewId.value) {
      userReview.value = updatedReview
    }

    showToast('Отзыв успешно обновлен', 'success')
    formState.value = 'idle'
    editingReviewId.value = null
  } catch {
    error.value = 'Ошибка при обновлении отзыва'
  } finally {
    isLoading.value = false
  }
}

const deleteReview = async (reviewId: number) => {
  if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return

  try {
    await reviewsStore.deleteReview(reviewId, props.clubId)

    if (userReview.value?.id === reviewId) {
      userReview.value = null
    }

    showToast('Отзыв успешно удален', 'success')
  } catch {
    error.value = 'Ошибка при удалении отзыва'
  }
}

onMounted(loadReviews)
</script>

<template>
  <div class="reviews" data-testid="club-reviews">
    <div class="reviews-head">
      <h2 class="reviews-title" data-testid="club-reviews-title">Отзывы участников</h2>
      <BaseButton
        v-if="canReview && formState === 'idle' && !userReview"
        variant="primary"
        testId="club-reviews-create-button"
        @click="startCreate"
      >
        Написать отзыв
      </BaseButton>
    </div>

    <div v-if="error" class="msg msg--error" data-testid="club-reviews-error">{{ error }}</div>

    <div v-if="formState !== 'idle'" ref="formRef" class="review-form" data-testid="club-reviews-form">
      <h3 class="form-title">{{ formState === 'creating' ? 'Новый отзыв' : 'Редактирование отзыва' }}</h3>
      <form @submit.prevent="formState === 'creating' ? createReview() : updateReview()">
        <div class="form-group">
          <label for="assessment">Оценка</label>
          <input
            v-model.number="reviewForm.assessment"
            type="number"
            id="assessment"
            min="1"
            max="5"
            placeholder="Оценка от 1 до 5"
            class="form-input form-input--sm"
            data-testid="club-reviews-assessment-input"
          />
        </div>

        <div class="form-group">
          <label for="readPages">Прочитано страниц</label>
          <input
            v-model.number="reviewForm.readPages"
            type="number"
            id="readPages"
            min="0"
            placeholder="Сколько страниц прочитали"
            class="form-input form-input--sm"
            data-testid="club-reviews-pages-input"
          />
        </div>

        <div class="form-group">
          <label for="review">Ваш отзыв</label>
          <textarea
            v-model="reviewForm.review"
            id="review"
            rows="4"
            placeholder="Поделитесь своими впечатлениями о книге..."
            class="form-textarea"
            required
            data-testid="club-reviews-text-input"
          />
        </div>

        <div class="form-actions">
          <BaseButton type="submit" variant="primary" :loading="isLoading" :disabled="isLoading" testId="club-reviews-submit-button">
            {{ formState === 'creating' ? 'Опубликовать' : 'Сохранить' }}
          </BaseButton>
          <BaseButton variant="outline" @click="cancelForm" :disabled="isLoading" testId="club-reviews-cancel-button">
            Отмена
          </BaseButton>
        </div>
      </form>
    </div>

    <div v-if="clubReviews.length > 0" class="reviews-list" data-testid="club-reviews-list">
      <div
        v-for="(review, index) in clubReviews"
        :key="review.id"
        class="review-card"
        :class="{ 'review-card--mine': review.user.id === authStore.user?.id }"
        :data-testid="`club-review-on-row-${index}-card`"
      >
        <div class="review-head">
          <div class="reviewer">
            <span class="reviewer-avatar">{{ review.user.username?.[0] || '?' }}</span>
            <span class="reviewer-name">{{ review.user.username || 'Пользователь' }}</span>
          </div>
          <div class="review-meta">
            <span class="stars">{{ getStars(review.assessment) }}</span>
            <span class="pages-badge">{{ review.readPages }} стр.</span>
          </div>
        </div>

        <p class="review-text">{{ review.review }}</p>

        <div class="review-foot">
          <span class="review-date">{{ formatDate(review.created) }}</span>
          <div v-if="canEditReview(review) && formState === 'idle'" class="review-actions">
            <BaseButton variant="ghost" :testId="`club-review-on-row-${index}-edit-button`" @click="startEdit(review)">Редактировать</BaseButton>
            <BaseButton variant="danger" :testId="`club-review-on-row-${index}-delete-button`" @click="deleteReview(review.id)">Удалить</BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="formState === 'idle' && !isLoading" class="empty" data-testid="club-reviews-empty">
      Пока нет отзывов. Будьте первым!
    </div>

    <div v-if="reviewsStore.isLoading && !isLoading" class="loading" data-testid="club-reviews-loading">Загрузка отзывов...</div>
  </div>
</template>

<style scoped>
.reviews {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid var(--color-stroke-subtle);
}

.reviews-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.reviews-title {
  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 500;
  color: var(--color-text);
}

.review-form {
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;
  background: var(--color-bg);
}

.form-title {
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--color-text-secondary);
}

.form-input::-webkit-inner-spin-button,
.form-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.form-input[type='number'] {
  -moz-appearance: textfield;
}

.form-input,
.form-textarea {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-stroke-subtle);
  border-radius: 12px;
  padding: 12px 16px;
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text);
  transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}

.form-input--sm {
  max-width: 160px;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-ring);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.msg {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
}

.msg--error {
  color: var(--color-error);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  background: var(--color-surface);
  border-radius: 24px;
  padding: 24px;
}

.review-card--mine {
  box-shadow: inset 0 0 0 1px var(--color-brand);
}

.review-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.reviewer {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-brand);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  flex-shrink: 0;
}

.reviewer-name {
  font-size: 16px;
  font-weight: 500;
  font-family: var(--font-body);
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
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
  font-size: 15px;
  line-height: 1.7;
  color: var(--color-text);
  white-space: pre-line;
  margin-bottom: 16px;
}

.review-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid var(--color-stroke-subtle);
}

.review-date {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.review-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.empty {
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 15px;
  padding: 40px 24px;
  background: var(--color-surface);
  border-radius: 24px;
}

.loading {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 24px;
}

@media (max-width: 600px) {
  .review-form {
    padding: 16px;
  }

  .form-actions {
    flex-direction: column;
  }

  .review-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
