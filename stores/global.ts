import {ref} from "vue"
import {defineStore} from 'pinia'
import type {AccountTaskDetail, Info, ITask} from "~/types";
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

export const useGlobalStore = defineStore('global', () => {
    const route = useRoute()

    const authToken = useStatefulCookie('auth_token')
    const telegramID = useStatefulCookie('telegram.id')
    const isTelegram = ref(false)

    const info = ref<Info>({
        id: 0,
        tg_id: 0,
        username: "Anonymous",
        first_name: "",
        last_name: "",
        balance: 0,
        checkin_day: 0,
        checkin_last_time: "",
        meta: {},
        boost_level: 0,
        boost_balance: 0,
    })
    const loading = ref(true)
    const fetched = ref(false)
    const isRunning = ref(false)
    const openDrawer = ref(false)
    const percent = ref(0)
    const timer = ref({
        d: 0,
        hh: 0,
        mm: 0,
        ss: 0
    })
    const taskFilter = ref('public')

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
            isTelegram.value = true
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

    function computeTimer() {
        if (info.value.doing && info.value.doing.start_at) {
            const startAt = new Date(info.value.doing.start_at).getTime()
            const timeUnit = info.value.doing?.task.duration_est * 1000
            const now = new Date().getTime()
            const deadline = startAt + timeUnit
            const timeRan = now - startAt

            isRunning.value = timeRan <= timeUnit
            percent.value = isRunning.value ? (100 * timeRan / timeUnit) : 100

            if (isRunning.value) {
                timer.value = timeSinceObject(deadline, true)
                return
            }
        }
        resetTimer()
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
        window.itv = setInterval(() => computeTimer(), 500)
    }

    function resetTimer() {
        isRunning.value = false
        timer.value = {d: 0, hh: 0, mm: 0, ss: 0}
    }

    function isMobile() {
        const ua = navigator.userAgent.toLowerCase()
        return ua.includes('iphone') || ua.includes('android') || ua.includes('ipad');
    }

    function isIphone() {
        const ua = navigator.userAgent.toLowerCase()
        return ua.includes('iphone') || ua.includes('ipad');
    }

    function updateBoost(boost: { balance: number, level: number }) {
        info.value.boost_level = boost.level
        info.value.boost_balance = boost.balance
    }

    async function work(task_id: number | undefined = undefined) {
        if (!task_id) task_id = info.value.doing?.task.id
        else openDrawer.value = false;

        if (task_id) {
            const newData = await useNativeFetch<AccountTaskDetail>(`/tasks/${task_id}/do`, {
                method: "POST",
            })
            if (info.value.doing && newData.id !== info.value.doing.id && !newData.start_at) {
                percent.value = 0
                info.value.balance += info.value.doing.task.reward_amount
            }
            info.value.doing = newData
        } else {

        }
        computeTimer()
    }

    return {
        isRunning,
        loading,
        info,
        fetched,
        isIphone,
        isTelegram,
        timer,
        taskFilter,
        openDrawer,
        percent,
        telegramID,
        isMobile,
        authTelegram,
        loadInfo,
        updateBoost,
        work,

    }
})

