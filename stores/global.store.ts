import {ref} from "vue"
import {defineStore} from 'pinia'
import type {AccountTaskDetail, Info} from "~/types";
import useStatefulCookie from "~/composables/useStatefulCookie";
import {timeSinceObject} from "~/lib/utils";
import {toast} from "~/components/ui/toast";

export const useGlobalStore = defineStore('global', () => {
    const authToken = useStatefulCookie('auth_token')

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
    const refreshTask = ref(0)
    const modalName = ref<'auth' | null>(null)

    const loggedIn = computed(() => info.value && info.value.id)

    async function loadInfo(showLoading = true) {
        loading.value = showLoading
        if (authToken.value) {
            const response = await useNativeFetch<Info>(`/hi`, {}).catch(e => null)
            if (response) {
                handleInfo(response)
            }
        }
        loading.value = false
        return !!(info.value && info.value.id)
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
        computeTimer()
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
                toast({
                    title: "Congratulations!",
                    description: `You got ${info.value.doing.task.reward_amount} ${info.value.doing.task.reward_type}!`,
                })
            }
            info.value.doing = newData
            refreshTask.value ++
        }
        computeTimer()
    }

    return {
        isRunning,
        loading,
        info,
        fetched,
        timer,
        taskFilter,
        openDrawer,
        percent,
        isMobile,
        refreshTask,
        loggedIn,
        isIphone,
        loadInfo,
        updateBoost,
        work,
        modalName
    }
})

