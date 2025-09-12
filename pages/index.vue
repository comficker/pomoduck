<script setup lang="ts">
import {formatFloat} from "~/lib/utils";
import {MiniKit} from '@worldcoin/minikit-js'
import WebApp from "@twa-dev/sdk";

const store = useGlobalStore()
const authStore = useAuthStore()

useHead({
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
    elm.load(animated[animationKey.value])
  }
})
</script>

<template>
  <div
      class="h-full flex flex-col justify-center gap-4 py-4"
  >
    <div class="flex-1 px-4 text-center flex items-center justify-center flex-col gap-4">
      <div class="border shadow-inner py-1 p-4 rounded-xl font-semibold text-sm text-gray-500">
        <span v-if="store.info.doing">Doing "{{ store.info.doing.name || 'Untitled' }}"</span>
        <span v-else-if="store.percent < 100">Stay focus, Quack! Quack!</span>
        <span v-else>Quack! Quack!</span>
      </div>
      <tgs-player
          autoplay
          loop
          style="width: 150px; height: 150px;"
          :src="animated[getRandomRest()]"
          @click="randomAnimate"
      />
      <div class="text-6xl font-extrabold flex gap-3 items-center num">
        <div class="grid grid-cols-2 gap-1">
          <div v-for="i in display2Digit(store.timer.mm)" class="w-14 p-1 bg-gray-100 rounded-xl shadow-inner">
            {{ i }}
          </div>
        </div>
        <div>:</div>
        <div class="grid grid-cols-2 gap-1">
          <div v-for="i in display2Digit(store.timer.ss)" class="w-14 p-1 bg-gray-100 rounded-xl shadow-inner">
            {{ i }}
          </div>
        </div>
      </div>
      <div class="flex justify-center items-center gap-2 text-yellow-600">
        <NuxtIcon v-if="!store.isRunning" class="w-5 h-5" name="minus" @click="changeBoost(-1)"/>
        <div class="size-8 flex items-center bg-gray-100 rounded-xl py-0.5 px-2 relative">
          <img class="size-5" src="/icon/thunder.png" alt="">
          <span class="absolute text-xs -bottom-1 -right-1">
            x{{ Math.min(store.info.boost_balance, store.info.boost_level) }}
          </span>
        </div>
        <NuxtIcon v-if="!store.isRunning" class="w-5 h-5" name="plus" @click="changeBoost(1)"/>
      </div>
    </div>
    <div class="p-4 bg-white flex justify-center num">
      <div v-if="store.loggedIn" class="inline-flex w-2/3">
        <Button
            :variant="store.isRunning ? 'secondary': 'default'" size="lg"
            class="rounded-2xl h-12 w-full relative overflow-hidden"
            @click="runTimer()"
        >
          <div v-if="store.isRunning" class="absolute inset-0 overflow-hidden">
            <div class="h-full w-full flex flex-nowrap">
              <div class="h-full bg-black/80" :style="{width: `${store.percent}%`}"/>
              <div class="wave"/>
            </div>
          </div>
          <div class="flex gap-1 items-center relative z-10 text-yellow-400 uppercase text-lg">
            <template v-if="store.percent > 0">
              <span>Claim</span>
              <img class="w-4 h-4" src="/icon/star.png" alt="">
              <span>{{ formatFloat(store.info.doing?.reward_amount) }}</span>
            </template>
            <span v-else>Start</span>
          </div>
        </Button>
      </div>
      <Button v-else class="w-2/3 rounded-2xl h-12 text-xl relative overflow-hidden" @click="store.modalName = 'auth'">
        Start
      </Button>
    </div>
  </div>
</template>

<style>
</style>
