<script setup lang="ts">
import {formatFloat} from "~/lib/utils";

const store = useGlobalStore()

useHead({
  script: [
    {src: "https://unpkg.com/@lottiefiles/lottie-player@0.2.0/dist/tgs-player.js", async: true}
  ]
})

const animated = {
  'call': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_010.tgs',
  'rest1': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_016.tgs',
  'rest2': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_014.tgs',
  'rest3': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_002.tgs',
  'lose': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_008.tgs',
  'done': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_018.tgs',
  'running': 'https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_003.tgs'
}

onMounted(() => {

})

const randomAnimate = () => {
  const elm = document.querySelector('tgs-player')
  if (elm) {
    elm.load(animated.done)
  }
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex gap-4 p-4">
      <div class="flex justify-between items-center gap-4">
        <div class="w-20 font-semibold uppercase flex gap-2 items-center justify-center bg-gray-100 rounded-xl py-0.5 px-2">
          <img src="/icon/star.png" class="w-4 h-4" alt="">
          <span class="">{{ formatFloat(store.info.balance) }}</span>
        </div>
        <div class="w-20 font-semibold uppercase flex gap-2 items-center justify-center bg-gray-100 rounded-xl py-0.5 px-2">
          <img src="/icon/thunder.png" class="w-4 h-4" alt="">
          <span class="">1</span>
        </div>
      </div>
    </div>
    <div class="flex-1 p-4 gap-4 text-center flex items-center justify-center flex-col">
      <div class="border shadow-inner py-2 p-4 rounded-xl font-semibold">Stay focus</div>
      <tgs-player
          autoplay
          loop
          mode="normal"
          speed="0.7"
          style="width: 180px; height: 180px;"
          src="https://data.chpic.su/stickers/b/blackduckanim/blackduckanim_003.tgs"
      />
      <div class="text-7xl font-bold flex gap-1 items-center" @click="randomAnimate">
        <div>05</div>
        <div>:</div>
        <div>12</div>
      </div>
      <div class="w-8 h-8 flex items-center bg-gray-100 rounded-xl py-0.5 px-2 relative">
        <img class="w-5 h-5" src="/icon/thunder.png" alt="">
        <span class="absolute text-xs -bottom-1 -right-1">x1</span>
      </div>
    </div>
    <div class="sticky bottom-0 left-0 right-0 px-4 py-8 bg-white flex justify-center" @click="store.claim()">
      <div class="inline-flex">
        <Button variant="secondary" size="lg" class="rounded-2xl h-12 w-full relative overflow-hidden">
          <div class="absolute top-0 bottom-0 left-0 bg-primary" :style="{width: `${store.percent}%`}"/>
          <div class="flex gap-1 items-center relative z-10 text-yellow-400 uppercase text-lg">
            <span>Claim</span>
            <img class="w-4 h-4" src="/icon/star.png" alt="">
            <span>2</span>
          </div>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
