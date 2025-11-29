function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useGlobalStore()
  const authStore = useAuthStore()

  return {
    provide: {
      authClient: async () => {
        const isWLD = window.MiniKit?.isInstalled()
        const isTG = !!window.Telegram?.WebApp.initData
        if (!store.loggedIn && (isTG || isWLD)) {
          store.setStatus('cooking')
          if (isTG) {
            await authStore.authTelegram()
          }
          if (isWLD) {
            await authStore.authWithWorldCoin()
          }
          await store.loadInfo()
          store.setStatus(null)
        }
        if (isWLD) {
          authStore.activeAuth = 'wld'
        } else if (isTG) {
          authStore.activeAuth = 'telegram'
        }
      }
    }
  }
})
