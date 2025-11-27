import {useAuthStore} from "~/stores/auth.store";

export default defineNuxtPlugin(async (nuxtApp) => {
  const router = useRouter()
  const authStore = useAuthStore()
  return {
    provide: {
      openLink: (url: string) => {
        if (window.Telegram.WebApp.isActive) {
          if (url.includes("t.me")) {
            window.Telegram.WebApp.openTelegramLink(url)
          } else {
            window.Telegram.WebApp.openLink(url)
          }
        } else {
          window.open(url, "_blank")
        }
      },
      sendHaptic: () => {
        if (window.Telegram && window.Telegram.WebApp.initData) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
        } else if (window.MiniKit.isInstalled()) {
          window.MiniKit.commands.sendHapticFeedback({
            hapticsType: 'impact',
            style: 'light',
          })
        }
      },
      setupTelegram: () => {
        if (window.Telegram.WebApp.initData) {
          window.Telegram.WebApp.expand()
          const isDark = document.documentElement.classList.contains("dark")
          window.Telegram.WebApp.setHeaderColor(isDark? "#000": '#FFF')
          window.Telegram.WebApp.setBackgroundColor(isDark? "#000": '#FFF')
          window.Telegram.WebApp.BackButton.onClick(() => router.back());
          if (window.Telegram.WebApp.enableClosingConfirmation) {
            window.Telegram.WebApp.enableClosingConfirmation()
          }
          if (['ios', 'android'].includes(window.Telegram.WebApp.platform)) {
            window.Telegram.WebApp.requestFullscreen()
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
