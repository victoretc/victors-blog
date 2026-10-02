<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import BaseButton from '@/components/BaseButton/BaseButton.vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const dialogRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)
let previouslyFocused: HTMLElement | null = null

function close() {
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  if (props.open) {
    previouslyFocused = document.activeElement as HTMLElement | null
    closeButtonRef.value?.focus()
  }
})

onBeforeUnmount(() => {
  previouslyFocused?.focus?.()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-overlay"
        role="presentation"
        @click.self="close"
        @keydown.esc="onKeydown"
      >
        <div
          ref="dialogRef"
          class="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="club-form-instruction-title"
          data-testid="club-form-instruction"
        >
          <button
            ref="closeButtonRef"
            type="button"
            class="modal-close"
            aria-label="Закрыть"
            data-testid="club-form-instruction-close-button"
            @click="close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1 L13 13 M13 1 L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>

          <h2 id="club-form-instruction-title" class="modal-title">Как создать клуб</h2>

          <p class="modal-text">
            На странице клубов — все доступные клубы. Хочешь найти участников для книги,
            которой ещё нет в Читальной? Отправь запрос на создание клуба.
          </p>

          <p class="modal-text">
            Заполни форму: <strong>Название книги</strong>, <strong>Автор(ы) книги</strong>,
            <strong>Год выпуска</strong> и <strong>Описание книги</strong>. Выбери <strong>Категорию</strong>,
            при необходимости — <strong>Подкатегорию</strong>. Нажми «Создать клуб».
          </p>

          <p class="modal-text">
            Администратор увидит заявку и создаст чаты в Max и Telegram. Когда всё будет готово,
            клуб появится на главной странице, а тебе на почту придёт письмо.
          </p>

          <BaseButton
            class="modal-action"
            variant="primary"
            full-width
            testId="club-form-instruction-continue-button"
            @click="close"
          >
            Понятно, перейти к созданию
          </BaseButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(26, 28, 43, 0.45);
  backdrop-filter: blur(4px);
}

.modal {
  position: relative;
  width: 100%;
  max-width: 520px;
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  background: var(--color-surface);
  border-radius: 32px;
  padding: 32px 36px 36px;
  box-shadow: var(--shadow-lg);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: var(--color-bg);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out);
}

.modal-close:hover {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}

.modal-title {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 500;
  line-height: 1.1;
  color: var(--color-text);
  margin-bottom: 20px;
}

.modal-text {
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0 0 14px;
}

.modal-text:last-of-type {
  margin-bottom: 24px;
}

.modal-text strong {
  color: var(--color-text);
  font-weight: 600;
}

.modal-action {
  margin-top: 4px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--duration-normal) var(--ease-out);
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform var(--duration-normal) var(--ease-out);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal {
  transform: translateY(16px) scale(0.98);
}

.modal-leave-to .modal {
  transform: translateY(8px) scale(0.98);
}

@media (max-width: 600px) {
  .modal {
    padding: 24px 24px 28px;
    border-radius: 24px;
  }

  .modal-title {
    font-size: 24px;
  }

  .modal-text {
    font-size: 16px;
  }
}
</style>
