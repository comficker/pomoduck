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
  <div class="p-4">
    <div class="label">Duck house</div>
  </div>
  <div class="grid divide-x grid-cols-2 md:grid-cols-4">
    <div class="">
      <div class="pt-full relative">
        <div class="absolute inset-4 center">
          <NuxtIcon filled name="footprint" class="size-24"/>
        </div>
      </div>
      <div class="p-3 pt-0 space-y-2 relative z-10">
        <div class="flex justify-between label">
          <div>Footprint</div>
          <div>{{store.info.footprint}}</div>
        </div>
        <Button class="w-full" @click="coming">Purchase</Button>
      </div>
    </div>
    <div class="md:border-r">
      <div class="pt-full relative">
        <div class="absolute inset-4 center">
          <NuxtIcon filled name="eggs" class="size-24"/>
        </div>
      </div>
      <div class="p-3 pt-0 space-y-2 relative z-10">
        <div class="flex justify-between label">
          <div>Egg</div>
          <div>{{store.info.egg}}</div>
        </div>
        <Button class="w-full" @click="coming">Hatch</Button>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-3 md:grid-cols-4 divide-x divide-y">
    <div
        v-for='i in ["common","uncommon", "rare", "epic", "legendary", "mythical"]'
    >
      <div class="pt-full relative">
        <div class="absolute inset-4 center">
          <NuxtIcon filled :name="`duck/${i}`" class="size-32"/>
        </div>
      </div>
      <div class="flex justify-between p-3 label">
        <div>{{ i }}</div>
        <div>0</div>
      </div>
    </div>
  </div>
</template>
