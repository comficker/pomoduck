<script setup lang="ts">
import {toast} from "vue-sonner";

const route = useRoute()
const store = useGlobalStore()

const coming = () => {
  toast.info("Coming Soon!")
}

useHead({
  title: "Duckhouse"
})
</script>

<template>
  <div class="p-4 label">
    <h1>Duck house</h1>
  </div>
  <div class="p-4 space-y-2">
    <div class="label">Inventory</div>
    <div class="space-y-1">
      <div class="flex gap-2 items-center">
        <NuxtIcon filled name="footprint" class="size-4"/>
        <div>Footprint:</div>
        <div>{{store.info.footprint}}</div>
      </div>
      <div class="flex gap-2 items-center">
        <NuxtIcon filled name="eggs" class="size-4"/>
        <div>Eggs:</div>
        <div>{{store.info.egg}}</div>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-3 md:grid-cols-4 divide-x divide-y md:[&>div:nth-child(4n)]:border-r-0 [&>div:last-child]:border-b [&>div:last-child]:border-r">
    <div
        v-for='i in ["common","uncommon", "rare", "epic", "legendary", "mythical", "", "", "", "", "", ""]'
    >
      <div class="pt-full relative">
        <div class="absolute inset-4 center">
          <NuxtIcon v-if="i" filled :name="`duck/${i}`" class="size-32"/>
        </div>
      </div>
      <div v-if="i" class="flex justify-between p-3 label">
        <div>{{ i }}</div>
        <div>0</div>
      </div>
    </div>
  </div>
</template>
