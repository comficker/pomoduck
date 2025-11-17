<script setup lang="ts">
import type {APIResponse, IShopItem} from "~/types";
import {formatFloat} from "~/lib/utils";

const store = useGlobalStore()
const page = ref(1)

const query = computed(() => ({
  page_size: 20,
  page: page.value
}))

const {data} = useAuthFetch<APIResponse<IShopItem>>('/items/', {
  key: "house",
  query: query
})
useHead({
  title: "Duckhouse"
})
</script>

<template>
  <div class="px-4 py-2 md:py-4 label flex gap-4 items-center">
    <h1 class="flex-1">Duck house</h1>
    <div class="flex gap-2 items-center">
      <NuxtIcon filled name="footprint" class="size-4"/>
      <div>{{ formatFloat(store.info.footprint) }}</div>
    </div>
    <div class="flex  gap-2 items-center">
      <NuxtIcon filled name="eggs" class="size-4"/>
      <div>{{ formatFloat(store.info.egg) }}</div>
    </div>
  </div>
  <div
      class="grid grid-cols-3 md:grid-cols-4 divide-x divide-y [&>div:nth-child(3n)]:border-r-0 md:[&>div:nth-child(3n)]:border-r-1 md:[&>div:nth-child(4n)]:border-r-0 [&>div:last-child]:border-b [&>div:last-child]:border-r">
    <div v-for='item in data?.results' class="divide-y">
      <div class="pt-full relative">
        <div class="absolute inset-4 center">
          <img :alt="item.name" :src="`/${item.label}/${item.id_string}.svg`" class="size-32"/>
        </div>
        <div
            v-if="item.current_status.has_active"
            class="absolute top-0 right-0 bg-white border-b border-l rounded-bl-lg pb-1 px-3 leading-none label"
        >
          <span v-if="item.current_status.is_equipped">Equipped</span>
          <span v-else>Equip</span>
        </div>
      </div>
      <div class="flex justify-between py-1 p-3 label">
        <div class="text-2xs md:text-xs">{{ item.name }}: {{ item.current_status.own + (item.current_status.rent ? 1 : 0) }}</div>
        <div class="flex gap-1">
          <nuxt-link :to="`/shop/${item.id_string}`">
            <NuxtIcon name="storefront" class="size-4"/>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
