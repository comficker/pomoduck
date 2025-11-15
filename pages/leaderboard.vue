<script setup lang="ts">
import type {Account, APIResponse} from "~/types";
import {formatFloat, getRandomInt, shortAddress, timeLeftStr} from "~/lib/utils";

const store = useGlobalStore()
const authStore = useAuthStore()
const config = useRuntimeConfig()

const modes = ["Leaderboard", "Friends"]
const mode = ref('Leaderboard')

const url = computed(() => {
  if (authStore.activeAuth === 'telegram') {
    return `https://t.me/Pomoduck_bot?start=${store.info.id}`
  } else {
    return `${config.public.appURL}?ref=${store.info.id}`
  }
})

const query = computed(() => ({
  inviter: mode.value === 'Friends' ? store.info.id : undefined,
  page_size: 20,
}))

const {data: mate, pending} = useAuthFetch<APIResponse<Account>>('/accounts/', {
  query: query,
  watch: [query]
})

useHead({
  title: "Leaderboard"
})
</script>

<template>
  <div class="px-4 py-2 md:py-4 flex gap-4 label text-secondary">
    <h1
        v-for="item in modes"
        class="cursor-pointer" :class="{'text-primary': item == mode}"
        @click="mode=item"
    >
      <span>{{ item }}</span>
    </h1>
  </div>
  <div v-if="pending" class="flex-1 divide-y">
    <div v-for="i in 20" class="flex border-b">
      <div class="p-2 w-10 text-center">{{ i}}</div>
      <div class="p-2 flex-1">
        <div class="h-6 bg-secondary animate-pulse" :style="{width: `${getRandomInt(30, 70)}%`}"/>
      </div>
      <div class="p-2 flex justify-end w-32">
        <div class="h-4 bg-secondary" :style="{width: `${getRandomInt(20, 40)}%`}"/>
      </div>
    </div>
  </div>
  <div v-if="!pending && mate && mate.results.length" class="flex-1 md:text-base text-sm divide-y">
    <div v-for="(item, i) in mate.results" :key="item.id" class="font-semibold flex items-center border-b">
      <div class="p-2 w-10 text-center">{{ i + 1}}</div>
      <div class="p-2 flex-1">{{ shortAddress(item.username || `${item.first_name} ${item.last_name}`, 16) }}</div>
      <div class="p-2 w-1/2 text-xs grid grid-cols-3 gap-1">
        <div>🕒 {{ timeLeftStr(item.total_focus, true).hours }}H</div>
        <div class="flex gap-1 items-center justify-end">
          <span>{{ formatFloat(item.egg) }}</span>
          <NuxtIcon name="egg" filled class="size-3"/>
        </div>
        <div class="flex gap-1 items-center justify-end">
          <span>{{ formatFloat(item.footprint) }}</span>
          <NuxtIcon name="footprint" filled class="size-3"/>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!pending && mode === 'Friends'" class="p-4 space-y-3 sticky bottom-0">
    <div class="relative">
      <div class="flex items-center gap-4">
        <input
            disabled :value="url" type="text"
            class="text-sm !py-2 text-gray-600 flex-1 outline-none"
            :class="{'blur-sm': !store.loggedIn}"
        >
        <Copy v-if="store.loggedIn" :value="url"/>
      </div>
      <div v-if="!store.loggedIn" class="absolute inset-0 flex items-center justify-center">
        <div class="label underline cursor-pointer" @click="store.modalName = 'auth'">Login to get your link</div>
      </div>
    </div>
    <div class="flex-1 flex items-center justify-center">
      <Share :url="url" title="Focus to earn with me!"/>
    </div>
    <div class="text-sm text-center">Earn 10% from your mates and 2% from their referrals</div>
  </div>
</template>
