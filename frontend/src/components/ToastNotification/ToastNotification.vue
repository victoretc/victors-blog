<script setup lang="ts">
import { useToast, hideToast } from '@/stores/toast'

const toast = useToast()
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="toast.visible"
        class="toast"
        :class="`toast--${toast.type}`"
        role="status"
        @click="hideToast"
      >
        <div class="toast-icon-wrap">
          <svg v-if="toast.type === 'error'" class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="9" y1="9" x2="15" y2="15" />
            <line x1="15" y1="9" x2="9" y2="15" />
          </svg>
          <svg v-else class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="8 12 11 15 16 9" />
          </svg>
        </div>
        <span class="toast-text">{{ toast.message }}</span>
        <button class="toast-close" aria-label="Закрыть уведомление" @click.stop="hideToast">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 14px;
  max-width: 420px;
  width: max-content;
  padding: 18px 20px;
  border-radius: var(--radius-xl);
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: var(--shadow-lg);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  pointer-events: auto;
}

.toast--error .toast-icon-wrap {
  background: var(--color-error-soft);
  color: var(--color-error);
}

.toast--success .toast-icon-wrap {
  background: rgba(66, 207, 113, 0.1);
  color: var(--color-success);
}

.toast-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.toast-icon {
  display: block;
}

.toast-text {
  flex: 1;
  min-width: 0;
  color: var(--color-text);
}

.toast-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin: -4px -6px -4px 0;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color var(--duration-fast) ease, background var(--duration-fast) ease;
}

.toast-close:hover {
  color: var(--color-text);
  background: var(--color-brand-soft);
}

.toast-enter-active {
  transition: opacity 0.25s var(--ease-out), transform 0.25s var(--ease-out);
}

.toast-leave-active {
  transition: opacity 0.2s ease-in, transform 0.2s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px) scale(0.95);
}

.toast-enter-to,
.toast-leave-from {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

@media (max-width: 480px) {
  .toast {
    left: 16px;
    right: 16px;
    width: auto;
    max-width: none;
    transform: none;
  }

  .toast-enter-from,
  .toast-leave-to {
    transform: none;
    opacity: 0;
    scale: 0.95;
  }

  .toast-enter-to,
  .toast-leave-from {
    transform: none;
    opacity: 1;
    scale: 1;
  }
}
</style>
