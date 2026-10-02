import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ClubFormInstruction from './ClubFormInstruction.vue'

const meta = {
  title: 'Components/ClubFormInstruction',
  component: ClubFormInstruction,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ClubFormInstruction>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    open: true,
  },
}
