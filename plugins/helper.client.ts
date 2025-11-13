import WebApp from "@twa-dev/sdk";
import {MiniKit} from "@worldcoin/minikit-js";
import '@worldcoin/idkit-standalone'
import {useAuthStore} from "~/stores/auth.store";

export default defineNuxtPlugin(async (nuxtApp) => {
  const router = useRouter()
  const authStore = useAuthStore()
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
      },
      logging: (message: any) => {
        console.log(message);
        authStore.logs.push(message)
      }
    },
  }
})
