<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton/BaseButton.vue'

const CONSENT_KEY = 'cookie_consent'
const CONSENT_VERSION = '1'

const router = useRouter()
const visible = ref(false)

function acceptCookies() {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ version: CONSENT_VERSION, acceptedAt: new Date().toISOString() }),
  )
  visible.value = false
}

function openAgreement() {
  router.push('/agreement')
}

onMounted(() => {
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.version === CONSENT_VERSION) return
    }
  } catch {
    /* ignore corrupted storage */
  }
  window.setTimeout(() => {
    visible.value = true
  }, 600)
})
</script>

<template>
  <Transition name="cookie-pop">
    <div v-if="visible" class="cookie" role="dialog" aria-live="polite" data-testid="cookie-banner">
      <div class="cookie-card">
        <h2 class="cookie-title">Мы заботимся о ваших данных</h2>
        <p class="cookie-text">
          Используем файлы cookie для корректной работы сайта, аналитики и улучшения сервиса.
          Продолжая пользоваться сайтом, вы соглашаетесь с обработкой персональных данных
          в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
        </p>

        <div class="cookie-actions">
          <BaseButton variant="primary" data-testid="cookie-accept-button" @click="acceptCookies">
            Принять
          </BaseButton>
          <BaseButton variant="ghost" data-testid="cookie-more-button" @click="openAgreement">
            Подробнее
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.cookie {
  position: fixed;
  bottom: 24px;
  left: 24px;
  width: 380px;
  z-index: 90;
}

.cookie-card {
  background: var(--color-surface);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cookie-title {
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.2;
  color: var(--color-text);
}

.cookie-text {
  font-size: 14px;
  line-height: 1.55;
  color: var(--color-text-secondary);
}

.cookie-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.cookie-pop-enter-active,
.cookie-pop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.cookie-pop-enter-from,
.cookie-pop-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

@media (max-width: 768px) {
  .cookie {
    bottom: 0;
    right: 0;
    width: 100%;
  }

  .cookie-card {
    border-radius: 20px 20px 0 0;
    padding: 20px;
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.12);
  }

  .cookie-title {
    font-size: 19px;
  }

  .cookie-text {
    font-size: 13px;
  }

  .cookie-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }
}
</style>
