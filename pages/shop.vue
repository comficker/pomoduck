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
   <div class="flex gap-4 label">
     <div class="cursor-pointer">Shop</div>
     <div class="cursor-pointer">Inventory</div>
   </div>
    <div class="grid grid-cols-1 gap-3">
      <div
          v-for='i in ["cap", "headphone", "knife", "spear"]'
          class="border rounded p-3"
      >
        <div class="flex items-center">
          <div class="size-24">
            <NuxtIcon filled :name="`item/${i}`"/>
          </div>
          <div class="flex-1 space-y-1">
            <div class="font-semibold capitalize">{{i}}</div>
            <div class="text-xs flex gap-1">
              <div>Buy:</div>
              <div class="flex items-center">
                <span>10,000</span>
                <img src="/icon/thunder.png" class="size-4" alt="">
              </div>
              <div class="ml-auto flex items-center gap-1">
                <NuxtIcon name="storefront" class="size-3"/>
                <span>0</span>
              </div>
            </div>
            <div class="text-xs flex gap-1">
              <div>Rent:</div>
              <div class="flex items-center">
                <span>100</span>
                <img src="/icon/thunder.png" class="size-4" alt="">
              </div>
              <div class="ml-auto flex items-center gap-1">
                <NuxtIcon name="storefront" class="size-3"/>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <Button disabled class="text-xs" size="sm">Buy</Button>
          <Button disabled class="text-xs" size="sm" variant="secondary">Rent</Button>
        </div>
      </div>
    </div>
  </div>
</template>
