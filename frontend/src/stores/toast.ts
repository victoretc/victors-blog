import { ref } from 'vue'

export type ToastType = 'error' | 'success'

interface ToastState {
  visible: boolean
  message: string
  type: ToastType
}

const toast = ref<ToastState>({
  visible: false,
  message: '',
  type: 'error',
})

let timeout: ReturnType<typeof setTimeout> | null = null

export function showToast(message: string, type: ToastType = 'error', duration = 5000) {
  if (timeout) clearTimeout(timeout)
  toast.value = { visible: true, message, type }
  timeout = setTimeout(() => {
    toast.value.visible = false
  }, duration)
}

export function hideToast() {
  if (timeout) clearTimeout(timeout)
  toast.value.visible = false
}

export function useToast() {
  return toast
}
