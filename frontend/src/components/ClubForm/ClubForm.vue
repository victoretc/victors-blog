<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { useClubsStore } from '@/stores/clubs'
import { useCategoriesStore } from '@/stores/categories'
import { showToast } from '@/stores/toast'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import { ClubTypeEnum } from '@/api/Api'
import type { Club } from '@/api/Api'
import type { BookClubRequestRequest } from '@/api/Api'

interface Props {
  clubId?: number | null
  clubType?: ClubTypeEnum | null
}
const props = withDefaults(defineProps<Props>(), {
  clubId: null,
  clubType: null,
})

const emit = defineEmits<{
  submit: []
}>()

const router = useRouter()
const clubsStore = useClubsStore()
const categoriesStore = useCategoriesStore()
const isLoading = ref(false)
const errorMsg = ref('')

const photoFile = ref<File | null>(null)
const existingPhoto = ref<string | null>(null)

const parentCategoryId = ref<number | ''>('')
const subcategoryId = ref<number | ''>('')
const categoryError = ref('')
const isCategoryOpen = ref(false)
const isSubcategoryOpen = ref(false)
const categoryRef = ref<HTMLDivElement | null>(null)
const subcategoryRef = ref<HTMLDivElement | null>(null)

const subcategories = computed(() => {
  if (parentCategoryId.value === '') return []
  return categoriesStore.childrenOf(parentCategoryId.value)
})

const selectedCategoryName = computed(() => {
  if (parentCategoryId.value === '') return ''
  return categoriesStore.nameById(parentCategoryId.value)
})

const selectedSubcategoryName = computed(() => {
  if (subcategoryId.value === '') return ''
  return categoriesStore.nameById(subcategoryId.value)
})

const isAuthorType = computed(() => props.clubType === ClubTypeEnum.Author)

const photoPreview = computed(() => {
  if (photoFile.value) return URL.createObjectURL(photoFile.value)
  return existingPhoto.value
})

const validationSchema = yup.object({
  bookTitle: yup.string().required('Название книги обязательно'),
  bookAuthors: yup.string().required('Автор(ы) книги обязательно'),
  publicationYear: yup.number().typeError('Введите число').required('Год выпуска обязательно'),
  description: yup.string().required('Описание книги обязательно'),
  authorName: yup.string().when('clubType', {
    is: ClubTypeEnum.Author,
    then: (schema) => schema.required('Имя автора/ведущего обязательно'),
    otherwise: (schema) => schema.notRequired(),
  }),
  authorBio: yup.string().when('clubType', {
    is: ClubTypeEnum.Author,
    then: (schema) => schema.required('Описание автора/ведущего обязательно'),
    otherwise: (schema) => schema.notRequired(),
  }),
})

const { handleSubmit, setValues, setFieldValue } = useForm({
  validationSchema,
  initialValues: {
    clubType: '',
  },
})

function resolveCategory(): number | '' {
  const value = subcategoryId.value !== '' ? subcategoryId.value : parentCategoryId.value
  categoryError.value = value === '' ? 'Выберите категорию' : ''
  return value
}

function onParentCategoryChange() {
  subcategoryId.value = ''
  categoryError.value = ''
}

function onSubcategoryChange() {
  categoryError.value = ''
}

function selectParentCategory(id: number) {
  parentCategoryId.value = id
  isCategoryOpen.value = false
  onParentCategoryChange()
}

function selectSubcategory(id: number) {
  subcategoryId.value = id
  isSubcategoryOpen.value = false
  onSubcategoryChange()
}

function toggleCategory() {
  isCategoryOpen.value = !isCategoryOpen.value
}

function toggleSubcategory() {
  isSubcategoryOpen.value = !isSubcategoryOpen.value
}

function handleOutsideClick(e: MouseEvent) {
  if (categoryRef.value && !categoryRef.value.contains(e.target as Node)) {
    isCategoryOpen.value = false
  }
  if (subcategoryRef.value && !subcategoryRef.value.contains(e.target as Node)) {
    isSubcategoryOpen.value = false
  }
}

