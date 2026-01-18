import { defineStore } from 'pinia'
import { ref } from 'vue'

interface DialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDestructive?: boolean 
}

export const useDialogStore = defineStore('dialog', () => {
  const isOpen = ref(false)
  const options = ref<DialogOptions>({
    title: '',
    message: ''
  })
 
  const resolvePromise = ref<((value: boolean) => void) | null>(null)

  function open(opts: DialogOptions): Promise<boolean> {
    options.value = {
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      isDestructive: false,
      ...opts
    }
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise.value = resolve
    })
  }

  function confirm() {
    if (resolvePromise.value) resolvePromise.value(true)
    close()
  }

  function cancel() {
    if (resolvePromise.value) resolvePromise.value(false)
    close()
  }

  function close() {
    isOpen.value = false
    resolvePromise.value = null
  }

  return {
    isOpen,
    options,
    open,
    confirm,
    cancel
  }
})