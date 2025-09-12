import {ref} from "vue"
import {defineStore} from 'pinia'
import type {AccountTask, AccountTaskDetail, Info, ITask} from "~/types";
import useStatefulCookie from "~/composables/useStatefulCookie";
import {timeSinceObject} from "~/lib/utils";
import {toast} from 'vue-sonner'

const DEFAULT_INFO: Info = {
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
    is_staff: false
}

export const useGlobalStore = defineStore('global', () => {
    const authToken = useStatefulCookie('auth_token')

    const info = ref<Info>(DEFAULT_INFO)
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
    const taskFilter = ref<'public' | 'private'>('public')
    const refreshTask = ref(0)
    const modalName = ref<'auth' | null>(null)

    const loggedIn = computed(() => info.value && info.value.id)
    const accountTask = computed(() => {
        return info.value.doing?.account_task.find(x => !x.finished_at) || info.value.doing?.account_task[0]
    })

    async function loadInfo(showLoading = true) {
        loading.value = showLoading
        if (authToken.value) {
            const response = await useNativeFetch<Info>(`/hi`, {}).catch(e => null)
            if (response) {
                handleInfo(response)
            }
        } else {
            info.value = DEFAULT_INFO
        }
        loading.value = false
        return !!(info.value && info.value.id)
    }

    function computeTimer() {
        if (info.value.doing && accountTask.value && accountTask.value.start_at) {
            const startAt = new Date(accountTask.value.start_at).getTime()
            const timeUnit = info.value.doing.duration_est * 1000
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
        modalName.value = null
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
        if (!task_id) task_id = info.value.doing?.id
        let newData: ITask | undefined = undefined;
        if (task_id) {
            newData = await useNativeFetch<ITask>(`/tasks/${task_id}/do`, {
                method: "POST",
            })
            const newAT = newData.account_task.find(x => !x.finished_at)
            if (newData.type === 'default' && info.value.doing && newAT && !newAT.start_at) {
                percent.value = 0
                info.value.balance += info.value.doing.reward_amount
                toast("Congratulations!", {
                    description: `You got ${info.value.doing.reward_amount} ${info.value.doing.reward_type}!`,
                })
                openDrawer.value = false
            }
            info.value.doing = newData
            refreshTask.value++
        }
        computeTimer()
        return newData
    }

    const changeBoost = (amount: number) => {
        if (accountTask.value && !accountTask.value.finished_at) {
            useNativeFetch<{ "balance": number }>(`/tasks/${accountTask.value?.id}/boost`, {
                method: 'POST',
                body: {
                    changed_amount: amount
                }
            }).then(r => {
                info.value.boost_balance = r.balance
                if (info.value.doing) {
                    const index = info.value.doing.account_task.findIndex(x => x.id == accountTask.value?.id)
                    if (info.value.doing && index >= 0 ) {
                        info.value.doing.account_task[index].boost_amount += amount
                    }
                }
            }).catch(e => {
                toast("Something went wrong!", {
                    description: "Boost error!",
                })
            })
        }
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
        modalName,
        changeBoost
    }
})

