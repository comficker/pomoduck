export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useGlobalStore()
  const authStore = useAuthStore()
  window.MiniKit.install()
  if (!store.loggedIn) {
    authStore.logging(JSON.stringify(window.MiniKit?.user || {}))
    store.status = 'cooking'
    if (window.Telegram?.WebApp.initData) {
      await authStore.authTelegram()
    }
    if (window.MiniKit?.user) {
      await authStore.authWithWorldCoin()
    }
    await store.loadInfo()
    store.status = null
  }

  if (window.MiniKit?.user) {
    authStore.activeAuth = 'wld'
  } else if (window.Telegram?.WebApp.initData) {
    authStore.activeAuth = 'telegram'
  }
})
