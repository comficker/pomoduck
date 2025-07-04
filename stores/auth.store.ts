import {defineStore} from 'pinia'
import {MiniKit} from '@worldcoin/minikit-js'
import useStatefulCookie from "~/composables/useStatefulCookie";

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
    const loading = ref<boolean>(false);
    const route = useRoute()
    const authToken = useStatefulCookie('auth_token')
    const store = useGlobalStore()
    const logs = ref<any[]>([])
    const activeAuth = ref('local')
    const loggedIn = ref(false)

    async function authTelegram(showLoading = true) {
        if (route.hash) {
            const h = decodeURIComponent(route.hash)
            const matches = h.matchAll(/#tgWebAppData=(.*?)&tgWebAppVersion/g);
            const initData = urlParseQueryString(Array.from(matches, x => x[1])[0])
            const response = await useNativeFetch<{ refresh: string, access: string }>(`/auth-telegram`, {
                method: 'GET',
                query: {
                    auth_data: initData
                }
            })
            if (response) {
                authToken.value = response.access
            }
            activeAuth.value = 'telegram'
        }
    }

    const authWithWorldCoin = async () => {
        try {
            if (!MiniKit.isInstalled()) {
                logs.value.push('Tried to invoke "walletAuth", but MiniKit is not installed.')
                return;
            }
            activeAuth.value = 'wld'
            const nonceRes = await useNativeFetch<{ nonce: string }>('/auth-wld')
            if (!nonceRes) return;
            logs.value.push(nonceRes)
            const {finalPayload} = await MiniKit.commandsAsync.walletAuth({
                nonce: nonceRes.nonce,
                statement: 'Login to PomoDuck',
                requestId: "0",
                expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
            })
            logs.value.push(finalPayload)
            const response = await useNativeFetch<{ refresh: string, access: string }>('/auth-wld', {
                method: 'POST',
                body: {
                    info: MiniKit.user,
                    nonce: nonceRes.nonce,
                    payload: finalPayload
                }
            }).catch(e => {
                logs.value.push(e.response.data)
                return null
            })
            logs.value.push({
                info: MiniKit.user,
                nonce: nonceRes.nonce,
                payload: finalPayload
            })
            if (response) {
                authToken.value = response.access
            }
        } catch (e) {
            logs.value.push(e?.toString())
        }
    }

    const auth = async () => {
        loading.value = true
        if (!authToken.value) {
            await authTelegram()
            await authWithWorldCoin()
        }
        const isSuccess = await store.loadInfo(true)
        if (authToken.value && !isSuccess) {
            authToken.value = ''
            await auth()
        }
        loggedIn.value = !!store.info && !!store.info.id
        loading.value = false
    }

    return {
        loading,
        logs,
        activeAuth,
        loggedIn,
        auth,
    }
})

