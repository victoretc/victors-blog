import type { Meta, StoryObj } from '@storybook/vue3-vite'
import BaseButton from './BaseButton.vue'

const meta = {
  title: 'Components/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: {
      test: 'error',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'outline', 'brand-outline', 'danger', 'ghost'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    default: { control: 'text' },
  },
  args: {
    variant: 'primary',
    loading: false,
    disabled: false,
    fullWidth: false,
    type: 'button',
    default: 'Нажми меня',
  },
} satisfies Meta<typeof BaseButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary', default: 'Присоединиться' },
}

export const Outline: Story = {
  args: { variant: 'outline', default: 'Отмена' },
}

export const BrandOutline: Story = {
  args: { variant: 'brand-outline', default: 'Открыть' },
}

export const Danger: Story = {
  args: { variant: 'danger', default: 'Удалить аккаунт' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', default: 'Назад' },
}

export const Loading: Story = {
  args: { loading: true, default: 'Загрузка...' },
}

export const Disabled: Story = {
  args: { disabled: true, default: 'Недоступно' },
}

export const FullWidth: Story = {
  parameters: { layout: 'padded' },
  args: { fullWidth: true, default: 'На всю ширину' },
}
