<script setup lang="ts">
import type {Achievement, APIResponse} from "~/types";
import {getRandomInt} from "~/lib/utils";

const reward_guides: { [key: string]: { xp: number[], egg: number[], footprint: number[] } } = {
  common: {
    xp: [1, 10],
    egg: [1, 10],
    footprint: [1, 5]
  },
  rare: {
    xp: [10, 30],
    egg: [10, 30],
    footprint: [5, 10]
  },
  epic: {
    xp: [30, 70],
    egg: [30, 70],
    footprint: [10, 20]
  },
  legendary: {
    xp: [70, 100],
    egg: [70, 100],
    footprint: [20, 50]
  }
}

const {data: response, pending} = useAuthFetch<APIResponse<Achievement>>(`/achievements/`, {
  method: "GET"
})

useHead({
  title: "Achievement"
})
</script>

<template>
  <div class="p-4 label">
    <h1>Achievements</h1>
  </div>
  <div class="text-xs divide-y border-b">
    <template v-if="pending">
      <div v-for="i in 8" class="flex items-center divide-x has-star">
        <div class="p-2 has-star">
          <div class="size-20 bg-gray-200"/>
        </div>
        <div class="flex-1 space-y-2 p-4">
          <div class="h-4 bg-secondary animate-pulse" :style="{width: `${getRandomInt(30, 70)}%`}"/>
          <div class="h-3 bg-secondary animate-pulse" :style="{width: `${getRandomInt(20, 50)}%`}"/>
          <div class="h-3 bg-secondary animate-pulse" :style="{width: `${getRandomInt(20, 50)}%`}"/>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-for="item in response?.results" class="flex items-center divide-x has-star" :class="{'grayscale': !item.claimed}">
        <div class="size-20 has-star">
          <NuxtIcon :name="`medal/${item.id_string}`" filled/>
        </div>
        <div class="flex-1 px-4">
          <div class="text-base font-semibold">{{ item.name }}</div>
          <div>{{ item.description }}</div>
          <div v-if="reward_guides[item.rarity]" class="mt-1 flex gap-2 ">
            <div>{{ item.claimed ? 'Claimed' : 'Reward' }}:</div>
            <div class="flex items-center gap-1">
              <NuxtIcon filled name="egg" class="size-4"/>
              <div v-if="item.claimed">{{ item.claimed.egg }}</div>
              <div v-else>{{ reward_guides[item.rarity].egg[0] }} ~ {{ reward_guides[item.rarity].egg[1] }}</div>
            </div>
            <div class="flex items-center gap-1">
              <NuxtIcon name="footprint" filled class="size-4"/>
              <div v-if="item.claimed">{{ item.claimed.footprint }}</div>
              <div v-else>{{ reward_guides[item.rarity].footprint[0] }} ~ {{ reward_guides[item.rarity].footprint[1] }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
