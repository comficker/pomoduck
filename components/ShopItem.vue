<script setup lang="ts">
import {toast} from "vue-sonner";
import type {IShopItem} from "~/types";
import {formatFloat} from "~/lib/utils";

const {item, mode} = defineProps<{
  item: IShopItem,
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
        <NuxtIcon filled :name="`item/${item.id_string}`"/>
      </div>
      <div class="flex-1 space-y-1">
        <div class="flex justify-between">
          <div class="font-semibold capitalize">{{ item.name }}</div>
          <div class="flex text-xs gap-1 items-center">
            <span>+1</span>
            <NuxtIcon name="egg" filled class="size-3"/>
          </div>
        </div>
        <template v-if="mode === 'shop'">
          <div class="text-xs flex gap-1">
            <div>Buy:</div>
            <div class="flex items-center gap-1">
              <span>{{ formatFloat(item.price) }}</span>
              <NuxtIcon name="footprint" filled class="size-4"/>
            </div>
            <div class="ml-auto flex items-center gap-1">
              <NuxtIcon name="storefront" class="size-3"/>
              <span>{{ item.for_sale_count }}</span>
            </div>
          </div>
          <div class="text-xs flex gap-1">
            <div>Rent:</div>
            <div class="flex items-center gap-1">
              <span>{{ formatFloat(item.base_rent_fee) }}</span>
              <NuxtIcon name="footprint" filled class="size-4"/>
              <span>per day</span>
            </div>
            <div class="ml-auto flex items-center gap-1">
              <NuxtIcon name="storefront" class="size-3"/>
              <span>{{ item.for_rent_count }}</span>
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
