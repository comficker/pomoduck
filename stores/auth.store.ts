import {defineStore} from 'pinia'
import {MiniKit} from '@worldcoin/minikit-js'
import useStatefulCookie from "~/composables/useStatefulCookie";
import { toast } from 'vue-sonner'

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
    const cooking = ref<boolean>(false);
    const route = useRoute()
    const authToken = useStatefulCookie('auth_token')
    const authTokenRefresh = useStatefulCookie('auth_token_refresh')
    const store = useGlobalStore()
    const logs = ref<any[]>([])
    const activeAuth = ref('local')
    const loggedIn = ref(false)

    async function authTelegram() {
        if (route.hash) {
            const h = decodeURIComponent(route.hash)
            const matches = h.matchAll(/#tgWebAppData=(.*?)&tgWebAppVersion/g);
            const initData = urlParseQueryString(Array.from(matches, x => x[1])[0])
            if (initData) {
                activeAuth.value = 'telegram'
                cooking.value = true
                try {
                    const response = await useNativeFetch<{ refresh: string, access: string }>(`/auth-telegram`, {
                        method: 'GET',
                        query: {
                            auth_data: initData
                        }
                    })
                    if (response) {
                        authToken.value = response.access
                        authTokenRefresh.value = response.refresh
                    }
                } catch (e) {
                    logs.value.push(e?.toString())
                }
            }
        }
    }

    const authWithWorldCoin = async () => {
        try {
            if (!window.MiniKit || !MiniKit.isInstalled()) {
                return;
            }
            activeAuth.value = 'wld'
            cooking.value = true
            const nonceRes = await useNativeFetch<{ nonce: string }>('/auth-wld')
            if (!nonceRes) return;
            const {finalPayload} = await MiniKit.commandsAsync.walletAuth({
                nonce: nonceRes.nonce,
                statement: 'Login to POMODuck',
                requestId: "0",
                expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            })
            const response = await useNativeFetch<{ refresh: string, access: string }>('/auth-wld', {
                method: 'POST',
                body: {
                    info: MiniKit.user,
                    nonce: nonceRes.nonce,
                    payload: finalPayload
                }
            }).catch(e => {
                console.log(e);
                return null
            })
            if (response) {
                authToken.value = response.access
                authTokenRefresh.value = response.refresh
            }
        } catch (e) {
            logs.value.push(e?.toString())
        }
    }

    const authLocal = async (isRegister: boolean, form: {
        email: string,
        username: string,
        password: string,
        re_password?: string,
        invite_code?: string
    }) => {
        authToken.value = ''
        authTokenRefresh.value = ''
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
            await auth()
            if (loggedIn.value) store.modalName = null;
        } else {
            toast("'Something went wrong!'", {
                description: 'Please recheck your input!',
            })
        }
    }

    const refreshToken = async () => {
        if (authTokenRefresh.value) {
            const res = await useNativeFetch<{ refresh: string, access: string }>("/auth-refresh-token", {
                method: 'POST',
                body: {
                    "refresh": authTokenRefresh.value
                }
            }).catch(() => null)
            if (res) {
                authToken.value = res.access
                await auth()
                return
            }
        }
        authToken.value = ''
        authTokenRefresh.value = ''
    }

    const auth = async () => {
        cooking.value = true
        await authTelegram()
        await authWithWorldCoin()
        const isSuccess = await store.loadInfo(true)
        if (authToken.value && !isSuccess) {
            await refreshToken()
        }
        loggedIn.value = !!store.info && !!store.info.id
        cooking.value = false
    }

    const logout = async () => {
        authToken.value = ''
        authTokenRefresh.value = ''
        await store.loadInfo()
    }

    return {
        cooking,
        logs,
        activeAuth,
        loggedIn,
        authLocal,
        auth,
        logout
    }
})

