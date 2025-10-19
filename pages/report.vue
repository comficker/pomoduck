<script setup lang="ts">
import ReportChart from "~/components/report/Chart.vue";
import {formatFloat, timeLeftStr} from "~/lib/utils";
const store = useGlobalStore()
const {data} = useAuthFetch<{
  "history": { [key: string]: {point: number, duration: number} },
  "total": number,
  "avg": number
}>('/reports')

useHead({
  title: "Reports"
})
</script>

<template>
  <div v-if="data" class="w-full h-full px-4 relative space-y-4">
    <div class="grid grid-cols-3 gap-2 md:gap-3 uppercase">
      <div class="bg-white rounded border border-gray-200/50 py-1 p-2 md:p-4">
        <div class="num text-3xl font-bold">{{ timeLeftStr(data.total * 60 * 60, false) }}</div>
        <div class="text-2xs">Focus time</div>
      </div>
      <div class="bg-white rounded border border-gray-200/50 py-1 p-2 md:p-4">
        <div class="num text-3xl font-bold">{{ timeLeftStr(data.avg * 60 * 60, false) }}</div>
        <div class="text-2xs">per/day</div>
      </div>
      <div class="bg-white rounded border border-gray-200/50 py-1 p-2 md:p-4">
        <div class="num text-3xl font-bold">{{ store.info.day_streak }}</div>
        <div class="text-2xs">Day streak</div>
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
