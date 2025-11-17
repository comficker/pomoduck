import {defineStore} from 'pinia'
import useStatefulCookie from "~/composables/useStatefulCookie";
import {toast} from 'vue-sonner'

function urlSafeDecode(urlencoded: string) {
  try {
    urlencoded = urlencoded.replace(/\+/g, '%20');
    return decodeURIComponent(urlencoded);
  } catch (e) {
    return urlencoded;
  }
}

function urlParseQueryString(queryString: string) {
  const params: any = {};
  if (!queryString.length) {
    return params;
  }
  const queryStringParams = queryString.split('&');
  let i, param, paramName, paramValue;
  for (i = 0; i < queryStringParams.length; i++) {
    param = queryStringParams[i].split('=');
    paramName = urlSafeDecode(param[0]);
    paramValue = param[1] == null ? null : urlSafeDecode(param[1]);
    params[paramName] = paramValue;
  }
  return params;
}

export const useAuthStore = defineStore('auth', () => {
  const route = useRoute()
  const authToken = useStatefulCookie('auth_token')
  const authTokenRefresh = useStatefulCookie('auth_token_refresh')
  const refCode = useStatefulCookie('ref')
  const logs = ref<any[]>([])
  const activeAuth = ref('local')

  const logging = (message: any) => {
    console.log(message);
    logs.value.push(message)
  }

  const resetCookie = () => {
    authToken.value = ""
    authTokenRefresh.value = ""
  }

  async function authTelegram(initData = null, connecting = false) {
    if (!initData && route.hash) {
      const h = decodeURIComponent(route.hash)
      const matches = h.matchAll(/#tgWebAppData=(.*?)&tgWebAppVersion/g);
      initData = urlParseQueryString(Array.from(matches, x => x[1])[0])
    }
    if (initData) {
      activeAuth.value = 'telegram'
      resetCookie()
      try {
        const response = await useNativeFetch<{ refresh: string, access: string, merge?: string }>(`/auth-telegram`, {
          method: 'POST',
          body: {
            auth_data: initData,
            connecting: connecting
          }
        })
        if (response) {
          authToken.value = response.access
          authTokenRefresh.value = response.refresh
          return response
        }
      } catch (e) {
        logs.value.push(e?.toString())
        logs.value.push(initData)
      }
    }
    return null
  }

  const authWithWorldCoin = async () => {
    try {
      if (!window.MiniKit || !window.MiniKit.isInstalled()) {
        return;
      }
      activeAuth.value = 'wld'
      resetCookie()
      const nonceRes = await useNativeFetch<{ nonce: string }>('/auth-wld')
      if (!nonceRes) return;
      const {finalPayload} = await window.MiniKit.commandsAsync.walletAuth({
        nonce: nonceRes.nonce,
        statement: 'Login to POMODuck',
        requestId: "0",
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      })
      const response = await useNativeFetch<{ refresh: string, access: string }>('/auth-wld', {
        method: 'POST',
        body: {
          info: window.MiniKit.user,
          nonce: nonceRes.nonce,
          payload: finalPayload
        }
      }).catch(e => {
        logging(e);
        return null
      })
      logging(JSON.stringify({
        info: window.MiniKit.user,
        nonce: nonceRes.nonce,
        payload: finalPayload
      }))
      if (response) {
        authToken.value = response.access
        authTokenRefresh.value = response.refresh
      }
    } catch (e) {
      logging(e?.toString())
    }
  }

  const authOAUTH = () => {
    if (route.query.access_token) {
      authToken.value = route.query.access_token + ''
      if (route.query.refresh_token) {
        authTokenRefresh.value = route.query.refresh_token + ''
      }
    }
  }

  const refreshToken = async (retry = 0) => {
    if (authTokenRefresh.value && retry == 0) {
      const res = await useNativeFetch<{ refresh: string, access: string }>("/auth-refresh-token", {
        method: 'POST',
        body: {
          "refresh": authTokenRefresh.value
        }
      }).catch(() => null)
      if (res) {
        authToken.value = res.access
        return
      }
    } else {
      authToken.value = ''
      authTokenRefresh.value = ''
    }
  }

  const authLocal = async (isRegister: boolean, form: {
    email: string,
    username: string,
    password: string,
    re_password?: string,
    invite_code?: string
  }) => {
    resetCookie()
    const path = isRegister ? '/auth-register' : '/auth-login'
    const res = await useNativeFetch<{ refresh: string, access: string }>(path, {
      method: 'POST',
      body: form
    }).catch(() => {
      return null
    })
    if (res) {
      authToken.value = res.access
      authTokenRefresh.value = res.refresh
    } else {
      toast("'Something went wrong!'", {
        description: 'Please recheck your input!',
      })
    }
  }

  const logout = async () => {
    resetCookie()
  }

  refCode.value = route.query.ref + ''

  return {
    logs,
    activeAuth,
    authLocal,
    logout,
    authTelegram,
    authWithWorldCoin,
    refreshToken,
    authOAUTH,
    logging
  }
})

