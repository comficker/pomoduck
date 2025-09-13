<script setup lang="ts">
import ReportChart from "~/components/report/Chart.vue";
</script>

<template>
  <div class="w-full h-full p-4 relative space-y-6">
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-gray-100 rounded border border-gray-200/50 p-4">
        <div class="num text-3xl font-bold">12</div>
        <div class="text-sm">Focus hours</div>
      </div>
      <div class="bg-gray-100 rounded border border-gray-200/50 p-4">
        <div class="num text-3xl font-bold">3h/d</div>
        <div class="text-sm">AVG</div>
      </div>
      <div class="bg-gray-100 rounded border border-gray-200/50 p-4">
        <div class="num text-3xl font-bold">7</div>
        <div class="text-sm">Day streak</div>
      </div>
    </div>
    <ReportChart/>
    <div class="space-y-2 text-sm">
      <div class="label">History</div>
      <div v-for="i in 10">🗓️ 2/9 focus 4 hours and got 321 points</div>
    </div>
  </div>
</template>

<style scoped>

</style>
