export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useGlobalStore()
  const authStore = useAuthStore()
  if (!store.loggedIn) {
    store.status = 'cooking'
    if (window.Telegram?.WebApp.initData) {
      await authStore.authTelegram()
    }
    if (window.MiniKit?.isInstalled()) {
      await authStore.authWithWorldCoin()
    }
    await store.loadInfo()
    store.status = null
  }

  if (window.MiniKit?.isInstalled()) {
    authStore.activeAuth = 'wld'
  } else if (window.Telegram?.WebApp.initData) {
    authStore.activeAuth = 'telegram'
  }
})
