<script setup lang="ts">
import type {Info} from "~/types";
import {shortAddress} from "~/lib/utils";
import {toast} from "vue-sonner";

const store = useGlobalStore()
const config = useRuntimeConfig()

const token = ref(store.modalData?.token || null)
const found = ref<Info | null>(null)

const merge = () => {
  useNativeFetch('/account/merge', {
    method: 'POST',
    body: {
      merge_token: token.value
    }
  }).then(() => {
    store.modalName = null
    store.modalData = null
    store.loadInfo()
  }).catch(() => {
    toast("Something went wrong!", {
      description: "Merge error!"
    })
  })
}

onMounted(() => {
  if (token.value) {
    $fetch<Info>("/hi", {
      baseURL: <string>config.public.api + "/" + <string>config.public.apiVersion,
      headers: {
        "Content-Type": 'application/json',
        "Accept": 'application/json; indent=2',
        "Authorization": `Bearer ${token.value}`
      }
    }).then((res) => {
      found.value = res
    })
  }
})
</script>

<template>
  <div class="space-y-4">
    <div class="text-xl num">Found account</div>
    <div v-if="found" class="border p-4 space-y-1 rounded num text-sm">
      <div class="text-base">{{ shortAddress(found.username) }} - {{ found.first_name }} {{ found.last_name }}</div>
      <div class="flex gap-1 items-center">
        <NuxtIcon name="subdirectory" class="size-3"/>
        <div>ID:</div>
        <div>{{ found.id }}</div>
      </div>
      <div class="flex gap-1 items-center">
        <NuxtIcon name="subdirectory" class="size-3"/>
        <div>Boost:</div>
        <div>{{ found.boost_balance }}</div>
      </div>
      <div class="flex gap-1 items-center">
        <NuxtIcon name="subdirectory" class="size-3"/>
        <div>Balance:</div>
        <div>{{ found.balance }}</div>
      </div>
    </div>
    <Button class="w-full h-12" @click="merge">Merge</Button>
  </div>
</template>

<style scoped>

</style>
