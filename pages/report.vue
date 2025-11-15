<script setup lang="ts">
import ReportChart from "~/components/report/Chart.vue";
import {formatFloat, timeLeftStr} from "~/lib/utils";

const store = useGlobalStore()
const {data} = useAuthFetch<{
  [key: string]: { egg: number, break: number, footprint: number, work: number }
}>('/reports')

function getDaysBetweenDates(d1: Date, d2: Date) {
  const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in a day
  const diffInTime = d2.getTime() - d1.getTime(); // Difference in milliseconds
  return Math.round(diffInTime / oneDay);
}

const reformatOverview = computed(() => {
  if (store.loggedIn && store.info) {
    const now = new Date()
    const joined = new Date(store.info.joined)
    const d = getDaysBetweenDates(joined, now)
    return {
      total: timeLeftStr(store.info.total_focus, true),
      avg: timeLeftStr(store.info.total_focus / d, true)
    }
  }
  return {
    total: {
      hours: 0,
      minutes: 0,
    },
    avg: {
      hours: 0,
      minutes: 0,
    }
  }
})

useHead({
  title: "Reports"
})
</script>

<template>
  <div v-if="store.loggedIn" class="border-b divide-x grid grid-cols-3 font-bold">
    <div class="p-4">
      <div class="text-2xs text-secondary uppercase">Day streak</div>
      <div class="text-5xl">{{ store.info.day_streak }}</div>
    </div>
    <div class="p-4">
      <div class="text-2xs text-secondary uppercase">Focus time</div>
      <div class="text-xl leading-none">
        <div>{{ reformatOverview.total.hours }}H</div>
        <div>{{ reformatOverview.total.minutes }}m</div>
      </div>
    </div>
    <div class="p-4">
      <div class="text-2xs text-secondary uppercase">per/day</div>
      <div class="text-xl leading-none">
        <div>{{ reformatOverview.avg.hours }}H</div>
        <div>{{ reformatOverview.avg.minutes }}m</div>
      </div>
    </div>
  </div>
  <ReportChart v-if="data" class="border-b p-4" :data="data"/>
  <div v-if="data" class="divide-y">
    <div class="p-4 py-2 label">History</div>
    <div class="grid grid-cols-3 divide-x label text-secondary">
      <div class="p-2 flex-1 px-4">Date</div>
      <div class="p-2 md:px-4">Time</div>
      <div class="p-2 px-4 text-right">Rewards</div>
    </div>
    <div class="grid grid-cols-3 divide-x text-xs md:text-base" v-for="key in Object.keys(data).reverse().slice(0, 30)">
      <div class="p-2 flex-1 px-4">🗓️ {{ key }}</div>
      <div class="p-2 md:px-4">🕒 {{ timeLeftStr(data[key].work) }}</div>
      <div class="p-2 px-4 grid grid-cols-2">
        <div class="flex gap-1 items-center">
          <NuxtIcon name="egg" filled class="size-3"/>
          <span>{{ formatFloat(data[key].egg) }}</span>
        </div>
        <div class="flex gap-1 items-center">
          <NuxtIcon name="footprint" filled class="size-3"/>
          <span>{{ formatFloat(data[key].footprint) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
