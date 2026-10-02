<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { showToast } from '@/stores/toast'
import BaseButton from '@/components/BaseButton/BaseButton.vue'

const authStore = useAuthStore()
const router = useRouter()

const userInitials = computed(() => {
  const u = authStore.user
  if (!u) return '?'
  if (u.firstName && u.lastName) return (u.firstName[0] + u.lastName[0]).toUpperCase()
  if (u.firstName) return u.firstName[0].toUpperCase()
  if (u.lastName) return u.lastName[0].toUpperCase()
  if (u.email) return u.email[0].toUpperCase()
  if (u.username) return u.username[0].toUpperCase()
  return '?'
})

const isLoading = ref(false)
const error = ref('')
const success = ref('')

const isUpdatingVisibility = ref(false)

const isReadingListPublic = computed(() => !!authStore.user?.isReadingListPublic)

const readingListUrl = computed(() => {
  if (!authStore.user) return ''
  return `${window.location.origin}/users/${authStore.user.id}/books`
})

const toggleReadingListVisibility = async () => {
  const nextValue = !isReadingListPublic.value
  isUpdatingVisibility.value = true

  try {
    await authStore.updateUser({ isReadingListPublic: nextValue })
    if (authStore.user) {
      authStore.user.isReadingListPublic = nextValue
    }
    showToast(
      nextValue ? 'Страница прочитанных книг опубликована' : 'Страница прочитанных книг скрыта',
      'success',
    )
  } catch {
    showToast('Не удалось обновить видимость страницы', 'error')
  } finally {
    isUpdatingVisibility.value = false
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(readingListUrl.value)
    showToast('Ссылка скопирована', 'success')
  } catch {
    showToast('Не удалось скопировать ссылку', 'error')
  }
}

const openReadingList = () => {
  if (readingListUrl.value) {
    window.open(readingListUrl.value, '_blank', 'noopener,noreferrer')
  }
}

const editForm = ref({
  username: '',
  firstName: '',
  lastName: '',
  email: '',
})

function initForm() {
  if (authStore.user) {
    editForm.value = {
      username: authStore.user.username || '',
      firstName: authStore.user.firstName || '',
      lastName: authStore.user.lastName || '',
      email: authStore.user.email || '',
    }
  }
}

onMounted(initForm)

const handleLogout = async () => {
  await authStore.logout()
  router.push('/signin')
}

