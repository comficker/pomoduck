<script setup lang="ts">
import type {IShopItem} from "~/types";
import {toast} from "vue-sonner";

const route = useRoute()
const {data: cloneItem} = useAuthFetch<IShopItem>(`/items/${route.params.id}/`)

const buy = async () => {
  if (!cloneItem.value) return;
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
  if (!cloneItem.value) return;
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
  if (!cloneItem.value) return false;
  if (cloneItem.value.current_status.rent) {
    const date = new Date(cloneItem.value.current_status.rent)
    const now = new Date()
    return now.getTime() < date.getTime()
  }
  return false
})
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
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
  <div class="grid grid-cols-3 gap-3">
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
</template>
