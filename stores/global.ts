import {ref} from "vue"
import {defineStore} from 'pinia'
import type {Info} from "~/types";
import useStatefulCookie from "~/composables/useStatefulCookie";
import {timeSinceObject} from "~/lib/utils";

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

const LEVELS = [1, 3, 6, 12, 24, 36, 48]

export const useGlobalStore = defineStore('global', () => {
    const route = useRoute()

    const authToken = useStatefulCookie('auth_token')
    const telegramID = useStatefulCookie('telegram.id')
    const authData = useStatefulCookie('auth_data')

    const drawer = ref<string | null>(null)
    const info = ref<Info>({
        id: 0,
        tg_id: 0,
        balance: 0,
        checkin_day: 0,
        checkin_last_time: "",
        first_name: "",
        last_name: "",
        timer_level: 0,
        timer_running: 0,
        username: "Anonymous",
        last_claim: "",
        meta: {},
        boost_level: 0,
        boost_balance: 0,
        is_running: false
    })
    const loading = ref(true)
    const fetched = ref(false)
    const speed = computed(() => {
        return 0
    })
    const percent = ref(0)
    const timeLeft = ref(0)
    const balances = ref<{ token: string, balance: number }[]>()
    const showModal = ref<boolean>(false)
    const claimable = ref(0)
    const timer = ref({
        d: 0,
        hh: 0,
        mm: 0,
        ss: 0
    })
    const activeLevels = computed(() => LEVELS.filter(x => x <= info.value.timer_level))

    async function authTelegram(showLoading = true) {
        loading.value = showLoading
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
        }
        loading.value = false
        await loadInfo()
    }

    async function loadInfo(showLoading = true) {
        loading.value = showLoading
        if (authToken.value) {
            const response = await useNativeFetch<Info>(`/hi`, {})
            if (response) {
                handleInfo(response)
            }
        }
        loading.value = false
    }

    function handleInfo(inf: Info) {
        info.value = {
            ...info.value,
            ...inf
        };
        fetched.value = true
        if (window.itv) {
            clearInterval(window.itv)
        }
        window.itv = setInterval(() => {
            if (info.value.is_running) {
                const currentTimer = info.value.timer_running * 5 * 60 * 1000
                const now = new Date().getTime()
                const last = new Date(info.value.last_claim).getTime()
                const deadline = last + currentTimer
                const timeRan = now - last
                const is_running = timeRan < currentTimer
                claimable.value = 8.33333333e-5 * (is_running ? timeRan : currentTimer) / 1000
                percent.value = is_running ? (100 * timeRan / currentTimer) : 100
                if (percent.value < 100) {
                    timer.value = timeSinceObject(deadline, true)
                } else {
                    timer.value = {d: 0, hh: 0, mm: 0, ss: 0}
                }
            }
        }, 1000)
    }

    function toggleModal() {
        showModal.value = !showModal.value
    }

    function isUserOnTelegram() {
        const ua = navigator.userAgent.toLowerCase()
        return ua.includes('iphone') || ua.includes('android') || ua.includes('ipad');
    }

    function isIphone() {
        const ua = navigator.userAgent.toLowerCase()
        return ua.includes('iphone') || ua.includes('ipad');
    }

    function updateBalance(point: number) {

    }

    function updateEnergy(e: number) {

    }

    function setDrawer(d: string | null) {
        drawer.value = d
    }

    async function claim() {
        if (percent.value === 100 || !info.value.is_running) {
            const {amount, last_claim, boost_balance, boost_level, is_running} = await useNativeFetch<{
                amount: number,
                last_claim: string,
                boost_balance: number,
                boost_level: number
                is_running: boolean
            }>('/claim', {
                method: 'POST',
            })
            info.value.balance += amount
            info.value.last_claim = new Date(last_claim).toISOString()
            info.value.is_running = is_running
            info.value.boost_balance = boost_balance
            info.value.boost_level = boost_level
            return true
        }
        return false
    }

    async function claimCommission() {
        if (percent.value === 100) {
            const amount = await useNativeFetch<number>('/commission/claim', {
                method: 'POST',
            })
            info.value.balance += amount
        }
    }

    function updateBoost(boost: { balance: number, level: number }) {
        info.value.boost_level = boost.level
        info.value.boost_balance = boost.balance
    }

    return {
        authTelegram,
        loading,
        info,
        speed,
        fetched,
        loadInfo,
        percent,
        telegramID,
        balances,
        showModal,
        toggleModal,
        isUserOnTelegram,
        isIphone,
        authData,
        timeLeft,
        updateBalance,
        updateEnergy,
        setDrawer,
        drawer,
        claimable,
        claim,
        claimCommission,
        updateBoost,
        activeLevels,
        timer
    }
})

