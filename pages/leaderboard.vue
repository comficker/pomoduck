<script setup lang="ts">
import type {Account, APIResponse} from "~/types";
import {getRandomInt, shortAddress, timeLeftStr} from "~/lib/utils";

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
  <div class="w-full px-4 flex flex-col relative gap-2">
    <div class="flex gap-4 label">
      <div
          v-for="item in modes"
          class="cursor-pointer" :class="{'text-black': item == mode}"
          @click="mode=item"
      >
        <span>{{ item }}</span>
      </div>
    </div>
    <div v-if="pending" class="flex-1 divide-y divide-dashed text-sm">
      <div v-for="i in 20" class="py-1 flex">
        <div class="w-8">{{ i}}</div>
        <div class="flex-1">
          <div class="h-4 bg-gray-200 animate-pulse" :style="{width: `${getRandomInt(30, 70)}%`}"/>
        </div>
        <div class="flex justify-end w-32">
          <div class="h-4 bg-gray-200" :style="{width: `${getRandomInt(20, 40)}%`}"/>
        </div>
      </div>
    </div>
    <div v-if="!pending && mate && mate.results.length" class="flex-1 divide-y divide-dashed text-sm">
      <div v-for="(item, i) in mate.results" :key="item.id" class="py-1 font-semibold flex">
        <div class="w-8">{{ i + 1}}</div>
        <div class="flex-1">{{ shortAddress(item.username || `${item.first_name} ${item.last_name}`, 16) }}</div>
        <div class="flex items-center gap-1 content">
          <span>{{ timeLeftStr(item.total_focus) }}</span>
        </div>
      </div>
    </div>
    <div v-if="!pending && mode === 'Friends'" class="bg-white rounded p-4 space-y-3 sticky bottom-0">
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
  </div>
</template>