const updateProfile = async () => {
  isLoading.value = true
  error.value = ''
  success.value = ''

  try {
    const updatedData: Record<string, string> = {}

    if (editForm.value.username !== authStore.user?.username) {
      updatedData.username = editForm.value.username
    }
    if (editForm.value.firstName !== authStore.user?.firstName) {
      updatedData.first_name = editForm.value.firstName
    }
    if (editForm.value.lastName !== authStore.user?.lastName) {
      updatedData.last_name = editForm.value.lastName
    }
    if (editForm.value.email !== authStore.user?.email) {
      updatedData.email = editForm.value.email
    }

    if (Object.keys(updatedData).length > 0) {
      await authStore.updateUser(updatedData)
      success.value = 'Профиль успешно обновлен'
    } else {
      success.value = 'Нет изменений для сохранения'
    }
  } catch (err: unknown) {
    const apiError = err as {
      response?: {
        data?: {
          username?: string[]
          email?: string[]
        }
      }
    }
    const errors = apiError.response?.data

    if (errors?.username) {
      error.value = `Логин: ${errors.username.join(', ')}`
    } else if (errors?.email) {
      error.value = `Email: ${errors.email.join(', ')}`
    } else {
      error.value = 'Ошибка при обновлении профиля'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div v-if="authStore.user" class="profile-page">
    <div class="profile-split">
      <div class="profile-card">
        <div class="profile-avatar">
          {{ userInitials }}
        </div>

        <form @submit.prevent="updateProfile" class="edit-form">
          <div class="field">
            <label for="username">Логин</label>
            <input v-model="editForm.username" type="text" id="username" required placeholder="Логин" class="input" />
          </div>
          <div class="field">
            <label for="firstName">Имя</label>
            <input v-model="editForm.firstName" type="text" id="firstName" placeholder="Имя" class="input" />
          </div>
          <div class="field">
            <label for="lastName">Фамилия</label>
            <input v-model="editForm.lastName" type="text" id="lastName" placeholder="Фамилия" class="input" />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input v-model="editForm.email" type="email" id="email" placeholder="Email" class="input" />
          </div>

          <div v-if="error" class="msg msg--error">{{ error }}</div>
          <div v-if="success" class="msg msg--success">{{ success }}</div>

          <div class="form-actions">
            <BaseButton type="submit" variant="primary" full-width :loading="isLoading" :disabled="isLoading">
              Сохранить
            </BaseButton>
            <BaseButton variant="danger" full-width @click="handleLogout">Выйти</BaseButton>
          </div>
        </form>
      </div>

      <div class="reading-list-card" data-testid="reading-list-block">
        <h2 class="reading-list-title">Страница прочитанных книг</h2>
        <p class="reading-list-text">
          Опубликуй страницу прочитанных книг, чтобы поделиться ею с друзьями. На ней появятся
          книги из клубов, участником которых ты являешься, а также твои отзывы, если ты их оставил.
        </p>

        <template v-if="isReadingListPublic">
          <div class="reading-list-link">
            <a
              :href="readingListUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="link-value"
              data-testid="reading-list-link"
            >
              {{ readingListUrl }}
            </a>
            <button
              type="button"
              class="link-copy"
              aria-label="Скопировать ссылку"
              data-testid="reading-list-copy-button"
              @click="copyLink"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
          </div>

          <BaseButton
            variant="brand-outline"
            full-width
            testId="reading-list-open-button"
            @click="openReadingList"
          >
            Открыть мою страницу
          </BaseButton>

          <BaseButton
            variant="danger"
            full-width
            :loading="isUpdatingVisibility"
            :disabled="isUpdatingVisibility"
            testId="reading-list-hide-button"
            @click="toggleReadingListVisibility"
          >
            Скрыть страницу прочитанных мной книг
          </BaseButton>
        </template>

        <BaseButton
          v-else
          variant="primary"
          full-width
          :loading="isUpdatingVisibility"
          :disabled="isUpdatingVisibility"
          testId="reading-list-publish-button"
          @click="toggleReadingListVisibility"
        >
          Опубликовать страницу прочитанных мной книг
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  width: 100%;
}

.profile-split {
  display: flex;
  width: 100%;
  gap: 24px;
  align-items: flex-start;
}

.profile-card {
  flex: 1;
  min-width: 0;
  background: var(--color-surface);
  border-radius: 32px;
  padding: 36px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 52px;
  font-weight: 400;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0.12em;
  text-indent: 0.12em;
  color: var(--color-brand);
}

.edit-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  width: 100%;
}

.field label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--color-text-secondary);
}

.input {
  width: 100%;
  height: 48px;
  background: var(--color-surface);
  border: 1px solid var(--color-stroke-subtle);
  border-radius: 12px;
  padding: 0 16px;
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text);
  transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}

.input::placeholder {
  color: var(--color-text-secondary);
}

.input:focus {
  outline: none;
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-ring);
}

.msg {
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.msg--error {
  color: var(--color-error);
}

.msg--success {
  color: var(--color-success);
}

.form-actions {
  display: flex;
  gap: 12px;
}

.reading-list-card {
  flex: 1;
  min-width: 0;
  background: var(--color-surface);
  border-radius: 32px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reading-list-title {
  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
  text-align: center;
}

.reading-list-text {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  text-align: center;
  margin: 0;
}

.reading-list-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px 4px 16px;
  background: var(--color-bg);
  border: 1px solid var(--color-stroke-subtle);
  border-radius: 16px;
}

.link-value {
  flex: 1;
  min-width: 0;
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.4;
  color: var(--color-text-secondary);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color var(--duration-fast) var(--ease-out);
}

.link-value:hover {
  color: var(--color-brand);
}

.link-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    background var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
}

.link-copy:hover {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}

.link-copy:active {
  filter: brightness(0.92);
}

@media (max-width: 768px) {
  .profile-split {
    flex-direction: column;
  }

  .profile-card,
  .reading-list-card {
    width: 100%;
  }

  .form-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .profile-card {
    padding: 24px;
  }

  .profile-avatar {
    font-size: 40px;
    letter-spacing: 0.1em;
    text-indent: 0.1em;
  }

  .reading-list-card {
    padding: 24px;
  }
}
</style>
