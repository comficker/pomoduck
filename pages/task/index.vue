<script setup lang="ts">
import type {APIResponse, ITask} from "~/types";

const route = useRoute()
const [taskRes] = await Promise.all([
  useNativeFetch<APIResponse<ITask>>(`/tasks/`, {
    query: {
      project_id: route.params.id
    }
  })
])
const rewards = computed(() => {
  return {
    boost: 0,
    point: 0
  }
})
</script>

<template>
  <div class="sticky bg-white top-0 w-full">
    <div class="p-4 border-b pb-3">
      <div class="flex gap-4 items-center">
        <div class="w-16 h-16">
          <img class="w-full h-full" src="/icon/task.png" alt="">
        </div>
        <div>
          <div class="text-3xl font-bold">Tasks</div>
          <div class="mt-4 text-xs flex gap-4 items-center">
            <div class="text-xs uppercase font-semibold text-gray-500">Rewards:</div>
            <div class="flex gap-4">
              <div class="flex items-center gap-1"><span class="font-bold">{{rewards.boost}}</span><img class="w-4 h-4" src="/icon/thunder.png" alt=""></div>
              <div class="flex items-center gap-1"><span class="font-bold">{{rewards.point}}</span><img class="w-4 h-4" src="/icon/star.png" alt=""></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="p-4">
    <div v-if="taskRes.results.length === 0" class="p-3 py-1.5 text-sm bg-yellow-50 border border-yellow-100 rounded">
      <div>Don't have any task now!</div>
    </div>
    <Task v-for="item in taskRes.results" :key="item.id" :task="item"/>
  </div>
</template>

