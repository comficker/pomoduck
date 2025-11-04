<script setup lang="ts">
import {toast} from "vue-sonner";

const route = useRoute()
const store = useGlobalStore()

const coming = () => {
  toast.info("Coming Soon!")
}

useHead({
  title: "Shop"
})
</script>

<template>
  <div class="px-4 space-y-2">
    <div class="label">Shop</div>
    <div class="grid grid-cols-3 gap-3">
      <div
          v-for='i in ["cap", "headphone", "knife", "spear"]'
          class="border rounded"
      >
        <div class="pt-full relative">
          <div class="absolute inset-4 center">
            <NuxtIcon filled :name="`item/${i}`" class="size-32"/>
          </div>
        </div>
        <div class="p-3 pt-0 space-y-1">
          <div class="font-semibold text-sm capitalize">{{i}}</div>
          <div class="text-xs flex justify-between">
            <div>Buy</div>
            <div class="flex items-center">
              <span>10,000</span>
              <img src="/icon/thunder.png" class="size-4" alt="">
            </div>
          </div>
          <div class="text-xs flex justify-between">
            <div>Rent</div>
            <div class="flex items-center">
              <span>100</span>
              <img src="/icon/thunder.png" class="size-4" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
