<script setup lang="ts">
import ReportChart from "~/components/report/Chart.vue";
import {formatFloat, timeLeftStr} from "~/lib/utils";

const store = useGlobalStore()
const {data} = useAuthFetch<{
  "history": { [key: string]: { point: number, duration: number } },
  "total": number,
  "avg": number
}>('/reports')

const reformatOverview = computed(() => {
  if (data.value)
    return {
      total: timeLeftStr(data.value.total, true),
      avg: timeLeftStr(data.value.avg, true)
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
  <div v-if="data" class="border-b divide-x grid grid-cols-3 font-bold">
    <div class="p-4">
      <div class="text-2xs uppercase">Day streak</div>
      <div class="text-5xl">{{ store.info.day_streak }}</div>
    </div>
    <div class="p-4">
      <div class="text-2xs uppercase">Focus time</div>
      <div class="text-xl leading-none">
        <div>{{ reformatOverview.total.hours }}H</div>
        <div>{{ reformatOverview.total.minutes }}m</div>
      </div>
    </div>
    <div class="p-4">
      <div class="text-2xs uppercase">per/day</div>
      <div class="text-xl leading-none">
        <div>{{ reformatOverview.avg.hours }}H</div>
        <div>{{ reformatOverview.avg.minutes }}m</div>
      </div>
    </div>
  </div>
  <ReportChart v-if="data" class="border-b p-4" :data="data.history"/>
  <div v-if="data" class="divide-y">
    <div class="p-4 label">History</div>
    <div class="flex divide-x label">
      <div class="p-2 flex-1 px-4">Date</div>
      <div class="w-32 md:w-40 p-2 md:px-4">Time</div>
      <div class="w-20 md:w-24 p-2 px-4 text-right">Eggs</div>
    </div>
    <div class="flex divide-x text-xs md:text-base" v-for="key in Object.keys(data.history).reverse().slice(0, 30)">
      <div class="p-2 flex-1 px-4">🗓️ {{ key }}</div>
      <div class="w-32 md:w-40 p-2 md:px-4">🕒 {{ timeLeftStr(data.history[key].duration) }}</div>
      <div class="w-20 md:w-24 p-2 px-4 flex justify-end gap-1 items-center">
        <span>{{ formatFloat(data.history[key].point) }}</span>
        <NuxtIcon name="eggs" filled class="size-4"/>
      </div>
    </div>
  </div>
</template>
