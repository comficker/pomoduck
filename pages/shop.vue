<script setup lang="ts">
const mode = ref('shop')

useHead({
  title: "Shop"
})
</script>

<template>
  <div class="px-4 space-y-2">
    <div class="flex gap-4 label">
      <div
          v-for="i in ['shop', 'inventory']"
          class="cursor-pointer"
          :class="{'text-black': i == mode}"
          @click="mode = i"
      >{{ i }}</div>
    </div>
    <div class="grid grid-cols-1 gap-3">
      <ShopItem
          v-for='i in ["cap", "headphone", "knife", "spear"]'
          :item="{id: i}"
          :mode="mode"
      />
    </div>
  </div>
</template>