async function loadClub() {
  if (!props.clubId) return
  isLoading.value = true
  try {
    const club = await clubsStore.fetchClub(props.clubId)
    const category = categoriesStore.categoryById(club.category)
    parentCategoryId.value = category?.parent ?? club.category ?? ''
    subcategoryId.value = category?.parent != null ? club.category ?? '' : ''
    existingPhoto.value = club.authorPhoto ?? null
    setFieldValue('clubType', club.clubType ?? ClubTypeEnum.Book)
    setValues({
      clubType: club.clubType ?? ClubTypeEnum.Book,
      bookTitle: club.bookTitle,
      bookAuthors: club.bookAuthors,
      publicationYear: club.publicationYear,
      description: club.description,
      authorName: club.authorName ?? '',
      authorBio: club.authorBio ?? '',
    })
  } catch {
    router.push({ name: 'clubs' })
  } finally {
    isLoading.value = false
  }
}

function onPhotoChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  photoFile.value = file ?? null
  if (file) existingPhoto.value = null
}

onMounted(() => {
  loadClub()
  categoriesStore.fetchCategories()
  document.addEventListener('click', handleOutsideClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutsideClick)
})

const onSubmit = handleSubmit(async (values) => {
  const category = resolveCategory()
  if (category === '') return
  isLoading.value = true
  errorMsg.value = ''
  const type = props.clubType ?? ClubTypeEnum.Book
  const payload = {
    ...(values as Partial<Club>),
    clubType: type,
    category,
  }
  try {
    if (props.clubId) {
      await clubsStore.updateClub(props.clubId, payload, photoFile.value)
      showToast('Клуб успешно обновлен', 'success')
    } else {
      await clubsStore.createClubRequest({ ...(payload as BookClubRequestRequest) }, photoFile.value)
      showToast('Заявка отправлена. Администратор рассмотрит её в ближайшее время.', 'success')
    }
    emit('submit')
    router.push({ name: 'clubs' })
  } catch {
    errorMsg.value = 'Ошибка при сохранении. Проверьте введенные данные.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <form @submit="onSubmit" class="form-card" data-testid="club-form">
    <h1 class="form-title" data-testid="club-form-title">{{ clubId ? 'Редактирование клуба' : (isAuthorType ? 'Создать авторский клуб' : 'Создать клуб по книге') }}</h1>

    <div class="field">
      <label for="bookTitle">Название книги *</label>
      <Field
        id="bookTitle"
        name="bookTitle"
        type="text"
        placeholder="Компьютерные сети"
        :disabled="isLoading"
        class="input"
        data-testid="club-form-book-title-input"
      />
      <ErrorMessage name="bookTitle" class="field-error" />
    </div>

    <div class="field">
      <label for="bookAuthors">Автор(ы) книги *</label>
      <Field
        id="bookAuthors"
        name="bookAuthors"
        type="text"
        placeholder="Дэвид Уэзеролл и Эндрю Таненбаум"
        :disabled="isLoading"
        class="input"
        data-testid="club-form-book-authors-input"
      />
      <ErrorMessage name="bookAuthors" class="field-error" />
    </div>

    <div class="field">
      <label for="publicationYear">Год выпуска *</label>
      <Field
        id="publicationYear"
        type="number"
        name="publicationYear"
        placeholder="2012"
        :disabled="isLoading"
        class="input"
        data-testid="club-form-publication-year-input"
      />
      <ErrorMessage name="publicationYear" class="field-error" />
    </div>

    <div class="field">
      <label for="description">Описание книги *</label>
      <Field
        id="description"
        name="description"
        as="textarea"
        rows="5"
        placeholder="Описание книги"
        :disabled="isLoading"
        class="textarea"
        data-testid="club-form-description-input"
      />
      <ErrorMessage name="description" class="field-error" />
    </div>

    <template v-if="isAuthorType">
      <div class="author-section">
        <span class="author-section-title">Об авторе / ведущем</span>

        <div class="field">
          <label for="authorName">Имя автора / ведущего *</label>
          <Field
            id="authorName"
            name="authorName"
            type="text"
            placeholder="Святослав Куликов"
            :disabled="isLoading"
            class="input"
            data-testid="club-form-author-name-input"
          />
          <ErrorMessage name="authorName" class="field-error" />
        </div>

        <div class="field">
          <label for="authorBio">Биография и о чём клуб *</label>
          <Field
            id="authorBio"
            name="authorBio"
            as="textarea"
            rows="4"
            placeholder="Кто этот человек, почему с ним интересно читать"
            :disabled="isLoading"
            class="textarea"
            data-testid="club-form-author-bio-input"
          />
          <ErrorMessage name="authorBio" class="field-error" />
        </div>

        <div class="field">
          <label for="authorPhoto">Фото</label>
          <input
            id="authorPhoto"
            type="file"
            accept="image/*"
            :disabled="isLoading"
            class="photo-input"
            data-testid="club-form-author-photo-input"
            @change="onPhotoChange"
          />
          <div v-if="photoPreview" class="photo-preview">
            <img :src="photoPreview" alt="Фото автора" class="photo-preview-img" />
          </div>
        </div>
      </div>
    </template>

    <div ref="categoryRef" class="field">
      <label id="category-label" for="category">Категория *</label>
      <div
        class="custom-select"
        :class="{ open: isCategoryOpen }"
        data-testid="club-form-category-select"
      >
        <button
          id="category"
          type="button"
          class="custom-select__trigger"
          :class="{ placeholder: !selectedCategoryName }"
          :disabled="isLoading"
          aria-haspopup="listbox"
          :aria-expanded="isCategoryOpen"
          @click="toggleCategory"
        >
          <span>{{ selectedCategoryName || 'Выберите категорию' }}</span>
          <svg
            class="custom-select__chevron"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <ul class="custom-select__options" role="listbox" aria-labelledby="category-label">
          <li v-for="c in categoriesStore.topLevelCategories" :key="c.id">
            <button
              type="button"
              role="option"
              class="custom-select__option"
              :class="{ selected: parentCategoryId === c.id }"
              :aria-selected="parentCategoryId === c.id"
              :disabled="isLoading"
              @click="selectParentCategory(c.id)"
            >
              {{ c.name }}
            </button>
          </li>
        </ul>
      </div>
      <span v-if="categoryError" class="field-error" data-testid="club-form-category-error">{{ categoryError }}</span>
    </div>

    <div v-if="subcategories.length" ref="subcategoryRef" class="field">
      <label id="subcategory-label" for="subcategory">Подкатегория</label>
      <div
        class="custom-select"
        :class="{ open: isSubcategoryOpen }"
        data-testid="club-form-subcategory-select"
      >
        <button
          id="subcategory"
          type="button"
          class="custom-select__trigger"
          :class="{ placeholder: !selectedSubcategoryName }"
          :disabled="isLoading"
          aria-haspopup="listbox"
          :aria-expanded="isSubcategoryOpen"
          @click="toggleSubcategory"
        >
          <span>{{ selectedSubcategoryName || 'Не выбрана' }}</span>
          <svg
            class="custom-select__chevron"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <ul class="custom-select__options" role="listbox" aria-labelledby="subcategory-label">
          <li v-for="s in subcategories" :key="s.id">
            <button
              type="button"
              role="option"
              class="custom-select__option"
              :class="{ selected: subcategoryId === s.id }"
              :aria-selected="subcategoryId === s.id"
              :disabled="isLoading"
              @click="selectSubcategory(s.id)"
            >
              {{ s.name }}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="errorMsg" class="error-msg" data-testid="club-form-error">{{ errorMsg }}</div>

    <div class="form-actions">
      <BaseButton type="submit" variant="primary" full-width :loading="isLoading" :disabled="isLoading" testId="club-form-submit-button">
        {{ clubId ? 'Сохранить изменения' : 'Отправить заявку' }}
      </BaseButton>
      <BaseButton variant="outline" full-width @click="router.push('/clubs')" :disabled="isLoading" testId="club-form-cancel-button">
        Отмена
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.form-card {
  width: 100%;
  background: var(--color-surface);
  border-radius: 32px;
  padding: 36px 32px 32px;
}

.form-title {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 500;
  line-height: 1.1;
  margin-bottom: 16px;
  text-align: center;
  color: var(--color-text);
}

.field {
  margin-bottom: 20px;
}

.type-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  margin-bottom: 20px;
  background: var(--color-brand-soft);
  border-radius: 12px;
}

.type-switch-label {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-brand);
}

.type-switch-btn {
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  text-decoration: underline;
}

.type-switch-btn:hover {
  color: var(--color-brand);
}

.author-section {
  border-top: 1px solid var(--color-stroke-subtle);
  padding-top: 20px;
  margin-bottom: 4px;
}

.author-section-title {
  display: block;
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--color-text);
}

