export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useGlobalStore()
  const authStore = useAuthStore()
  if (!store.loggedIn) {
    authStore.logging(JSON.stringify(window.MiniKit?.user || {}))
    store.status = 'cooking'
    if (window.Telegram?.WebApp.initData) {
      await authStore.authTelegram()
    }
    authStore.logging("isInstalled: " + window.MiniKit?.isInstalled())
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
