<script setup lang="ts">
import type {IShopItem} from "~/types";
import { formatFloat } from "~/lib/utils";

const {item} = defineProps<{
  item: IShopItem
}>()
</script>

<template>
  <div
      class="border rounded p-3 px-4 bg-white"
  >
    <div class="flex items-center gap-4">
      <div class="size-16 md:size-24">
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
        <div class="text-xs flex gap-1">
          <div>Buy:</div>
          <div class="flex items-center gap-1">
            <span>{{ formatFloat(item.price) }}</span>
            <NuxtIcon name="footprint" filled class="size-4"/>
          </div>
          <div class="ml-auto flex items-center gap-1">
            <NuxtIcon name="storefront" class="size-4"/>
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
            <NuxtIcon name="storefront" class="size-4"/>
            <span>{{ item.for_rent_count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
