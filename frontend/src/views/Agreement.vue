<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton/BaseButton.vue'

defineOptions({ name: 'AgreementPage' })

const router = useRouter()
</script>

<template>
  <div class="agreement-page" data-testid="agreement-page">
    <h1 class="agreement-title">Согласие на обработку персональных данных</h1>
    <p class="agreement-subtitle">
      Документ описывает, какие данные мы собираем и как их используем, в соответствии
      с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
    </p>

    <div class="agreement-doc">
      <div class="doc-placeholder">
        <div class="doc-icon" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="8" y1="13" x2="16" y2="13" />
            <line x1="8" y1="17" x2="16" y2="17" />
          </svg>
        </div>
        <p class="doc-placeholder-text">Текст договора появится здесь позже</p>
        <p class="doc-placeholder-hint">PDF-файл с договором будет добавлен на эту страницу</p>
      </div>
    </div>

    <div class="agreement-actions">
      <BaseButton variant="primary" data-testid="agreement-back-button" @click="router.push('/clubs')">
        На главную
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.agreement-page {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.agreement-title {
  font-family: var(--font-heading);
  font-size: 30px;
  font-weight: 500;
  line-height: 1.15;
  color: var(--color-text);
}

.agreement-subtitle {
  font-size: 16px;
  line-height: 1.55;
  color: var(--color-text-secondary);
}

.agreement-doc {
  background: var(--color-surface);
  border-radius: 24px;
  padding: 48px 32px;
}

.doc-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  border: 1.5px dashed var(--color-stroke-subtle);
  border-radius: 16px;
  padding: 48px 24px;
}

.doc-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 24px;
  background: var(--color-brand-soft);
  color: var(--color-brand);
}

.doc-placeholder-text {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--color-text);
}

.doc-placeholder-hint {
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.agreement-actions {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

@media (max-width: 480px) {
  .agreement-title {
    font-size: 24px;
  }

  .agreement-subtitle {
    font-size: 14px;
  }

  .agreement-doc {
    padding: 24px 16px;
    border-radius: 20px;
  }

  .doc-placeholder {
    padding: 32px 16px;
  }
}
</style>
