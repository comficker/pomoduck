<script setup lang="ts">
import type {APIResponse, IShopItem} from "~/types";

useHead({
  title: "Shop"
})

const {data, pending} = useAuthFetch<APIResponse<IShopItem>>('/items/')
</script>

<template>
  <div class="px-4 py-2 md:py-4 label">
    <h1 class="cursor-pointer text-primary">Shop</h1>
  </div>
  <div class="grid md:grid-cols-2 md:divide-x divide-y" v-if="data && !pending">
    <div v-for='item in data.results' :key="item.id" class="p-4 shop-item">
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
