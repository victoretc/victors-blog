<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'outline' | 'brand-outline' | 'danger' | 'ghost'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  testId?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  loading: false,
  disabled: false,
  fullWidth: false,
  type: 'button',
  testId: undefined,
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const classes = computed(() => [
  'base-btn',
  `base-btn--${props.variant}`,
  props.fullWidth ? 'base-btn--full' : '',
  props.loading ? 'btn-loading' : '',
])
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
    :type="type"
    :data-testid="testId"
    @click="(e: MouseEvent) => emit('click', e)"
  >
    <span v-if="!loading" class="base-btn__text">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  border-radius: 40px;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  border: 1px solid transparent;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
}

.base-btn:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
}

.base-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.base-btn--full {
  width: 100%;
}

.base-btn--primary {
  background: var(--color-brand);
  color: #FFFFFF;
  border-color: rgba(59, 62, 255, 0.4);
  box-shadow: 0 2px 8px rgba(59, 62, 255, 0.25);
}

.base-btn--primary:hover:not(:disabled) {
  filter: brightness(1.08);
  box-shadow: 0 4px 16px rgba(59, 62, 255, 0.25);
}

.base-btn--primary:active:not(:disabled) {
  filter: brightness(0.92);
}

.base-btn--outline {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-stroke-subtle);
}

.base-btn--outline:hover:not(:disabled) {
  background: var(--color-brand-soft);
  border-color: var(--color-brand);
  color: var(--color-brand);
}

.base-btn--outline:active:not(:disabled) {
  filter: brightness(0.92);
}

.base-btn--brand-outline {
  background: transparent;
  color: var(--color-brand);
  border-color: var(--color-brand);
}

.base-btn--brand-outline:hover:not(:disabled) {
  background: var(--color-brand-soft);
}

.base-btn--brand-outline:active:not(:disabled) {
  filter: brightness(0.92);
}

.base-btn--danger {
  background: transparent;
  color: var(--color-error);
  border-color: var(--color-error);
}

.base-btn--danger:hover:not(:disabled) {
  background: var(--color-error-soft);
}

.base-btn--danger:active:not(:disabled) {
  filter: brightness(0.92);
}

.base-btn--ghost {
  background: none;
  color: var(--color-brand);
  border: none;
  padding: 8px;
  height: auto;
}

.base-btn--ghost:hover:not(:disabled) {
  opacity: 0.65;
}

.base-btn--ghost:active:not(:disabled) {
  opacity: 0.5;
}
</style>
