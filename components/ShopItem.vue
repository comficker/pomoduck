<script setup lang="ts">
import {toast} from "vue-sonner";
import type {IShopItem} from "~/types";
import {cloneDeep, formatFloat, timeLeftStr, timeSinceStr} from "~/lib/utils";

const {item, mode} = defineProps<{
  item: IShopItem,
  mode: string
}>()

const cloneItem = ref<IShopItem>(cloneDeep(item))

const buy = async () => {
  const data = await useNativeFetch<IShopItem>(`/items/${cloneItem.value.id}/buy`, {
    method: "POST",
  }).catch((e) => {
    toast.error("Something went wrong!", {
      description: e.data.code,
    })
    return null
  })
  if (data) {
    cloneItem.value = data
  }
}

const rent = async () => {
  const data = await useNativeFetch<IShopItem>(`/items/${cloneItem.value.id}/rent`, {
    method: "POST",
  }).catch((e) => {
    toast.error("Something went wrong!", {
      description: e.data.code,
    })
    return null
  })
  if (data) {
    cloneItem.value = data
  }
}

function formatDate(str: string) {
  const date = new Date(str)
  return `${date.toLocaleDateString()}:${date.toLocaleTimeString()}`
}

function comingSoon() {
  toast("Coming Soon")
}

const isRenting = computed(() => {
  if (cloneItem.value.current_status.rent) {
    const date = new Date(cloneItem.value.current_status.rent)
    const now = new Date()
    return now.getTime() < date.getTime()
  }
  return false
})
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
              <span>{{ formatFloat(cloneItem.price) }}</span>
              <NuxtIcon name="footprint" filled class="size-4"/>
            </div>
            <div class="ml-auto flex items-center gap-1">
              <NuxtIcon name="storefront" class="size-4"/>
              <span>{{ cloneItem.for_sale_count }}</span>
            </div>
          </div>
          <div class="text-xs flex gap-1">
            <div>Rent:</div>
            <div class="flex items-center gap-1">
              <span>{{ formatFloat(cloneItem.base_rent_fee) }}</span>
              <NuxtIcon name="footprint" filled class="size-4"/>
              <span>per day</span>
            </div>
            <div class="ml-auto flex items-center gap-1">
              <NuxtIcon name="storefront" class="size-4"/>
              <span>{{ cloneItem.for_rent_count }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="text-xs flex gap-1">
            <div>Holding:</div>
            <div class="flex items-center gap-1">
              <span>{{ cloneItem.current_status.own }}</span>
            </div>
          </div>
          <div v-if="cloneItem.current_status.rent" class="text-xs flex gap-1">
            <div>Rent expired:</div>
            <div class="flex items-center gap-1">
              <span>{{ formatDate(cloneItem.current_status.rent) }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-3" v-if="mode === 'shop'">
      <Button
          :disabled="!cloneItem.current_status.can_buy" class="text-xs" size="sm"
          @click="buy"
      >Buy
      </Button>
      <Button
          :disabled="!cloneItem.current_status.can_rent" class="text-xs" size="sm" variant="secondary"
          @click="rent"
      >
        <span>{{ isRenting ? 'Extend' : 'Rent' }}</span>
      </Button>
    </div>
    <div class="grid grid-cols-3 gap-3" v-if="mode === 'inventory'">
      <Button
          :disabled="true" class="text-xs" size="sm"
          @click="comingSoon"
      >Equip
      </Button>
      <Button
          :disabled="true" class="text-xs" size="sm" variant="secondary"
          @click="comingSoon"
      >Lease
      </Button>
      <Button
          :disabled="true" class="text-xs" size="sm" variant="secondary"
          @click="comingSoon"
      >Sale
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
