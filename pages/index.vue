<script setup lang="ts">
import {MiniKit} from '@worldcoin/minikit-js'
import WebApp from "@twa-dev/sdk";
import type {APIResponse, ITask} from "~/types";
import CurrentTask from "~/components/CurentTask.vue";

const store = useGlobalStore()
const authStore = useAuthStore()

useHead({
  title: "Pomodoro Timer - PomoDuck Timer"
})

const holdStart = ref<Date | null>(null)
const now = ref<Date | null>(new Date())
const intervalId = ref<any>(null)
const timeoutId = ref<any>(null)

const {data: taskRes} = useAuthFetch<APIResponse<ITask>>(`/tasks/`, {
  method: "GET",
  query: {
    page_size: 10,
    type: 'default',
    status: 1
  },
  key: 'index'
})

const startText = computed(() => {
  if (store.info.doing) {
    return `Start ${store.info.doing.tag} in ${store.info.doing.duration_est / 60} mins`
  }
  return 'Start a pomodoro'
})
const boost = computed(() => {
  let current = store.info.boost_level || 1
  if (store.info.boost_end) {
    const now = new Date()
    const end = new Date(store.info.boost_end)
    if (end.getTime() >= now.getTime()) {
      current = current * 2
    }
    return {
      level: current,
      end: end
    }
  }
  return {
    level: current,
    end: null
  }
})
const holdPercent = computed(() => {
  if (now.value && holdStart.value) {
    return 100 * (1 - (now.value.getTime() - holdStart.value.getTime()) / 3000)
  }
  return 0
})

const display2Digit = (num: number) => {
  if (num <= 9) {
    return `0${num}`
  }
  return num.toString()
}

const runTimer = async () => {
  if (store.isRunning) {
    return
  }
  if (authStore.activeAuth === 'telegram') {
    WebApp.HapticFeedback.impactOccurred('medium')
  } else if (authStore.activeAuth === 'wld') {
    MiniKit.commands.sendHapticFeedback({
      hapticsType: 'impact',
      style: 'light',
    })
  }

  await store.work()
}

const onMouseDown = () => {
  if (store.isRunning) {
    holdStart.value = new Date()
    now.value = new Date()
    intervalId.value = setInterval(() => {
      now.value = new Date()
    }, 100)

    timeoutId.value = setTimeout(async () => {
      if (intervalId.value) {
        clearInterval(intervalId.value)
      }
      if (holdStart.value) {
        await store.stop()
        holdStart.value = null
      }
    }, 3000)
  }
}

const onMouseUp = () => {
  holdStart.value = null
  now.value = null
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }
}
</script>

<template>
  <div id="timer" class="h-full flex flex-col justify-center gap-4 pb-16">
    <div class="flex-1 px-4 text-center flex items-center justify-center flex-col gap-4">
      <div v-if="!store.isRunning" class="flex flex-nowrap gap-4 text-xs uppercase font-semibold justify-center">
        <div v-for="i in ['work', 'break']" class="flex items-center gap-2">
          <NuxtIcon :name="i" class="text-gray-500 size-4"/>
          <div
              class="cursor-pointer underline"
              v-for="item in taskRes?.results.filter(x => x.tag === i)"
              @click="store.work(item.id)">{{ item.duration_est / 60 }} Mins
          </div>
        </div>
        <NuxtLink class="underline" to="/task">More...</NuxtLink>
      </div>
      <CurrentTask v-else/>
      <div class="content text-7xl md:text-9xl font-extrabold flex gap-3 items-center text-left">
        <div class="grid grid-cols-2 gap-1">
          <div v-for="(i, index) in display2Digit(store.timer.mm)" class="w-12 md:w-20 p-1"
               :class="{'text-right': index == 0}">
            <span>{{ i }}</span>
          </div>
        </div>
        <div>:</div>
        <div class="grid grid-cols-2 gap-1">
          <div v-for="(i, index) in display2Digit(store.timer.ss)" class="w-12 md:w-20 p-1"
               :class="{'text-right': index == 0}">
            <span>{{ i }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="p-4 flex flex-col justify-center items-center">
      <div v-if="store.loggedIn" class="inline-flex w-3/4 md:w-1/2 mx-auto">
        <Button
            :variant="store.isRunning ? 'secondary': 'default'" size="lg"
            class="btn-timer"
            :class="{'animate-pulse': store.pending}"
            @click="runTimer"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp"
            @touchstart="onMouseDown"
            @touchend="onMouseUp"
        >
          <div v-if="store.isRunning" class="absolute bg-white inset-0 overflow-hidden">
            <div class="h-full w-full flex flex-nowrap">
              <div class="h-full bg-black/80 duration-200"
                   :style="{width: `${holdStart ? holdPercent : store.percent}%`}"/>
              <div class="wave"/>
            </div>
          </div>
          <div class="flex gap-1 items-center relative z-10 text-yellow-400 uppercase text-lg">
            <span v-if="store.pending">...</span>
            <template v-else-if="store.percent >= 100">
              <img src="/icon/star.png" alt="Achievement" class="size-5"/>
              <span>Claim</span>
              <span>{{ 0.005 * (store.info.doing?.duration_est || 25) / 60 * boost.level }}XP</span>
              <img src="/icon/star.png" alt="Achievement" class="size-5"/>
            </template>
            <span v-else-if="store.percent > 0">
              hold to give up
            </span>
            <span v-else>{{ startText }}</span>
          </div>
        </Button>
      </div>
      <Button v-else class="w-2/3 rounded-2xl h-12 text-xl relative overflow-hidden" @click="store.modalName = 'auth'">
        {{ startText }}
      </Button>
      <div class="my-4 flex flex-col items-center justify-center gap-2 text-xs font-bold uppercase">
        <NuxtLink
            to="/boost"
            class="flex gap-1 cursor-pointer items-center text-yellow-500 relative"
        >
          <img class="size-4" src="/icon/thunder.png" alt="">
          <span>Boost</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
