<script setup lang="ts">
import {Share1Icon, CopyIcon} from "@radix-icons/vue";
import type {Account, APIResponse} from "~/types";
import {copyContent, formatFloat} from "~/lib/utils";
import WebApp from "@twa-dev/sdk";

const store = useGlobalStore()
const isCopied = ref(false)
const modes = ["Leaderboard", "Friends"]
const mode = ref('Leaderboard')
const url = computed(() => `t.me/Pomoduck_bot?start=${store.info.tg_id}`)

const query = computed(() => ({inviter: mode.value === 'Friends' ? store.info.id : undefined}))

const {data: mate} = useAuthFetch<APIResponse<Account>>('/accounts/', {
  query: query,
  watch: [query]
})

const copy = () => {
  copyContent(url.value)
  isCopied.value = true
}

const share = () => {
  WebApp.openTelegramLink(`https://t.me/share/url?url=https://${url.value}&text=Focus to earn with me!`)
}
</script>

<template>
  <div class="w-full h-full p-4 py-0 md:py-4 md:pt-8 flex flex-col relative gap-4">
    <div class="space-y-1">
      <div class="flex gap-2 text-3xl text-gray-400">
        <div
            v-for="item in modes"
            class="font-bold flex gap-2 duration-200" :class="{'text-black': item == mode}"
            @click="mode=item"
        >
          <span>{{ item }}</span>
        </div>
      </div>
    </div>
    <div v-if="mode === 'Friends'" class="space-y-3">
      <div class="border rounded-xl p-3 flex items-center gap-2">
        <input disabled :value="url" type="text" class="text-sm text-gray-600 flex-1 outline-none">
        <div class="cursor-pointer" @click="copy" :class="{'text-green-600': isCopied}">
          <CopyIcon class="w-4 h-4"/>
        </div>
        <div class="cursor-pointer" @click="share">
          <Share1Icon class="w-4 h-4"/>
        </div>
      </div>
      <div class="flex-1 flex items-center justify-center">
        <Button class="gap-2 h-12 rounded-xl w-full" @click="share">
          <NuxtIcon name="mate" class="w-6 h-6"/>
          <span>Invite</span>
        </Button>
      </div>
      <div class="text-sm">
        Earn 10% from your mates and 2% from their referrals
      </div>
    </div>
    <div v-if="mate" class="flex-1 pb-20 divide-y divide-dashed">
      <div v-for="item in mate.results" :key="item.id" class="py-2 flex justify-between">
        <div class="font-bold">{{ item.username || `${item.first_name} ${item.last_name}` }}</div>
        <div class="flex items-center gap-1">
          <span>{{ formatFloat(item.balance, 2, 2) }}</span>
          <img class="w-4 h-4" src="/icon/star.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
