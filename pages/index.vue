<script setup lang="ts">
import {formatFloat} from "~/lib/utils";

const store = useGlobalStore()

useHead({
  script: [
    {src: "https://unpkg.com/@lottiefiles/lottie-player@0.2.0/dist/tgs-player.js", async: true}
  ]
})

const animated: {[key: string]: string} = {
  'call': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_010.tgs',
  'rest1': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_016.tgs',
  'rest2': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_014.tgs',
  'rest3': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_002.tgs',
  'done': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_018.tgs',
  'running': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_003.tgs'
}

const max = computed(() => store.info.timer_running * 5 * 60 * 8.33333333e-5)

const setAnimate = (key: string) => {
  const elm = document.querySelector('tgs-player')
  if (elm) {
    elm.load(animated[key])
  }
}

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

const claim = () => {
  store.claim().then(() => {
    if (!store.info.is_running) {
      setAnimate('win')
    }
  })
}

const getRandomRest = () => {
  const items = ['rest1', 'rest2', 'rest3']
  return items[Math.floor(Math.random()*items.length)]
}

watch(() => store.percent, () => {
  if (store.info.is_running) {
    if (store.percent === 0) {
      setAnimate(getRandomRest())
    } else if (store.percent < 100) {
      setAnimate('running')
    } else {
      setAnimate('call')
    }
  } else {
    setAnimate(getRandomRest())
  }
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex gap-4 p-4">
      <div class="flex justify-between items-center gap-4">
        <div
            class="w-20 font-semibold uppercase flex gap-2 items-center justify-center bg-gray-100 rounded-xl py-0.5 px-2">
          <img src="/icon/star.png" class="w-4 h-4" alt="">
          <span class="">{{ formatFloat(store.info.balance) }}</span>
        </div>
        <div
            class="w-20 font-semibold uppercase flex gap-2 items-center justify-center bg-gray-100 rounded-xl py-0.5 px-2">
          <img src="/icon/thunder.png" class="w-4 h-4" alt="">
          <span class="">{{ store.info.boost_balance }}</span>
        </div>
      </div>
    </div>
    <div class="flex-1 p-4 gap-4 text-center flex items-center justify-center flex-col">
      <div v-if="store.percent < 100" class="border shadow-inner py-2 p-4 rounded-xl font-semibold">Stay focus</div>
      <tgs-player
          autoplay
          loop
          mode="normal"
          speed="0.8"
          style="width: 180px; height: 180px;"
          :src="animated[getRandomRest()]"
      />
      <div class="text-6xl font-bold flex gap-1 items-center" @click="randomAnimate">
        <div>{{ display2Digit(store.timer.mm) }}</div>
        <div>:</div>
        <div>{{ display2Digit(store.timer.ss) }}</div>
      </div>
      <div class="flex justify-center items-center gap-2 text-xs uppercase">
        <div>Timer</div>
        <div v-for="item in store.activeLevels" :key="item" class="underline cursor-pointer">{{ item * 5 }}</div>
        <div>Minutes</div>
      </div>
      <div class="flex justify-center items-center gap-2 text-yellow-600">
        <NuxtIcon v-if="!store.info.is_running" class="w-5 h-5" name="minus" @click="changeBoost(-1)"/>
        <div class="w-8 h-8 flex items-center bg-gray-100 rounded-xl py-0.5 px-2 relative">
          <img class="w-5 h-5" src="/icon/thunder.png" alt="">
          <span class="absolute text-xs -bottom-1 -right-1">x{{ store.info.boost_level }}</span>
        </div>
        <NuxtIcon v-if="!store.info.is_running" class="w-5 h-5" name="plus" @click="changeBoost(1)"/>
      </div>
    </div>
    <div class="sticky bottom-0 left-0 right-0 px-4 py-8 bg-white flex justify-center" @click="claim()">
      <div class="inline-flex">
        <Button
            :variant="store.info.is_running ? 'secondary': 'default'" size="lg"
            class="rounded-2xl h-12 w-full relative overflow-hidden"
        >
          <div v-if="store.info.is_running" class="absolute top-0 bottom-0 left-0 bg-primary"
               :style="{width: `${store.percent}%`}"/>
          <div class="flex gap-1 items-center relative z-10 text-yellow-400 uppercase text-lg">
            <template v-if="store.info.is_running">
              <span>Claim</span>
              <img class="w-4 h-4" src="/icon/star.png" alt="">
              <span>{{formatFloat(max)}}</span>
            </template>
            <span v-else>Start</span>
          </div>
        </Button>
      </div>
    </div>
  </div>
</template>
