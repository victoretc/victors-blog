<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton/BaseButton.vue'

const router = useRouter()
</script>

<template>
  <div class="not-found" data-testid="not-found-page">
    <h1 class="not-found-title">Страница не найдена</h1>
    <p class="not-found-text">Похоже, такой страницы не существует или она была перемещена.</p>
    <img src="@/assets/images/not-found.png" alt="Страница не найдена" class="not-found-img" />
    <BaseButton variant="primary" data-testid="not-found-home-button" @click="router.push('/')">
      На главную
    </BaseButton>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.not-found-title {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 500;
  line-height: 1.1;
  color: var(--color-text);
  margin-bottom: 4px;
}

.not-found-text {
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text-secondary);
  max-width: 420px;
  margin-bottom: 32px;
}

.not-found-img {
  max-width: 100%;
  width: 320px;
  height: auto;
  margin-bottom: 32px;
}

@media (max-width: 768px) {
  .not-found-img {
    width: 220px;
  }

  .not-found-title {
    font-size: 22px;
  }

  .not-found-text {
    font-size: 14px;
  }
}
</style>
