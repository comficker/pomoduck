import {defineStore} from 'pinia'
import {MiniKit} from '@worldcoin/minikit-js'
import useStatefulCookie from "~/composables/useStatefulCookie";
import {toast} from "~/components/ui/toast";

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

    async function authTelegram() {
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
                return;
            }
            activeAuth.value = 'wld'
            const nonceRes = await useNativeFetch<{ nonce: string }>('/auth-wld')
            if (!nonceRes) return;
            const {finalPayload} = await MiniKit.commandsAsync.walletAuth({
                nonce: nonceRes.nonce,
                statement: 'Login to PomoDuck',
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
            }
        } catch (e) {
            logs.value.push(e?.toString())
        }
    }

    const authLocal = async (isRegister: boolean, form: {
        email: string,
        username: string,
        password: string,
        password2: string
    }) => {
        const path = isRegister ? '/auth-register' : '/auth-login'
        const res = await useNativeFetch<{ refresh: string, access: string }>(path, {
            method: 'POST',
            body: form
        }).catch(() => {
            return null
        })
        if (res) {
            authToken.value = res.access
            await auth()
        } else {
            toast({
                variant: 'destructive',
                title: 'Something went wrong!',
                description: 'Please recheck your input!',
            })
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
        authLocal,
        auth,
    }
})

