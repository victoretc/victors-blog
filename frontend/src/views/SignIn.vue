<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import heroImg from '@/assets/images/eugene-golovesov-zUuJz_idfqM-unsplash.jpg'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const step = ref<'email' | 'code'>('email')
const form = reactive({
  email: '',
  code: '',
})
const error = ref('')
const isLoading = ref(false)

async function requestCodeHandler() {
  isLoading.value = true
  error.value = ''
  try {
    await authStore.requestCode(form.email)
    step.value = 'code'
  } catch (e) {
    const err = e as { detail?: string }
    error.value = err.detail || 'Ошибка при отправке кода'
  } finally {
    isLoading.value = false
  }
}

async function verifyCodeHandler() {
  isLoading.value = true
  error.value = ''
  try {
    await authStore.verifyCode(form.email, form.code)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
    if (redirect) {
      router.push(redirect)
      return
    }
    const joinClubId = route.query.join
    if (joinClubId) {
      router.push({ name: 'club-details', params: { id: Number(joinClubId) } })
    } else {
      router.push('/clubs')
    }
  } catch (e) {
    const err = e as { detail?: string }
    error.value = err.detail || 'Неверный код подтверждения'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-page" data-testid="login-page">
    <button class="auth-close" @click="router.push('/clubs')" aria-label="Закрыть">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>

    <div class="auth-split" data-testid="login-container">
      <div class="auth-left">
        <div class="auth-left-img" :style="{ backgroundImage: `url(${heroImg})` }" />
        <div class="auth-left-overlay" />
        <div class="auth-left-content">
          <p class="auth-description">
            После того как вы войдете вы сможете создавать клубы,
            присоединяться к существующим клубам, создавать страницу прочитанных вами книг
          </p>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-right-inner">
          <h2 class="auth-title">Вход</h2>

          <form v-if="step === 'email'" @submit.prevent="requestCodeHandler" class="auth-form" data-testid="login-form-element">
            <div class="auth-field">
              <label for="email">Электропочта <span class="required">*</span></label>
              <input
                v-model="form.email"
                type="email"
                id="email"
                required
                placeholder="example@yandex.ru"
                class="auth-input"
                data-testid="email-input"
              />
            </div>
            <button type="submit" class="auth-submit" :disabled="isLoading" data-testid="submit-button">
              {{ isLoading ? 'Отправка…' : 'Получить код' }}
            </button>
            <p v-if="error" class="auth-error">{{ error }}</p>
          </form>

          <form v-else @submit.prevent="verifyCodeHandler" class="auth-form">
            <div class="auth-field">
              <label for="code">Код из письма</label>
              <input
                v-model="form.code"
                type="text"
                id="code"
                required
                inputmode="numeric"
                maxlength="4"
                placeholder="0000"
                class="auth-input"
                data-testid="code-input"
                autocomplete="one-time-code"
              />
            </div>
            <button type="submit" class="auth-submit" :disabled="isLoading || form.code.length !== 4" data-testid="verify-button">
              {{ isLoading ? 'Проверка…' : 'Подтвердить' }}
            </button>
            <p v-if="error" class="auth-error">{{ error }}</p>
            <p class="auth-recovery">Если код не пришёл — проверьте «Спам»</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--color-bg);
}

.auth-close {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.12);
  color: #fff;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.auth-close:hover {
  background: rgba(0, 0, 0, 0.24);
}

.auth-split {
  display: flex;
  width: 100%;
  height: 100%;
}

.auth-left {
  position: relative;
  width: 40%;
  overflow: hidden;
  border-radius: var(--radius-2xl);
  margin: 16px;
}

.auth-left-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.auth-left-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.55) 100%);
}

.auth-left-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  padding: 48px 40px;
  color: #fff;
}

.auth-description {
  font-family: var(--font-body);
  font-size: 22px;
  font-weight: 600;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
}

.auth-right {
  width: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 40px;
}

.auth-right-inner {
  width: 100%;
  max-width: 400px;
}

.auth-title {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 500;
  line-height: 1.1;
  color: var(--color-text);
  margin: 0 0 32px;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-field {
  display: flex;
  flex-direction: column;
}

.auth-field label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--color-text-secondary);
}

.required {
  color: var(--color-error);
}

.auth-input {
  width: 100%;
  height: 48px;
  background: var(--color-surface);
  border: 1px solid var(--color-stroke-subtle);
  border-radius: 12px;
  padding: 0 16px;
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text);
  transition: border-color var(--duration-fast) var(--ease-out),
              box-shadow var(--duration-fast) var(--ease-out);
}

.auth-input::placeholder {
  color: var(--color-text-secondary);
}

.auth-input:focus {
  outline: none;
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-ring);
}

.auth-submit {
  height: 48px;
  border-radius: 12px;
  border: none;
  background: var(--color-brand);
  cursor: pointer;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  transition: background var(--duration-fast) var(--ease-out);
}

.auth-submit:hover {
  background: #2e30cc;
}

.auth-submit:active {
  background: #2528b5;
}

.auth-submit:disabled {
  background: #C0C0CC;
  cursor: not-allowed;
}

.auth-error {
  color: var(--color-error);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.auth-recovery {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.5;
  text-align: center;
  margin: 0;
}

@media (max-width: 768px) {
  .auth-split {
    flex-direction: column;
  }

  .auth-left {
    width: 100%;
    height: 40%;
    min-height: 200px;
  }

  .auth-right {
    width: 100%;
    height: 60%;
    padding: 28px 24px;
    overflow-y: auto;
  }

  .auth-left-content {
    padding: 28px 24px;
  }

  .auth-description {
    font-size: 18px;
  }

  .auth-title {
    font-size: 24px;
    margin-bottom: 24px;
  }

  .auth-close {
    top: 16px;
    right: 16px;
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
