<script setup lang="ts">
import type {Achievement, APIResponse} from "~/types";

const reward_guides: { [key: string]: { xp: number[], egg: number[], boost: number[] } } = {
  common: {
    xp: [1, 10],
    egg: [1, 10],
    boost: [1, 10]
  },
  rare: {
    xp: [10, 30],
    egg: [10, 30],
    boost: [10, 30]
  },
  epic: {
    xp: [30, 70],
    egg: [30, 70],
    boost: [30, 50]
  },
  legendary: {
    xp: [70, 100],
    egg: [70, 100],
    boost: [50, 100]
  }
}

const {data: response, pending} = useAuthFetch<APIResponse<Achievement>>(`/achievements/`, {
  method: "GET"
})
</script>

<template>
  <div class="w-full">
    <div class="label px-4 mb-2">Achievements</div>
    <div class="text-xs pb-8 px-1 space-y-2">
      <div v-for="item in response?.results" class="flex items-center bg-white" :class="{'grayscale': !item.claimed}">
        <div class="size-20">
          <NuxtIcon :name="`medal/${item.id_string}`" filled/>
        </div>
        <div class="flex-1">
          <div class="text-lg font-bold">{{ item.name }}</div>
          <div>{{ item.description }}</div>
          <div v-if="reward_guides[item.rarity]" class="mt-1 flex gap-2 text-xs num">
            <div>{{ item.claimed ? 'Claimed' : 'Reward' }}:</div>
            <div class="flex items-center">
              <div>🥚</div>
              <div v-if="item.claimed">{{ item.claimed.egg }}</div>
              <div v-else>{{ reward_guides[item.rarity].egg[0] }} ~ {{ reward_guides[item.rarity].egg[1] }}</div>
            </div>
            <div class="flex items-center">
              <img src="/icon/thunder.png" class="size-4" alt="">
              <div v-if="item.claimed">{{ item.claimed.boost }}</div>
              <div v-else>{{ reward_guides[item.rarity].boost[0] }} ~ {{ reward_guides[item.rarity].boost[1] }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
