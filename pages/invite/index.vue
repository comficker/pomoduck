<script setup lang="ts">
import {Share1Icon, CopyIcon} from "@radix-icons/vue";
import type {Account, APIResponse} from "~/types";
import {copyContent} from "~/lib/utils";
import WebApp from "@twa-dev/sdk";

const store = useGlobalStore()
const isCopied = ref(false)
const url = computed(() => `t.me/Pomoduck_bot?start=${store.info.tg_id}`)

const claim = () => {
  if (store.info.meta?.commission) {
    store.claimCommission()
  }
}

const mate = await useNativeFetch<APIResponse<Account>>('/accounts/', {
  query: {
    inviter_id: store.info.id
  }
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
  <div class="w-full h-full space-y-4 p-4 flex flex-col relative">
    <div class="flex justify-between items-center text-xl">
      <div class="font-semibold uppercase flex gap-2">
        <span>Friends</span>
        <span class="text-gray-400">{{ mate.results.length }}</span>
      </div>
      <Button
          :variant="store.info.meta?.commission ? 'default': 'secondary'" size="xs"
          class="text-base rounded-xl px-3 gap-2"
          @click="claim"
      >
        <span>Claim</span>
        <span class="text-green-500">{{ store.info.meta?.commission || 0 }}</span>
        <img class="w-4 h-4" src="/icon/star.png" alt="">
      </Button>
    </div>
    <div class="text-sm">
      Earn 10% from your mates and 2% from their referrals
    </div>
    <div v-if="!mate || mate.count === 0" class="flex-1 flex items-center justify-center">
      <Button size="lg" variant="secondary" class="h-12 gap-2 text-xl" @click="share">
        <NuxtIcon name="mate" class="w-6 h-6"/>
        <span>Invite</span>
      </Button>
    </div>
    <div v-else class="flex-1 pb-16 divide-y divide-dashed">
      <div v-for="item in mate.results" :key="item.id" class="py-2 flex justify-between">
        <div class="font-bold">{{item.username || `${item.first_name} ${item.last_name}`}}</div>
        <div class="flex items-center gap-1">
          <img class="w-4 h-4" src="/icon/star.png" alt="">
          <span>{{ (item.balance || 0) * 0.1 }}</span>
        </div>
      </div>
    </div>
    <div class="sticky bottom-0 -left-0 -right-0 py-3 px-0 bg-white">
      <div class="border p-3 flex items-center gap-2">
        <input
          :value="url" type="text"
          class="text-sm text-gray-600 flex-1 outline-none"
        >
        <div class="cursor-pointer" @click="copy" :class="{'text-green-600': isCopied}">
          <CopyIcon class="w-4 h-4"/>
        </div>
        <div class="cursor-pointer" @click="share">
          <Share1Icon class="w-4 h-4"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
