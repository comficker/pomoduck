<script setup lang="ts">
import {formatFloat} from "~/lib/utils";
import {toast} from "vue-sonner";

const options = [
  {name: "a day", d: 1, a: 8},
  {name: "7 days", d: 7, a: Math.round(8 * 7 * 0.8), s: 20},
  {name: "30 days", d: 30, a: Math.round(8 * 30 * 0.7), s: 30}
]

const store = useGlobalStore()
const router = useRouter()

const selected = ref(0)

const boost = () => {
  const s = options[selected.value]
  if (store.info.boost_balance < s.a) {
    toast.error("Something went wrong!", {
      description: "Balance is not enough!",
      action: {
        label: 'Get more!',
        onClick: () => router.push('/balance?type=Boost&action=purchase'),
      },
    })
    return
  }
  useNativeFetch<{ "boost_balance": number }>('/boost', {
    method: "POST",
    body: {
      days: s.d
    }
  }).then(r => {
    store.updateBoost(r)
  }).catch(e => {
    toast("Something went wrong!", {
      description: "Boost error!",
    })
  })
}
</script>

<template>
  <div class="w-full px-4 flex flex-col relative gap-8">
    <div class="text-xl space-y-3">
      <div class="text-5xl font-bold">Boost</div>
      <img class="w-1/2" src="/thunder.png" alt="">
      <div class="num text-7xl font-bold">X2</div>
      <div>Way to go earn double xp for the next:</div>
      <div class="divide-y divide-dashed">
        <div
            v-for="(option, index) in options" class="flex items-center gap-2 py-1"
            @click="selected = index"
        >
          <div class="size-5 border flex items-center justify-center rounded"
               :class="selected === index ? 'border-blue-500': 'border-gray-300'">
            <div v-if="selected === index" class="size-3 bg-blue-500 rounded-xs"/>
          </div>
          <span>{{ option.name }}</span>
          <div v-if="option.s" class="mt-2 text-green-400 flex text-xs num gap-0.5 items-center">
            <span>OFF</span>
            <span>{{ option.s }}%</span>
          </div>
          <div class="flex ml-auto items-center">
            <span class="n">{{ formatFloat(option.a, 0) }}</span>
            <img src="/icon/thunder.png" class="size-5" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="sticky bottom-4 inset-x-0 space-y-3">
      <Button class="w-full h-12 text-lg items-center gap-0.5" size="lg" @click="boost">
        <span>Boost with</span>
        <span class="n">{{ formatFloat(options[selected].a, 0) }}</span>
        <img src="/icon/thunder.png" class="size-5" alt="">
      </Button>
      <div class="flex justify-center items-center gap-2">
        <span>Available:</span>
        <span class="num">{{ store.info.boost_balance }}</span>
        <img src="/icon/thunder.png" class="size-5" alt="">
        <nuxt-link class="underline" to="/balance?type=Boost&action=purchase">Get</nuxt-link>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