.photo-input {
  width: 100%;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text-secondary);
}

.photo-input::file-selector-button {
  margin-right: 12px;
  padding: 8px 16px;
  border: none;
  border-radius: 30px;
  background: var(--color-brand-soft);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-brand);
  cursor: pointer;
}

.photo-preview {
  margin-top: 12px;
}

.photo-preview-img {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
}

.field label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--color-text-secondary);
}

.input,
.textarea {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-stroke-subtle);
  border-radius: 12px;
  padding: 12px 16px;
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text);
  transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}

.custom-select {
  position: relative;
}

.custom-select__trigger {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: var(--color-surface);
  border: 1px solid var(--color-stroke-subtle);
  border-radius: 12px;
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
}

.custom-select__trigger.placeholder {
  color: var(--color-text-secondary);
}

.custom-select__trigger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.custom-select__trigger:hover:not(:disabled) {
  border-color: var(--color-brand);
}

.custom-select__chevron {
  flex-shrink: 0;
  color: var(--color-text-secondary);
  transition: transform var(--duration-fast) var(--ease-out);
}

.custom-select.open .custom-select__chevron {
  transform: rotate(180deg);
}

.custom-select__options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 4px;
  list-style: none;
  background: var(--color-surface);
  border: 1px solid var(--color-stroke-subtle);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  z-index: 20;
  max-height: 0;
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}

.custom-select.open .custom-select__options {
  max-height: 240px;
  opacity: 1;
  visibility: visible;
  overflow-y: auto;
}

.custom-select__option {
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
}

.custom-select__option:hover:not(:disabled) {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}

.custom-select__option.selected {
  background: var(--color-brand-soft);
  color: var(--color-brand);
  font-weight: 600;
  cursor: default;
}

.custom-select__option:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input {
  height: 48px;
}

.textarea {
  min-height: 120px;
  resize: vertical;
}

.input::placeholder,
.textarea::placeholder {
  color: var(--color-text-secondary);
}

.input:focus,
.textarea:focus,
.custom-select__trigger:focus {
  outline: none;
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-ring);
}

.input:disabled,
.textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

[data-testid="club-form-publication-year-input"]::-webkit-inner-spin-button,
[data-testid="club-form-publication-year-input"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

[data-testid="club-form-publication-year-input"] {
  -moz-appearance: textfield;
  appearance: textfield;
}

.field-error {
  color: var(--color-error);
  font-size: 14px;
  margin-top: 4px;
  display: block;
}

.error-msg {
  color: var(--color-error);
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 600px) {
  .form-card {
    padding: 24px;
    border-radius: 24px;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
