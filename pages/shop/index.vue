<script setup lang="ts">
import type {APIResponse, IShopItem} from "~/types";

useHead({
  title: "Shop"
})

const {data, pending} = useAuthFetch<APIResponse<IShopItem>>('/items/')
</script>

<template>
  <div class="px-4 space-y-2">
    <div class="flex gap-4 label">
      <div class="cursor-pointer text-black">Shop</div>
    </div>
    <div class="grid grid-cols-1 gap-2">
      <template v-if="data && !pending">
        <ShopItem v-for='item in data.results' :key="item.id" :item="item"/>
      </template>
    </div>
  </div>
</template>
