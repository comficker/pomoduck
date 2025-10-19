<script setup lang="ts">
import ReportChart from "~/components/report/Chart.vue";
import {formatFloat, timeLeftStr} from "~/lib/utils";

const store = useGlobalStore()
const {data} = useAuthFetch<{
  "history": { [key: string]: { point: number, duration: number } },
  "total": number,
  "avg": number
}>('/reports')

const reformatOverview = computed<{
  total: { hours: number, minutes: number },
  avg: { hours: number, minutes: number }
}>(() => {
  if (data.value)
    return {
      total: timeLeftStr(data.value.total * 60 * 60, true),
      avg: timeLeftStr(data.value.avg * 60 * 60, true)
    }
  return {
    total: "0",
    avg: "0",
  }
})

useHead({
  title: "Reports"
})
</script>

<template>
  <div v-if="data" class="w-full h-full px-4 relative space-y-4">
    <div class="grid grid-cols-3 gap-2 md:gap-3 font-bold">
      <div class="bg-white rounded border border-gray-200/50 py-1 p-2 md:p-4">
        <div class="text-2xs uppercase">Day streak</div>
        <div class="num text-5xl">{{ store.info.day_streak }}</div>
      </div>
      <div class="bg-white rounded border border-gray-200/50 py-1 p-2 md:p-4">
        <div class="text-2xs uppercase">Focus time</div>
        <div class="num text-xl leading-none">
          <div>{{ reformatOverview.total.hours }}H</div>
          <div>{{ reformatOverview.total.minutes }}m</div>
        </div>
      </div>
      <div class="bg-white rounded border border-gray-200/50 py-1 p-2 md:p-4">
        <div class="text-2xs uppercase">per/day</div>
        <div class="num text-xl leading-none">
          <div>{{ reformatOverview.avg.hours }}H</div>
          <div>{{ reformatOverview.avg.minutes }}m</div>
        </div>
      </div>
    </div>
    <ReportChart :data="data.history"/>
    <div class="text-sm divide-y divide-dashed">
      <div class="label pb-1">History</div>
      <div class="py-1 grid grid-cols-3 label">
        <div>Date</div>
        <div>Time [Minutes]</div>
        <div class="text-right">Rewards</div>
      </div>
      <div v-for="key in Object.keys(data.history).reverse().slice(0, 7)" class="py-1 grid grid-cols-3 num">
        <div class="">🗓️ {{ key }}</div>
        <div>🕒 {{ timeLeftStr(data.history[key].duration) }}</div>
        <div class="text-right">{{ formatFloat(data.history[key].point) }} ⬆️</div>
      </div>
    </div>
  </div>
</template>
