<script setup lang="ts">
import type {APIResponse, IShopItem} from "~/types";
import {formatFloat, getRandomInt} from "~/lib/utils";

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
  <div class="p-4 py-2 gap-4 label flex items-center">
    <h1 class="cursor-pointer text-primary flex-1">Shop</h1>
    <div class="flex gap-2 items-center">
      <NuxtIcon filled name="footprint" class="size-4"/>
      <div>{{ formatFloat(store.info.footprint) }}</div>
    </div>
    <Button as-child>
      <nuxt-link to="/purchase" class="uppercase rounded-lg px-4">Purchase</nuxt-link>
    </Button>
  </div>
  <div class="grid md:grid-cols-2 md:divide-x divide-y md:[&>div:nth-child(2n)]:border-r-0 [&>div:last-child]:border-b [&>div:last-child]:border-r">
    <template v-if="data && !pending">
      <div v-for='item in data.results' :key="item.id" class="p-4 py-3 shop-item">
        <ShopItem :item="item"/>
      </div>
    </template>
    <template v-else>
      <div v-for='item in 12' :key="item" class="p-4 py-3 shop-item">
        <div class="flex items-center gap-4">
          <div class="size-16 bg-secondary animate-pulse"/>
          <div class="flex-1 space-y-1">
            <div class="h-4 bg-secondary animate-pulse" :style="{width: `${getRandomInt(30, 70)}%`}"/>
            <div class="h-3 bg-secondary animate-pulse" :style="{width: `${getRandomInt(20, 50)}%`}"/>
            <div class="h-3 bg-secondary animate-pulse" :style="{width: `${getRandomInt(20, 50)}%`}"/>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
