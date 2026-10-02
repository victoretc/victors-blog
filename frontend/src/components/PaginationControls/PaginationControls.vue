<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    currentPage: number
    totalPages: number
    pageSize: number
  }>(),
  {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  },
)

const emit = defineEmits<{
  pageChange: [page: number]
  pageSizeChange: [size: number]
}>()

const pageSizes = [5, 10, 15, 20, 25]
const isSelectOpen = ref(false)
const selectedSize = ref(props.pageSize)

watch(
  () => props.pageSize,
  (value) => {
    selectedSize.value = value
  },
)

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('pageChange', page)
  }
}

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('pageChange', props.currentPage + 1)
  }
}

const prevPage = () => {
  if (props.currentPage > 1) {
    emit('pageChange', props.currentPage - 1)
  }
}

const toggleSelect = () => {
  isSelectOpen.value = !isSelectOpen.value
}

const selectOption = (size: number) => {
  if (size !== selectedSize.value) {
    selectedSize.value = size
    emit('pageSizeChange', size)
  }
  isSelectOpen.value = false
}
</script>

<template>
  <div class="pagination">
    <div class="pagination-pages">
      <button @click="prevPage" :disabled="currentPage === 1" class="page-btn">
        &#8592;
      </button>

      <template v-for="page in totalPages" :key="page">
        <button
          v-if="Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages"
          @click="goToPage(page)"
          :class="{ active: page === currentPage }"
          class="page-btn"
          :disabled="page === currentPage"
        >
          {{ page }}
        </button>
        <span
          v-else-if="
            (page === 2 && currentPage - 2 > 2) ||
            (page === totalPages - 1 && currentPage + 2 < totalPages - 1)
          "
          class="ellipsis"
        >
          ...
        </span>
      </template>

      <button @click="nextPage" :disabled="currentPage === totalPages" class="page-btn">
        &#8594;
      </button>
    </div>

    <div class="page-size">
      <label>Показывать по:</label>
      <div class="select-dropdown" :class="{ open: isSelectOpen }">
        <div class="select-header" @click="toggleSelect">
          {{ selectedSize }}
        </div>
        <div class="select-options">
          <div
            v-for="size in pageSizes"
            :key="size"
            class="select-option"
            :class="{ selected: size === selectedSize }"
            @click="selectOption(size)"
          >
            {{ size }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px 24px;
  background: var(--color-surface);
  border-radius: 32px;
  width: 704px;
  max-width: 100%;
}

.pagination-pages {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, background 0.2s ease;
}

.page-btn:hover:not(:disabled):not(.active) {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}

.page-btn.active {
  background: var(--color-brand-soft);
  color: var(--color-brand);
  font-weight: 600;
  cursor: default;
}

.page-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.ellipsis {
  padding: 0 4px;
  color: var(--color-text-secondary);
}

.page-size {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size label {
  font-size: 14px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.select-dropdown {
  position: relative;
  width: 64px;
}

.select-header {
  height: 32px;
  padding: 0 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--color-text);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: color 0.2s ease, background 0.2s ease;
}

.select-header:hover {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}

.select-header:after {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  transition: transform var(--duration-fast) var(--ease-out);
}

.select-dropdown.open .select-header:after {
  transform: rotate(180deg);
}

.select-options {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-stroke-subtle);
  border-radius: 12px;
  margin-bottom: 4px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  z-index: 10;
  max-height: 0;
  opacity: 0;
  visibility: hidden;
  transition: all var(--duration-normal) var(--ease-out);
}

.select-dropdown.open .select-options {
  max-height: 200px;
  opacity: 1;
  visibility: visible;
}

.select-option {
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  transition: background var(--duration-fast) var(--ease-out);
}

.select-option:hover {
  background: var(--color-brand-soft);
  color: var(--color-brand);
}

.select-option.selected {
  background: var(--color-brand-soft);
  font-weight: 600;
  color: var(--color-brand);
  cursor: default;
}

@media (max-width: 768px) {
  .pagination {
    width: 100%;
    padding: 12px 16px;
    gap: 12px;
  }
}

@media (max-width: 600px) {
  .pagination {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .pagination-pages {
    justify-content: center;
  }

  .page-size {
    width: 100%;
    justify-content: center;
  }
}
</style>
