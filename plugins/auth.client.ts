export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useGlobalStore()
  const authStore = useAuthStore()
  window.MiniKit.install()
  if (!store.loggedIn) {
    store.status = 'cooking'
    if (window.Telegram.WebApp.isActive) {
      await authStore.authTelegram()
    }
    if (window.MiniKit?.isInstalled()) {
      await authStore.authWithWorldCoin()
    }
    await store.loadInfo()
    store.status = null
  }
  if (window.MiniKit?.user) {
    authStore.activeAuth = 'wld'
  } else if (window.telegram?.initData) {
    authStore.activeAuth = 'telegram'
  }
})
