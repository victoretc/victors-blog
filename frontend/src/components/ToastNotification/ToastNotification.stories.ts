import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { showToast } from '@/stores/toast'
import ToastNotification from './ToastNotification.vue'

const meta = {
  title: 'Components/ToastNotification',
  component: ToastNotification,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ToastNotification>

export default meta
type Story = StoryObj<typeof meta>

export const Error: Story = {
  decorators: [
    (story) => {
      showToast('Произошла ошибка при загрузке', 'error')
      return {
        components: { story },
        template: '<story />',
      }
    },
  ],
}

export const Success: Story = {
  decorators: [
    (story) => {
      showToast('Данные успешно сохранены', 'success')
      return {
        components: { story },
        template: '<story />',
      }
    },
  ],
}
