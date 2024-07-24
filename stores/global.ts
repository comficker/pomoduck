import {ref} from "vue"
import {defineStore} from 'pinia'
import type {Info} from "~/types";
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

const LEVELS = [1, 3, 6, 12, 24, 36, 48]

export const useGlobalStore = defineStore('global', () => {
    const route = useRoute()
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
        level: 0,
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

    const activeLevels = computed(() => LEVELS.filter(x => x <= info.value.level))

    async function loadInfo(showLoading = true) {
        loading.value = showLoading
        if (route.hash) {
            const h = decodeURIComponent(route.hash)
            const matches = h.matchAll(/#tgWebAppData=(.*?)&tgWebAppVersion/g);
            const initData = urlParseQueryString(Array.from(matches, x => x[1])[0])
            authData.value = JSON.stringify(initData)
        }
        if (authData.value) {
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
            const seconds1 = (new Date().getTime() - new Date(info.value.last_claim).getTime()) / 1000
            const maxTime = info.value.level * 2 * 60 * 60
            claimable.value = 8.33333333e-5 * (seconds1 < maxTime ? seconds1 : maxTime)
            percent.value = seconds1 < maxTime ? 100 * seconds1 / maxTime : 100
        }, 1000 / 3)
    }

    function toggleModal() {
        showModal.value = !showModal.value
    }

    function isUserOnTelegram() {
        const ua = navigator.userAgent.toLowerCase()
        return ua.includes('iphone') || ua.includes('android') || ua.includes('ipad');
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
            const {amount, last_claim, boost_balance, boost_level} = await useNativeFetch<{
                amount: number,
                last_claim: string,
                boost_balance: number,
                boost_level: number
            }>('/claim', {
                method: 'POST',
            })
            info.value.balance += amount
            info.value.last_claim = new Date(last_claim).toISOString()
            info.value.is_running = amount == 0
            info.value.boost_balance = boost_balance
            info.value.boost_level = boost_level
        }
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
        activeLevels
    }
})

