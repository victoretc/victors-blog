import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { useClubsStore } from '@/stores/clubs'
import { useCategoriesStore } from '@/stores/categories'
import { api } from '@/api'
import ClubForm from './ClubForm.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

const { mockHandleSubmit } = vi.hoisted(() => ({
  mockHandleSubmit: vi.fn((cb: (values: Record<string, unknown>) => void) => {
    return (e?: Event) => {
      e?.preventDefault?.()
      cb({
        clubType: 'book',
        bookTitle: 'New Book',
        bookAuthors: 'New Author',
        publicationYear: 2024,
        description: 'New description',
        authorName: '',
        authorBio: '',
      })
    }
  }),
}))

vi.mock('vee-validate', () => ({
  useForm: () => ({
    handleSubmit: mockHandleSubmit,
    setValues: vi.fn(),
    setFieldValue: vi.fn(),
  }),
  Field: {
    name: 'Field',
    props: ['id', 'name', 'type', 'as', 'disabled', 'placeholder'],
    template: '<input :id="id" :name="name" />',
  },
  ErrorMessage: {
    name: 'ErrorMessage',
    props: ['name'],
    template: '<span />',
  },
}))

function createWrapper(props: { clubId?: number | null } = {}) {
  return mount(ClubForm, {
    props: { clubId: props.clubId ?? null },
    global: {
      stubs: {
        BaseButton: {
          template: '<button :class="variant"><slot/></button>',
          props: ['variant', 'loading'],
        },
        ClubTypePicker: {
          name: 'ClubTypePicker',
          emits: ['select'],
          template:
            '<div data-testid="club-type-picker-stub"><button data-testid="pick-book" @click="$emit(\'select\', \'book\')">book</button><button data-testid="pick-author" @click="$emit(\'select\', \'author\')">author</button></div>',
        },
      },
    },
  })
}

const mockClub = {
  bookTitle: 'Test Book',
  bookAuthors: 'Test Author',
  publicationYear: 2020,
  description: 'Test description',
}

const mockCategories = [
  { id: 1, name: 'IT', slug: 'it', parent: null },
  { id: 11, name: 'Программирование', slug: 'programming', parent: 1 },
]

function seedCategories() {
  const categoriesStore = useCategoriesStore()
  categoriesStore.$patch({ categories: mockCategories })
}

describe('ClubForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    push.mockClear()
    mockHandleSubmit.mockClear()
  })

  it('renders club type picker on create', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="club-type-picker-stub"]').exists()).toBe(true)
  })

  it('renders create form title after choosing type', async () => {
    const wrapper = createWrapper()
    await wrapper.find('[data-testid="pick-book"]').trigger('click')
    expect(wrapper.text()).toContain('Создать клуб по книге')
  })

  it('renders edit form title when clubId provided', async () => {
    const clubsStore = useClubsStore()
    vi.spyOn(clubsStore, 'fetchClub').mockResolvedValue(mockClub as unknown as Awaited<ReturnType<typeof clubsStore.fetchClub>>)

    const wrapper = createWrapper({ clubId: 1 })
    await flushPromises()
    expect(wrapper.text()).toContain('Редактирование клуба')
  })

  it('renders all form fields', async () => {
    seedCategories()
    const wrapper = createWrapper()
    await wrapper.find('[data-testid="pick-book"]').trigger('click')
    expect(wrapper.find('#bookTitle').exists()).toBe(true)
    expect(wrapper.find('#bookAuthors').exists()).toBe(true)
    expect(wrapper.find('#publicationYear').exists()).toBe(true)
    expect(wrapper.find('#description').exists()).toBe(true)
    expect(wrapper.find('#category').exists()).toBe(true)
  })

  it('shows author fields for author club type', async () => {
    seedCategories()
    const wrapper = createWrapper()
    await wrapper.find('[data-testid="pick-author"]').trigger('click')
    expect(wrapper.find('#authorName').exists()).toBe(true)
    expect(wrapper.find('#authorBio').exists()).toBe(true)
    expect(wrapper.find('#authorPhoto').exists()).toBe(true)
  })

  it('submits create form, creates club request and navigates to clubs', async () => {
    seedCategories()
    const createRequestSpy = vi.spyOn(api.api, 'clubsClubRequestsCreate').mockResolvedValue({ data: { id: 1 } } as unknown as Awaited<ReturnType<typeof api.api.clubsClubRequestsCreate>>)

    const wrapper = createWrapper()
    await wrapper.find('[data-testid="pick-book"]').trigger('click')

    await wrapper.find('[data-testid="club-form-category-select"] .custom-select__trigger').trigger('click')
    await wrapper.find('[data-testid="club-form-category-select"] .custom-select__option').trigger('click')
    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await nextTick()

    expect(createRequestSpy).toHaveBeenCalledWith({
      clubType: 'book',
      bookTitle: 'New Book',
      bookAuthors: 'New Author',
      publicationYear: 2024,
      description: 'New description',
      authorName: '',
      authorBio: '',
      category: 1,
    })
    expect(push).toHaveBeenCalledWith({ name: 'clubs' })
  })

  it('submits edit form with prefilled category and navigates to clubs', async () => {
    seedCategories()
    const clubsStore = useClubsStore()
    vi.spyOn(clubsStore, 'fetchClub').mockResolvedValue({ ...mockClub, category: 11 } as unknown as Awaited<ReturnType<typeof clubsStore.fetchClub>>)
    const partialUpdateSpy = vi.spyOn(api.api, 'clubsPartialUpdate').mockResolvedValue({ data: { id: 1 } } as unknown as Awaited<ReturnType<typeof api.api.clubsPartialUpdate>>)

    const wrapper = createWrapper({ clubId: 1 })
    await flushPromises()

    await wrapper.find('form').trigger('submit')
    await flushPromises()
    await nextTick()

    expect(partialUpdateSpy).toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith({ name: 'clubs' })
  })
})
