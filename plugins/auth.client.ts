import WebApp from "@twa-dev/sdk";
import {MiniKit} from "@worldcoin/minikit-js";
import '@worldcoin/idkit-standalone'
import {useAuthStore} from "~/stores/auth.store";

export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute()
  const store = useGlobalStore()
  const authStore = useAuthStore()
  authStore.logs.push(route.fullPath)
  window.telegram = WebApp
  window.MiniKit = MiniKit
  const router = useRouter()
  if (!store.loggedIn) {
    if (WebApp.isActive) {
      await authStore.authTelegram()
    }
    authStore.logs.push(`window.MiniKit.isInstalled(): ${window.MiniKit.isInstalled()}`)
    if (window.MiniKit.isInstalled()) {
      await authStore.authWithWorldCoin()
    }
    await store.loadInfo()
  }
  return {
    provide: {
      openLink: (url: string) => {
        if (WebApp.isActive) {
          if (url.includes("t.me")) {
            WebApp.openTelegramLink(url)
          } else {
            WebApp.openLink(url)
          }
        } else {
          window.open(url, "_blank")
        }
      },
      sendHaptic: () => {
        if (WebApp) {
          WebApp.HapticFeedback.impactOccurred('medium')
        } else if (window.MiniKit.isInstalled()) {
          MiniKit.commands.sendHapticFeedback({
            hapticsType: 'impact',
            style: 'light',
          })
        }
      },
      setupTelegram: () => {
        if (WebApp.initData) {
          const body = document.querySelector('body')
          if (body) {
            body.style.backgroundColor = "#fff"
          }
          WebApp.expand()
          WebApp.setHeaderColor("#fff")
          WebApp.setBackgroundColor("#fff")
          WebApp.BackButton.onClick(() => router.back());
          if (WebApp.enableClosingConfirmation) {
            WebApp.enableClosingConfirmation()
          }
          if (['ios', 'android'].includes(WebApp.platform)) {
            WebApp.requestFullscreen()
            document.body.style.setProperty("--head-top-extra", "100px")
          }
        }
      }
    },
  }
})
