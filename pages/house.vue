<script setup lang="ts">
import type {APIResponse, IShopItem} from "~/types";
import {formatFloat} from "~/lib/utils";

const store = useGlobalStore()
const page = ref(1)

const query = computed(() => ({
  page_size: 20,
  page: page.value,
  labels: "skin,accessory"
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
  <div class="p-4 py-3 label flex gap-4 items-center">
    <h1 class="flex-1">House</h1>
    <div class="flex gap-2 items-center">
      <NuxtIcon filled name="footprint" class="size-4"/>
      <div>{{ formatFloat(store.info.footprint) }}</div>
    </div>
    <div class="flex gap-2 items-center">
      <NuxtIcon filled name="eggs" class="size-4"/>
      <div>{{ formatFloat(store.info.egg) }}</div>
    </div>
    <Button as-child size="sm">
      <nuxt-link to="/nest">Open</nuxt-link>
    </Button>
  </div>
  <div
      class="grid grid-cols-3 md:grid-cols-4 divide-x divide-y [&>div:nth-child(3n)]:border-r-0 md:[&>div:nth-child(3n)]:border-r-1 md:[&>div:nth-child(4n)]:border-r-0 [&>div:last-child]:border-b [&>div:last-child]:border-r">
    <div v-for='item in data?.results' class="divide-y">
      <div class="pt-full relative" :class="{'grayscale': !item.current_status.has_active}">
        <div class="absolute inset-4 center">
          <img :alt="item.name" :src="`/${item.label}/${item.id_string}.svg`" class="size-32"/>
        </div>
        <div
            v-if="item.current_status.is_equipped"
            class="absolute top-0 right-0 bg-white border-b border-l rounded-bl-lg pb-1 px-3 leading-none label text-xs"
        >
          <span>Equipped</span>
        </div>
      </div>
      <nuxt-link :to="`/shop/${item.id_string}`" class="flex justify-between py-1 p-2 label">
        <div class="text-2xs md:text-xs">{{ item.name }}: {{ item.current_status.own + (item.current_status.rent ? 1 : 0) }}</div>
      </nuxt-link>
    </div>
  </div>
</template>
