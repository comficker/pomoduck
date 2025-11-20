<script setup lang="ts">
import type {APIResponse, IShopItem} from "~/types";
import {formatFloat} from "~/lib/utils";

const store = useGlobalStore()

useHead({
  title: "Shop"
})

const {data, pending} = useAuthFetch<APIResponse<IShopItem>>('/items/', {
  query: {
    label: "accessory",
    page_size: 20
  },
  key: "shop"
})
</script>

<template>
  <div class="p-4 py-3 gap-4 label flex items-center">
    <h1 class="cursor-pointer text-primary flex-1">Shop</h1>
    <div class="flex gap-2 items-center">
      <NuxtIcon filled name="footprint" class="size-4"/>
      <div>{{ formatFloat(store.info.footprint) }}</div>
    </div>
    <Button as-child>
      <nuxt-link to="/shop/purchase" class="uppercase text-xs px-6">Buy</nuxt-link>
    </Button>
  </div>
  <div class="grid md:grid-cols-2 md:divide-x divide-y" v-if="data && !pending">
    <div v-for='item in data.results' :key="item.id" class="p-4 py-3 shop-item">
      <ShopItem :item="item"/>
    </div>
  </div>
</template>

<style>
.shop-item:last-child {
  @apply border-b;
}

.shop-item:nth-child(even) {
  @apply border-r-0;
}
</style>
