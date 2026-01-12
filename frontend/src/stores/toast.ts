import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: number
  message: string
  type: ToastType
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function add(message: string, type: ToastType = 'info', duration = 3000) {
    const id = Date.now()
    
    toasts.value.push({ id, message, type, duration })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  function remove(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function success(msg: string) { add(msg, 'success') }
  function error(msg: string) { add(msg, 'error') }
  function warning(msg: string) { add(msg, 'warning') }
  function info(msg: string) { add(msg, 'info') }

  return { toasts, add, remove, success, error, warning, info }
})