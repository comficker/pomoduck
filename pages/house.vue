<script setup lang="ts">
import type {APIResponse, IShopItem} from "~/types";
import {formatFloat} from "../lib/utils";

const store = useGlobalStore()
const page = ref(1)

const query = computed(() => ({
  page_size: 12,
  page: page.value
}))

const {data, pending} = useAuthFetch<APIResponse<IShopItem>>('/items/', {
  key: "house",
  query: query
})

const changePage = (isNext = true) => {
  if (isNext) {
    if (page.value === data.value?.num_pages) {
      page.value = 1
    } else {
      page.value++
    }
  } else {
    if (page.value == 1) {
      page.value = data.value?.num_pages || 0
    } else {
      page.value--
    }
  }
}
useHead({
  title: "Duckhouse"
})
</script>

<template>
  <div class="px-4 py-2 md:py-4 label">
    <h1>Duck house</h1>
  </div>
  <div class="p-4 space-y-2">
    <div class="space-y-1 font-bold">
      <div class="flex gap-2 items-center">
        <NuxtIcon filled name="footprint" class="size-4"/>
        <div>{{ formatFloat(store.info.footprint) }}</div>
      </div>
      <div class="flex gap-2 items-center">
        <NuxtIcon filled name="eggs" class="size-4"/>
        <div>{{ formatFloat(store.info.egg) }}</div>
      </div>
    </div>
  </div>
  <div class="flex gap-3 justify-between items-center px-4 label">
    <div>Inventory</div>
    <div class="flex items-center justify-between">
      <div class="flex gap-2 items-center">
        <div class="cursor-pointer p-2" @click="changePage(false)">
          <nuxt-icon name="chevron-left" class="size-5"/>
        </div>
        <div class="size-4 w-16 text-center">{{ page }}/{{ data?.num_pages }}</div>
        <div class="cursor-pointer p-2" @click="changePage(true)">
          <nuxt-icon name="chevron-right" class="size-5"/>
        </div>
      </div>
    </div>
  </div>
  <div
      class="grid grid-cols-3 md:grid-cols-4 divide-x divide-y md:[&>div:nth-child(4n)]:border-r-0 [&>div:last-child]:border-b [&>div:last-child]:border-r">
    <div v-for='item in data?.results' class="divide-y">
      <div class="pt-full relative">
        <div class="absolute inset-4 center">
          <img :alt="item.name" :src="`/${item.label}/${item.id_string}.svg`" class="size-32"/>
        </div>
        <div v-if="item.current_status.has_active"
             class="absolute top-0 right-0 bg-white border-b border-l rounded-bl-lg pb-1 px-3 leading-none label">
          <span v-if="item.current_status.is_equipped">Equipped</span>
          <span v-else>Equip</span>
        </div>
      </div>
      <div class="flex justify-between py-1 p-3 label">
        <div>{{ item.name }}: {{ item.current_status.own + (item.current_status.rent ? 1 : 0) }}</div>
        <div class="flex gap-1">
          <nuxt-link :to="`/shop/${item.id_string}`">
            <NuxtIcon name="storefront" class="size-4"/>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
