<script setup lang="ts">
const tasks = {
  egg: [
    "PomoDuck in telegram name",
    "PomoDuck in X name",
    "Invite 3 friends",
    "Invite 10 friends",
    "Invite 100 friends"
  ],
  footprint: [
    "Equip a skin",
    "Equip a head accessory",
    "Equip a neck accessory",
    "Equip a hand accessory",
    "Equip a foot accessory"
  ]
}

const store = useGlobalStore()
</script>

<template>
  <div class="flex-col center gap-4 py-12">
    <div class="w-28 h-28">
      <img class="w-full" src="/thunder.png" alt="">
    </div>
    <div class="text-5xl content font-bold">Boost</div>
  </div>
  <div class="grid md:grid-cols-2 md:divide-x text-sm md:text-xl divide-y md:divide-y-0">
    <div class="p-4 divide-y divide-dashed">
      <div class="py-4 flex gap-2 md:justify-end">
        <NuxtIcon v-for="i in 5" name="egg" class="size-10" filled/>
      </div>
      <div v-for="(option, index) in tasks.egg" class="py-1 flex gap-2 items-center md:justify-end md:text-right md:flex-row-reverse">
        <div class="size-5 border rounded"/>
        <span class="flex-1">{{ option }}</span>
      </div>
    </div>
    <div class="p-4 divide-y divide-dashed">
      <div class="py-4 flex gap-2">
        <NuxtIcon v-for="i in 5" name="footprint" class="size-10" filled/>
      </div>
      <div v-for="(option, index) in tasks.footprint" class="py-1 flex gap-2 items-center">
        <div class="size-5 border rounded"/>
        <span class="flex-1">{{ option }}</span>
      </div>
    </div>
  </div>
  <div></div>
</template>

<style scoped>

</style>
