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
        <div class="text-7xl flex items-end justify-center font-bold">
          <NuxtIcon filled name="egg" class="size-16"/><span class="text-3xl">x{{ (store.info.egg_extra + 1) & boostState.level }}</span>
        </div>
      </div>
      <div class="space-y-3">
        <div class="divide-y divide-dashed">
          <div v-for="(option, index) in tasks" class="flex items-center gap-2 py-1" :class="{'text-gray-400': false }">
            <span>{{ option.name }}</span>
            <div class="flex items-center gap-1 ml-auto">
              <span>+1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
