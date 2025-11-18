<script setup lang="ts">
import ReportChart from "~/components/report/Chart.vue";
import {formatFloat, timeLeftStr} from "~/lib/utils";

const store = useGlobalStore()
const {data} = useAuthFetch<{
  [key: string]: { egg: number, break: number, footprint: number, work: number }
}>('/reports')

const dates = computed(() => {
  const dates = Object.keys(data.value || {})
  return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
})

function getDaysBetweenDates(d1: Date, d2: Date) {
  const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in a day
  const diffInTime = d2.getTime() - d1.getTime(); // Difference in milliseconds
  return Math.round(diffInTime / oneDay);
}

const reformatOverview = computed(() => {
  const total = Object.values(data.value || {}).reduce((sum, item) => sum + (item.work || 0), 0);
  return {
    total: timeLeftStr(total, true),
    avg: timeLeftStr(total / 90, true)
  }
})

useHead({
  title: "Reports"
})
</script>

<template>
  <div class="border-b divide-x grid grid-cols-3 font-bold">
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
  <div v-if="data" class="divide-y border-b">
    <div class="p-4 py-2 label">History</div>
    <div class="grid grid-cols-3 divide-x label text-xs text-secondary">
      <div class="p-2 py-1 flex-1 px-4">Date</div>
      <div class="p-2 py-1 md:px-4">Time</div>
      <div class="p-2 py-1 px-4 text-right">Rewards</div>
    </div>
    <div class="grid grid-cols-3 divide-x text-xs md:text-base" v-for="key in dates">
      <div class="p-2 py-1 flex-1 px-4">🗓️ {{ key.substring(5, key.length) }}</div>
      <div class="p-2 py-1 md:px-4">🕒 {{ timeLeftStr(data[key]?.work || 0) }}</div>
      <div class="p-2 py-1 px-4 grid grid-cols-2">
        <div class="flex gap-1 items-center justify-end">
          <span>{{ formatFloat(data[key]?.egg) }}</span>
          <NuxtIcon name="egg" filled class="size-3"/>
        </div>
        <div class="flex gap-1 items-center justify-end">
          <span>{{ formatFloat(data[key]?.footprint) }}</span>
          <NuxtIcon name="footprint" filled class="size-3"/>
        </div>
      </div>
    </div>
  </div>
</template>
