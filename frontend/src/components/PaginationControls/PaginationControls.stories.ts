import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PaginationControls from './PaginationControls.vue'

const meta = {
  title: 'Components/PaginationControls',
  component: PaginationControls,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PaginationControls>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
    pageSize: 10,
  },
}

export const LastPage: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
    pageSize: 10,
  },
}
