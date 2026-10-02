import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useClubsStore } from '@/stores/clubs'
import { useClubsView } from '@/composables/useClubsView'
import ClubFilters from './ClubFilters.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

function createWrapper() {
  return mount(ClubFilters, {
    global: {
      stubs: {
        BaseButton: {
          template: '<button :class="variant" @click="$emit(\'click\')"><slot/></button>',
          props: ['variant', 'loading'],
        },
      },
    },
  })
}

describe('ClubFilters', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    push.mockClear()
    useClubsView().viewMode.value = 'list'
  })

  it('renders search input', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('input[placeholder="Найти книжный клуб"]').exists()).toBe(true)
  })

  it('updates search query on input', async () => {
    const wrapper = createWrapper()
    const input = wrapper.find('input')
    await input.setValue('test')
    expect((input.element as HTMLInputElement).value).toBe('test')
  })

  it('calls searchClubs when search button is clicked', async () => {
    const clubsStore = useClubsStore()
    vi.spyOn(clubsStore, 'searchClubs').mockResolvedValue(undefined)

    const wrapper = createWrapper()
    const input = wrapper.find('input')
    await input.setValue('fantasy')
    await wrapper.find('.search-btn').trigger('click')

    expect(clubsStore.searchClubs).toHaveBeenCalledWith('fantasy')
  })

  it('shows search icon instead of text label', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.search-btn-text').exists()).toBe(false)
    expect(wrapper.find('.search-icon').exists()).toBe(true)
  })

  it('renders club type tabs', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="club-type-tabs"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('По книге')
    expect(wrapper.text()).toContain('Авторские')
  })

  it('calls filterByType when author tab is clicked', async () => {
    const clubsStore = useClubsStore()
    const filterByTypeSpy = vi.spyOn(clubsStore, 'filterByType').mockResolvedValue(undefined)

    const wrapper = createWrapper()
    const authorTab = wrapper.find('[data-testid="club-type-tab"][data-type="author"]')
    await authorTab.trigger('click')

    expect(filterByTypeSpy).toHaveBeenCalledWith('author')
  })

  it('calls fetchClubs when active type tab is clicked again', async () => {
    const clubsStore = useClubsStore()
    const filterByTypeSpy = vi.spyOn(clubsStore, 'filterByType').mockResolvedValue(undefined)
    const fetchSpy = vi.spyOn(clubsStore, 'fetchClubs').mockResolvedValue(undefined)

    const wrapper = createWrapper()
    const authorTab = wrapper.find('[data-testid="club-type-tab"][data-type="author"]')
    await authorTab.trigger('click')
    await authorTab.trigger('click')

    expect(filterByTypeSpy).toHaveBeenCalledWith('author')
    expect(fetchSpy).toHaveBeenCalled()
  })

  it('does not render an all type tab', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="club-type-tab"][data-type="all"]').exists()).toBe(false)
  })

  it('switches cards view to grid when grid toggle is clicked', async () => {
    const wrapper = createWrapper()
    const { viewMode } = useClubsView()
    await wrapper.find('[data-testid="view-toggle-grid"]').trigger('click')

    expect(viewMode.value).toBe('grid')
    expect(wrapper.find('[data-testid="view-toggle-grid"]').classes()).toContain('active')
  })

  it('switches cards view to list when list toggle is clicked', async () => {
    const wrapper = createWrapper()
    const { viewMode } = useClubsView()
    viewMode.value = 'grid'
    await wrapper.find('[data-testid="view-toggle-list"]').trigger('click')

    expect(viewMode.value).toBe('list')
    expect(wrapper.find('[data-testid="view-toggle-list"]').classes()).toContain('active')
  })
})
