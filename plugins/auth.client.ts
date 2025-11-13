import WebApp from "@twa-dev/sdk";
import {MiniKit} from "@worldcoin/minikit-js";

export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute()
  const store = useGlobalStore()
  const authStore = useAuthStore()
  const router = useRouter()

  const logging = (message: any) => {
    console.log(message);
    authStore.logs.push(message)
  }
  window.telegram = WebApp
  MiniKit.install()
  window.MiniKit = MiniKit

  logging(route.fullPath)
  logging(`App.vue MiniKit: ${!!window.MiniKit}`)
  logging(`MiniKit user: ${JSON.stringify(window.MiniKit?.user)}`)
  logging(`App.vue MiniKit isInstalled: ${window.MiniKit?.isInstalled()}`)
  logging(`UA: ${navigator.userAgent}`);
  logging(`App.vue MiniKitBridge: ${window.MiniKitBridge}`)

  // if (!store.loggedIn) {
  //   if (WebApp.isActive) {
  //     await authStore.authTelegram()
  //   }
  //   authStore.logs.push(`window.MiniKit.isInstalled(): ${window.MiniKit.isInstalled()}`)
  //   if (window.MiniKit.isInstalled()) {
  //     await authStore.authWithWorldCoin()
  //   }
  //   await store.loadInfo()
  // }
})
