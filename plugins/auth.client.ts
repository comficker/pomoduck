function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useGlobalStore()
  const authStore = useAuthStore()

  return {
    provide: {
      authClient: async () => {
        if (!store.loggedIn) {
          store.setStatus('cooking')
          if (window.Telegram?.WebApp.initData) {
            await authStore.authTelegram()
          }
          await sleep(3000)
          if (window.MiniKit?.isInstalled()) {
            await authStore.authWithWorldCoin()
          }
          await store.loadInfo()
          store.setStatus(null)
        }

        if (window.MiniKit?.isInstalled()) {
          authStore.activeAuth = 'wld'
        } else if (window.Telegram?.WebApp.initData) {
          authStore.activeAuth = 'telegram'
        }
      }
    }
  }
})
