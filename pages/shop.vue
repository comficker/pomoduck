<script setup lang="ts">
import type {APIResponse, IShopItem} from "~/types";

const mode = ref('shop')

useHead({
  title: "Shop"
})

const {data, pending} = useAuthFetch<APIResponse<IShopItem>>('/items/')
</script>

<template>
  <div class="px-4 space-y-2">
    <div class="flex gap-4 label">
      <div
          v-for="i in ['shop', 'inventory']"
          class="cursor-pointer"
          :class="{'text-black': i == mode}"
          @click="mode = i"
      >{{ i }}
      </div>
    </div>
    <div class="grid grid-cols-1 gap-3">
      <template v-if="data && !pending">
        <ShopItem
            v-for='item in data.results'
            :key="item.id"
            :item="item"
            :mode="mode"
        />
      </template>
    </div>
  </div>
</template>
