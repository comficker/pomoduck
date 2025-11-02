<script setup lang="ts">
import {formatFloat} from "~/lib/utils";
import {toast} from "vue-sonner";

const options = [
  {name: "24h", d: 1, a: 8},
  {name: "7 days", d: 7, a: Math.round(8 * 7 * 0.8), s: 20},
  {name: "30 days", d: 30, a: Math.round(8 * 30 * 0.7), s: 30}
]

const tasks = [
  {name: "PomoDuck in telegram name", d: 1, a: 8, s: 1},
  {name: "PomoDuck in X name", d: 7, a: Math.round(8 * 7 * 0.8), s: 1},
  {name: "Invite 3 friends", d: 30, a: Math.round(8 * 30 * 0.7), s: 1},
  {name: "Invite 10 friends", d: 30, a: Math.round(8 * 30 * 0.7), s: 1},
]

const store = useGlobalStore()
const router = useRouter()

const selected = ref(0)
const boostState = computed(() => {
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


const boost = () => {
  const s = options[selected.value]
  if (!store.loggedIn) {
    store.modalName = 'auth'
    return
  }
  if (store.info.boost_balance < s.a) {
    toast.error("Something went wrong!", {
      description: "Balance is not enough!",
      action: {
        label: 'Get!',
        onClick: () => router.push('/balance?type=Boost&action=purchase'),
      }
    })
    return
  }
  useNativeFetch<{ "boost_balance": number, "boost_end": string }>('/boost', {
    method: "POST",
    body: {
      days: s.d
    }
  }).then(r => {
    store.updateBoost(r)
    toast.error("Double Boost Activated!", {
      description: "Focus and earn now!",
      action: {
        label: 'Go!',
        onClick: () => router.push('/'),
      }
    })
  }).catch(e => {
    toast("Something went wrong!", {
      description: "Boost error, try again!",
    })
  })
}
</script>

<template>
  <div class="w-full px-4 flex flex-col relative gap-8">
    <div class="text-xl space-y-6">
      <div class="space-y-6 text-center">
        <div class="flex justify-center">
          <div class="w-28 h-28">
            <img class="w-full" src="/thunder.png" alt="">
          </div>
        </div>
        <div class="label">Currently</div>
        <div class="text-7xl font-bold">
          <span>🥚</span><span class="text-3xl">x{{ (store.info.egg_extra + 1) & boostState.level }}</span>
        </div>
        <div class="label" v-if="boostState.end">until
          {{ boostState.end.toLocaleDateString() }} :
          {{ boostState.end.toLocaleTimeString() }}
        </div>
      </div>
      <div class="space-y-3">
        <div class="divide-y divide-dashed">
          <div v-for="(option, index) in tasks" class="flex items-center gap-2 py-1" :class="{'text-gray-400': false }">
            <span>{{ option.name }}</span>
            <div v-if="option.s" class="ml-auto">
              <div class="relative">
                <span>🥚</span>
              </div>
            </div>
            <NuxtIcon class="size-6" :name="false ? 'checked': 'load'"/>
          </div>
        </div>
      </div>
      <div class="space-y-3">
        <div class="content font-light text-base" v-if="boostState.end">Extend the time:</div>
        <div class="content font-light text-base" v-else>Way to go earn double your power:</div>
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
              <span class="n text-base">{{ formatFloat(option.a, 0) }}</span>
              <img src="/icon/thunder.png" class="size-5" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="sticky bg-neutral-100 bottom-0 pb-4 inset-x-0 space-y-3">
      <Button class="w-full h-12 text-lg items-center gap-0" size="lg" @click="boost">
        <span v-if="store.loggedIn">{{boostState.end ? 'Extend': 'Double'}} now</span>
        <span v-else>Login Required</span>
      </Button>
      <div v-if="store.loggedIn" class="flex justify-center items-center">
        <span>Available:</span>
        <span class="num ml-2">{{ store.info.boost_balance }}</span>
        <img src="/icon/thunder.png" class="size-5 mr-2" alt="">
        <nuxt-link class="underline" to="/balance?type=Boost&action=purchase">Get</nuxt-link>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
