<script setup lang="ts">
import {formatFloat} from "~/lib/utils";

const store = useGlobalStore()

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

const changeBoost = (amount: number) => {
  useNativeFetch<{
    "level": number,
    "balance": number
  }>('/2024/boost', {
    method: 'POST',
    query: {
      amount: amount
    }
  }).then((res) => {
    store.updateBoost(res)
  })
}

const display2Digit = (num: number) => {
  if (num <= 9) {
    return `0${num}`
  }
  return num
}

const randomAnimate = () => {
  animationKey.value = getRandomRest()
}

const runTimer = async () => {
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
  <div class="h-full flex flex-col justify-center">
    <div class="flex-1 px-4 gap-4 text-center flex items-center justify-center flex-col">
      <div class="border shadow-inner py-1 p-4 rounded-xl font-semibold text-sm text-gray-500">
        <span v-if="store.info.doing">"{{ store.info.doing.task.name }}"</span>
        <span v-else-if="store.percent < 100">Stay focus, QuackQuack!</span>
        <span v-else>QuackQuack!</span>
      </div>
      <tgs-player
          autoplay
          loop
          style="width: 150px; height: 150px;"
          :src="animated[getRandomRest()]"
          @click="randomAnimate"
      />
      <div class="text-7xl font-extrabold flex gap-1 items-center major-mono">
        <div>{{ display2Digit(store.timer.mm) }}</div>
        <div>:</div>
        <div>{{ display2Digit(store.timer.ss) }}</div>
      </div>
      <div class="flex justify-center items-center gap-2 text-yellow-600">
        <NuxtIcon v-if="!store.isRunning" class="w-5 h-5" name="minus" @click="changeBoost(-1)"/>
        <div class="w-8 h-8 flex items-center bg-gray-100 rounded-xl py-0.5 px-2 relative">
          <img class="w-5 h-5" src="/icon/thunder.png" alt="">
          <span class="absolute text-xs -bottom-1 -right-1">x{{ Math.min(store.info.boost_balance, store.info.boost_level) }}</span>
        </div>
        <NuxtIcon v-if="!store.isRunning" class="w-5 h-5" name="plus" @click="changeBoost(1)"/>
      </div>
    </div>
    <div class="p-4 bg-white flex justify-center" @click="runTimer()">
      <div class="inline-flex w-2/3">
        <Button
            :variant="store.isRunning ? 'secondary': 'default'" size="lg"
            class="rounded-2xl h-12 w-full relative overflow-hidden "
        >
          <div v-if="store.isRunning" class="absolute inset-0 overflow-hidden">
            <div class="h-full w-full flex flex-nowrap">
              <div class="h-full bg-black/80" :style="{width: `${store.percent}%`}"/>
              <div class="wave"/>
            </div>
          </div>
          <div class="flex gap-1 items-center relative z-10 text-yellow-400 uppercase text-lg">
            <template v-if="store.percent === 100">
              <span>Claim</span>
              <img class="w-4 h-4" src="/icon/star.png" alt="">
              <span>{{ formatFloat(store.info.doing?.task.reward_amount) }}</span>
            </template>
            <span v-else-if="store.isRunning">Quacking!</span>
            <span v-else>Start</span>
          </div>
        </Button>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes filling {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.wave {
  @apply h-full w-4 relative overflow-hidden;
}

.wave:before {
  @apply rotate-90;

  content: "";
  position: absolute;
  width: 400%;
  height: 200%;
  top: -50%;
  left: -50%;
  background-image: url("/wave.svg");
  background-size: contain;
}
</style>
