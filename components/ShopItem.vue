<script setup lang="ts">
import {toast} from "vue-sonner";

const {item, mode} = defineProps<{
  item: {
    id: string
  },
  mode: string
}>()

const coming = () => {
  toast.info("Coming Soon!")
}
</script>

<template>
  <div
      class="border rounded p-3"
  >
    <div class="flex items-center">
      <div class="size-24">
        <NuxtIcon filled :name="`item/${item.id}`"/>
      </div>
      <div class="flex-1 space-y-1">
        <div class="font-semibold capitalize">{{ item.id }}</div>
        <template v-if="mode === 'shop'">
          <div class="text-xs flex gap-1">
            <div>Buy:</div>
            <div class="flex items-center gap-1">
              <span>10,000</span>
              <NuxtIcon name="footprint" filled class="size-4"/>
            </div>
            <div class="ml-auto flex items-center gap-1">
              <NuxtIcon name="storefront" class="size-3"/>
              <span>0</span>
            </div>
          </div>
          <div class="text-xs flex gap-1">
            <div>Rent:</div>
            <div class="flex items-center gap-1">
              <span>100</span>
              <NuxtIcon name="footprint" filled class="size-4"/>
              <span>per day</span>
            </div>
            <div class="ml-auto flex items-center gap-1">
              <NuxtIcon name="storefront" class="size-3"/>
              <span>0</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <template v-if="mode === 'shop'">
        <Button disabled class="text-xs" size="sm">Buy</Button>
        <Button disabled class="text-xs" size="sm" variant="secondary">Rent</Button>
      </template>
      <template v-if="mode === 'inventory'">
        <Button disabled class="text-xs" size="sm">Equip</Button>
        <Button disabled class="text-xs" size="sm" variant="secondary">Lease</Button>
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>
