<script setup lang="ts">
import ReportChart from "~/components/report/Chart.vue";
import {formatFloat} from "~/lib/utils";

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
  <div v-if="data" class="w-full h-full p-4 relative space-y-6">
    <div class="grid grid-cols-3 gap-2 md:gap-4">
      <div class="bg-gray-100 rounded border border-gray-200/50 p-2 md:p-4">
        <div class="num text-3xl font-bold">{{ formatFloat(data.total, 0, 2) }}</div>
        <div class="text-sm">Focus hours</div>
      </div>
      <div class="bg-gray-100 rounded border border-gray-200/50 p-2 md:p-4">
        <div class="num text-3xl font-bold">{{ formatFloat(data.avg, 0, 2) }}</div>
        <div class="text-sm">Hours/day</div>
      </div>
      <div class="bg-gray-100 rounded border border-gray-200/50 p-2 md:p-4">
        <div class="num text-3xl font-bold">7</div>
        <div class="text-sm">Day streak</div>
      </div>
    </div>
    <ReportChart :data="data.history"/>
    <div class="space-y-2 text-sm">
      <div class="label">History</div>
      <div v-for="key in Object.keys(data.history).reverse()">🗓️ <span class="">[{{ key }}]</span> [{{ formatFloat(data.history[key].duration / 60) }} minutes]
        got {{ formatFloat(data.history[key].point) }} points
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
