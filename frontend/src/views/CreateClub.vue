<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import ClubForm from '@/components/ClubForm/ClubForm.vue'
import ClubTypePicker from '@/components/ClubForm/ClubTypePicker.vue'
import BreadcrumbsNav from '@/components/Breadcrumbs/BreadcrumbsNav.vue'
import { useClubsStore } from '@/stores/clubs'
import { ClubTypeEnum } from '@/api/Api'
import heroImg from '@/assets/images/blue.jpg'

const clubsStore = useClubsStore()
const clubType = ref<ClubTypeEnum | null>(null)
const showInstruction = ref(true)

const breadcrumbs = computed(() => {
  if (clubType.value === 'book') {
    return [
      { label: 'Клубы', to: '/clubs' },
      { label: 'Создать клуб', action: () => { clubType.value = null } },
      { label: 'Создать клуб по книге' },
    ]
  }
  if (clubType.value === 'author') {
    return [
      { label: 'Клубы', to: '/clubs' },
      { label: 'Создать клуб', action: () => { clubType.value = null } },
      { label: 'Создать авторский клуб' },
    ]
  }
  return [
    { label: 'Клубы', to: '/clubs' },
    { label: 'Создать клуб' },
  ]
})

function selectType(type: ClubTypeEnum) {
  clubType.value = type
}

onMounted(() => {
  clubsStore.ownedClubsCount().catch(() => {})
})
</script>

<template>
  <div class="create-page" data-testid="create-club-page">
    <BreadcrumbsNav :trail="breadcrumbs" />

    <div class="create-split">
      <div class="create-left" :class="{ 'create-left--full': clubType }">
        <ClubTypePicker v-if="!clubType" @select="selectType" />
        <ClubForm v-else :club-type="clubType" />
      </div>

      <!--
      <div v-if="!clubType" class="create-right">
        <Transition name="instruction-fade">
          <div v-if="showInstruction" class="create-instruction-block">
            <div class="create-right-img" :style="{ backgroundImage: `url(${heroImg})` }">
              <div class="create-right-img-overlay" />
              <h2 class="create-instruction-title">Как создать клуб?</h2>
            </div>
            <div class="create-instruction-body">
              <p class="create-instruction-text">
                На странице клубов — все доступные клубы. Хочешь найти участников для книги,
                которой ещё нет в Читальной? Отправь запрос на создание клуба.
              </p>
              <p class="create-instruction-text">
                Заполни форму: <strong>Название книги</strong>, <strong>Автор(ы) книги</strong>,
                <strong>Год выпуска</strong> и <strong>Описание книги</strong>. Выбери <strong>Категорию</strong>,
                при необходимости — <strong>Подкатегорию</strong>. Нажми «Создать клуб».
              </p>
              <p class="create-instruction-text">
                Администратор увидит заявку и создаст чаты в Max и Telegram. Когда всё будет готово,
                клуб появится на главной странице, а тебе на почту придёт письмо.
              </p>
            </div>
          </div>
        </Transition>
      </div>
      -->
    </div>
  </div>
</template>

<style scoped>
.create-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.create-split {
  display: flex;
  width: 100%;
  gap: 32px;
  align-items: flex-start;
}

.create-left {
  flex: 1;
  min-width: 0;
}

.create-left--full {
  flex: none;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}

.create-right {
  flex: 0 0 auto;
  width: 420px;
}

.create-instruction-block {
  width: 100%;
}

.create-right-img {
  width: 100%;
  height: 220px;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  overflow: hidden;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-right-img-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
}

.create-instruction-title {
  position: relative;
  z-index: 1;
  margin: 0;
  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 500;
  line-height: 1.15;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
}

.create-instruction-body {
  background: var(--color-surface);
  border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  padding: 24px 28px 28px;
}

.create-instruction-text {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0 0 12px;
}

.create-instruction-text:last-child {
  margin-bottom: 0;
}

.create-instruction-text strong {
  color: var(--color-text);
  font-weight: 600;
}

.instruction-fade-enter-active {
  transition: opacity var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out);
}

.instruction-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.instruction-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.instruction-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

:deep(.form-card) {
  background: transparent;
  border-radius: 0;
  padding: 0;
  box-shadow: none;
  border: none;
}

:deep(.form-title) {
  text-align: left;
  font-size: 24px;
  margin-bottom: 12px;
}

:deep(.type-picker) {
  background: transparent;
  border: none;
  box-shadow: none;
}

:deep(.type-picker__content) {
  align-items: flex-start;
  text-align: left;
  padding: 0 0 32px;
}

:deep(.type-picker__title) {
  font-size: 26px;
}

@media (max-width: 768px) {
  .create-split {
    flex-direction: column;
  }

  .create-left {
    width: 100%;
  }

  .create-right {
    width: 100%;
  }

  .create-right-img {
    height: 180px;
  }

  .create-instruction-body {
    padding: 20px 24px 24px;
  }

  .create-instruction-title {
    font-size: 24px;
  }

  .create-instruction-text {
    font-size: 14px;
  }
}
</style>
