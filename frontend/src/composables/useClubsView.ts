import { ref, watch } from 'vue'

export type ClubsViewMode = 'grid' | 'list'

const STORAGE_KEY = 'clubs-view-mode'

function readInitialMode(): ClubsViewMode {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'list' ? 'list' : 'grid'
  } catch {
    return 'grid'
  }
}

const viewMode = ref<ClubsViewMode>(readInitialMode())

watch(viewMode, (mode) => {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // ignore storage errors
  }
})

export function useClubsView() {
  return { viewMode }
}
