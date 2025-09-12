<script setup lang="ts">
import type {Account, APIResponse} from "~/types";
import {formatFloat} from "~/lib/utils";

const store = useGlobalStore()
const authStore = useAuthStore()
const config = useRuntimeConfig()

const modes = ["Leaderboard", "Friends"]
const mode = ref('Leaderboard')

const url = computed(() => {
  if (authStore.activeAuth === 'telegram') {
    return `t.me/Pomoduck_bot?start=${store.info.id}`
  } else {
    return `${config.public.appURL}?ref=${store.info.id}`
  }
})

const query = computed(() => ({
  inviter: mode.value === 'Friends' ? store.info.id : undefined,
  page_size: 20,
}))

const {data: mate} = useAuthFetch<APIResponse<Account>>('/accounts/', {
  query: query,
  watch: [query]
})
</script>

<template>
  <div class="w-full p-4 flex flex-col relative gap-2">
    <div class="tabs">
      <div
          v-for="item in modes"
          class="tab" :class="{'text-black': item == mode}"
          @click="mode=item"
      >
        <span>{{ item }}</span>
      </div>
    </div>
    <div v-if="mate" class="flex-1 divide-y divide-dashed">
      <div v-for="item in mate.results" :key="item.id" class="py-1 flex justify-between">
        <div class="font-bold">{{ item.username || `${item.first_name} ${item.last_name}` }}</div>
        <div class="flex items-center gap-1">
          <span>{{ formatFloat(item.balance, 2, 2) }}</span>
          <img class="w-4 h-4" src="/icon/star.png" alt="">
        </div>
      </div>
    </div>
    <div class="bg-white pt-4 space-y-3 sticky bottom-4">
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
