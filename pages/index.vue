<script setup lang="ts">
import {MiniKit} from '@worldcoin/minikit-js'
import WebApp from "@twa-dev/sdk";
import type {APIResponse, ITask} from "~/types";

const store = useGlobalStore()
const authStore = useAuthStore()

useHead({
  title: "Pomodoro Timer - PomoDuck Timer",
  script: [
    {src: "https://unpkg.com/@lottiefiles/lottie-player@0.2.0/dist/tgs-player.js", async: true}
  ]
})

const animated: { [key: string]: string } = {
  'call': '/animate/461405.tgs',
  'rest1': '/animate/461404.tgs',
  'rest2': '/animate/461401.tgs',
  'rest3': '/animate/461397.tgs',
  'done': '/animate/461413.tgs',
  'running': '/animate/461406.tgs'
}

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

const getRandomRest = () => {
  const items = ['rest1', 'rest2', 'rest3']
  return items[Math.floor(Math.random() * items.length)]
}

const animationKey = ref<string>(getRandomRest())

const display2Digit = (num: number) => {
  if (num <= 9) {
    return `0${num}`
  }
  return num.toString()
}

const randomAnimate = () => {
  animationKey.value = getRandomRest()
}

const runTimer = async () => {
  if (authStore.activeAuth === 'telegram') {
    WebApp.HapticFeedback.impactOccurred('medium')
  } else if (authStore.activeAuth === 'wld') {
    MiniKit.commands.sendHapticFeedback({
      hapticsType: 'impact',
      style: 'light',
    })
  }

  await store.work()
  if (store.info.doing?.status == 1) {
    animationKey.value = 'done'
  }
}

watch(() => store.percent, () => {
  if (store.isRunning) {
    if (store.percent === 0) {
      animationKey.value = getRandomRest()
    } else if (store.percent < 100) {
      animationKey.value = 'running'
    } else {
      animationKey.value = 'call'
    }
  } else {
    animationKey.value = getRandomRest()
  }
})

watch(animationKey, () => {
  const elm = document.querySelector('tgs-player')
  if (elm) {
    // @ts-ignore
    elm.load(animated[animationKey.value])
  }
})
</script>

<template>
  <div class="h-full flex flex-col justify-center gap-4 pb-16">
    <div class="flex-1 px-4 text-center flex items-center justify-center flex-col gap-4">
      <tgs-player
          autoplay
          loop
          style="width: 120px; height: 120px;"
          :src="animated[getRandomRest()]"
          @click="randomAnimate"
      />
      <div class="text-6xl md:text-8xl font-extrabold flex gap-3 items-center text-left">
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
      <NuxtLink
          to="/boost"
          class="cursor-pointer num inline-flex items-center gap-2 bg-gray-100 font-bold text-yellow-500 rounded-lg text-xs py-1 px-3 relative border"
      >
        <img class="size-4" src="/icon/thunder.png" alt="">
        <span>BOOST</span>
      </NuxtLink>
    </div>
    <div class="p-4 flex flex-col justify-center num gap-4 items-center">
      <div v-if="store.loggedIn" class="inline-flex w-3/4 mx-auto">
        <Button
            :variant="store.isRunning ? 'secondary': 'default'" size="lg"
            class="rounded-2xl h-12 w-full relative overflow-hidden"
            @click="runTimer()"
        >
          <div v-if="store.isRunning" class="absolute bg-white inset-0 overflow-hidden">
            <div class="h-full w-full flex flex-nowrap">
              <div class="h-full bg-black/80" :style="{width: `${store.percent}%`}"/>
              <div class="wave"/>
            </div>
          </div>
          <div class="flex gap-1 items-center relative z-10 text-yellow-400 uppercase text-lg">
            <template v-if="store.percent > 0">
              <span>Harvest</span>
              <NuxtIcon name="barley" class="size-5"/>
            </template>
            <span v-else>{{ startText }}</span>
          </div>
        </Button>
      </div>
      <Button v-else class="w-2/3 rounded-2xl h-12 text-xl relative overflow-hidden" @click="store.modalName = 'auth'">
        {{startText}}
      </Button>
      <div v-if="!store.isRunning" class="flex flex-nowrap gap-4 text-xs uppercase font-semibold justify-center">
        <div v-for="i in ['work', 'break']" class="flex items-center gap-2">
          <NuxtIcon :name="i" class="text-gray-500 size-4"/>
          <div class="cursor-pointer underline" v-for="item in taskRes?.results.filter(x => x.tag === i)" @click="store.work(item.id)">{{item.duration_est / 60}} Mins</div>
        </div>
        <NuxtLink class="underline" to="/task">More...</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style>
</style>
