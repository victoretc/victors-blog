<script setup lang="ts">
import type { ClubTypeEnum } from '@/api/Api'

defineOptions({ name: 'ClubTypePicker' })

const emit = defineEmits<{
  select: [type: ClubTypeEnum]
}>()

const choose = (type: ClubTypeEnum) => {
  emit('select', type)
}
</script>

<template>
  <div class="type-picker" data-testid="club-type-picker" role="group" aria-label="Тип клуба">
    <div class="type-picker__content">
      <h2 class="type-picker__title">Какой клуб хочешь создать?</h2>

      <p class="type-picker__description">
        <strong>Клуб по книге</strong> — обсуждение одной книги: впечатления, цитаты, параллели.
        <strong>Авторский клуб</strong> — изучение творчества автора: темы, мотивы, стиль.
      </p>

      <div class="type-picker__options">
        <button
          type="button"
          class="type-option"
          data-testid="club-type-pill-book"
          @click="choose('book' as ClubTypeEnum)"
        >
          <span class="type-option__title">Клуб по книге</span>
        </button>

        <button
          type="button"
          class="type-option"
          data-testid="club-type-pill-author"
          @click="choose('author' as ClubTypeEnum)"
        >
          <span class="type-option__title">Авторский клуб</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.type-picker {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-stroke-subtle);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-sm);
}

.type-picker__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 32px 32px;
}

.type-picker__title {
  margin: 0 0 8px;
  font-family: var(--font-heading);
  font-size: 34px;
  font-weight: 500;
  line-height: 1.1;
  color: var(--color-text);
}

.type-picker__options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 640px;
  margin-top: 16px;
}

.type-option {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  border: 1px solid var(--color-stroke-subtle);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  font-family: var(--font-body);
  cursor: pointer;
  text-align: center;
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out);
}

.type-option:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-stroke-subtle);
}

.type-option:active {
  transform: translateY(0);
}

.type-option:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
}

.type-option__title {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  color: var(--color-text);
}

.type-picker__description {
  margin: 0 0 20px;
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  text-align: left;
  max-width: 600px;
}

.type-picker__description strong {
  color: var(--color-text);
  font-weight: 500;
}

@media (max-width: 640px) {
  .type-picker__content {
    padding: 28px 16px 24px;
  }

  .type-picker__title {
    font-size: 26px;
  }

  .type-picker__options {
    grid-template-columns: 1fr;
    gap: 10px;
    max-width: 340px;
    margin-top: 20px;
  }

  .type-option {
    padding: 14px 16px;
  }
}
</style>
