import useStatefulCookie from "~/composables/useStatefulCookie";
import {useAuthStore} from "~/stores/auth.store";

export default defineNuxtPlugin(async (nuxtApp) => {
  const authTokenRefresh = useStatefulCookie('auth_token_refresh')
  const store = useGlobalStore()
  const authStore = useAuthStore()
  await authStore.init()
  let retry = 0
  while (true) {
    const isSuccess = await store.init()
    if (!isSuccess && authTokenRefresh.value) {
      await authStore.refreshToken(retry)
    }
    if (isSuccess || retry === 2) {
      break
    }
    retry++
  }
})
