import store from '@/store'

export const toast = {
  show(options) {
    return store.dispatch('toast/show', options)
  },
  success(message, title = '', duration) {
    if (typeof message === 'object' && message !== null) {
      return store.dispatch('toast/success', message)
    }
    return store.dispatch('toast/success', { message, title, duration })
  },
  error(message, title = '', duration) {
    if (typeof message === 'object' && message !== null) {
      return store.dispatch('toast/error', message)
    }
    return store.dispatch('toast/error', { message, title, duration })
  },
  warning(message, title = '', duration) {
    if (typeof message === 'object' && message !== null) {
      return store.dispatch('toast/warning', message)
    }
    return store.dispatch('toast/warning', { message, title, duration })
  },
  info(message, title = '', duration) {
    if (typeof message === 'object' && message !== null) {
      return store.dispatch('toast/info', message)
    }
    return store.dispatch('toast/info', { message, title, duration })
  },
  remove(id) {
    return store.dispatch('toast/remove', id)
  },
  clear() {
    return store.dispatch('toast/clear')
  }
}

export default toast
