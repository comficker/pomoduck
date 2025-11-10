import {ref} from "vue"
import {defineStore} from 'pinia'
import type {AccountTask, AccountTaskDetail, Achievement, Info, ITask} from "~/types";
import useStatefulCookie from "~/composables/useStatefulCookie";
import {calculateTimeDistance, formatFloat, timeSinceObject} from "~/lib/utils";
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
  boost_end: null,
  is_staff: false,
  day_streak: 0,
  egg: 0,
  footprint: 0,
  egg_extra: 0
}

export const useGlobalStore = defineStore('global', () => {
  const authToken = useStatefulCookie('auth_token')

  const info = ref<Info>(DEFAULT_INFO)
  const loading = ref(true)
  const pending = ref(false)
  const isRunning = ref(false)
  const fetched = ref(false)
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
  const modalName = ref<'auth' | 'merge' | null>(null)
  const modalData = ref<any>(null)

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
    timer.value = info.value.doing ? calculateTimeDistance(info.value.doing.duration_est * 1000) : {d: 0, hh: 0, mm: 0, ss: 0}
  }

  function isMobile() {
    const ua = navigator.userAgent.toLowerCase()
    return ua.includes('iphone') || ua.includes('android') || ua.includes('ipad');
  }

  function isIphone() {
    const ua = navigator.userAgent.toLowerCase()
    return ua.includes('iphone') || ua.includes('ipad');
  }

  function updateBoost(args: { boost_balance: number, boost_end: string }) {
    info.value.boost_balance = args.boost_balance
    info.value.boost_end = args.boost_end
  }

  async function work(task_id: number | undefined = undefined) {
    if (!loggedIn.value) {
      modalName.value = 'auth'
      return
    }
    if (!task_id) task_id = info.value.doing?.id

    if (task_id) {
      pending.value = true
      const {earned, achievements, next} = await useNativeFetch<{
        earned: any,
        achievements: Achievement[],
        next: ITask
      }>(`/tasks/${task_id}/do`, {
        method: "POST",
      })

      if (earned) {
        percent.value = 0
        if (earned.type === "boost") {
          info.value.boost_balance += earned.amount
        } else {
          info.value.balance += earned.amount
        }
        toast("Congratulations!", {
          description: `You got ${formatFloat(earned.amount, 0, 3)} ${earned.type}!`,
        })
      }

      info.value.doing = next
      refreshTask.value++
      if (next.type === 'default') {
        await useRouter().push({name: 'index'})
      }
      pending.value = false
    }
    computeTimer()
    return info.value.doing
  }

  async function stop() {
    const task_id = info.value.doing?.id
    if (task_id) {
      pending.value = true
      const current = await useNativeFetch<ITask>(`/tasks/${task_id}/stop`, {
        method: "POST",
      }).catch(() => null)
      if (current) {
        toast("Quack Quack!", {
          description: `You have successfully given up!`,
        })
        info.value.doing = current
        percent.value = 0
        isRunning.value = false
      }
      pending.value = false
    }
  }

  return {
    isRunning,
    isMobile,
    isIphone,
    info,
    fetched,
    timer,
    taskFilter,
    openDrawer,
    percent,
    refreshTask,
    loggedIn,
    loadInfo,
    loading,
    updateBoost,
    work,
    modalName,
    modalData,
    pending,
    stop
  }
})

