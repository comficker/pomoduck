<script setup lang="ts">
const tasks = [
  {name: "PomoDuck in telegram name", d: 1, a: 8, s: 1},
  {name: "PomoDuck in X name", d: 7, a: Math.round(8 * 7 * 0.8), s: 1},
  {name: "Invite 3 friends", d: 30, a: Math.round(8 * 30 * 0.7), s: 1},
  {name: "Invite 10 friends", d: 30, a: Math.round(8 * 30 * 0.7), s: 1},
]

const store = useGlobalStore()

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
  <div class="p-4 flex flex-col relative gap-8">
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
