<script setup lang="ts">
import type {APIResponse, ITask} from "~/types";

const [taskRes] = await Promise.all([
  useNativeFetch<APIResponse<ITask>>(`/tasks/`, {})
])
</script>

<template>
  <div class="task-list">
    <div class="p-3 pt-0 pb-12 md:pb-3 md:pt-12">
      <div v-if="taskRes.results.length === 0" class="p-3 py-1.5 text-sm bg-yellow-50 border border-yellow-100 rounded">
        <div class="text-center">Don't have any task now!</div>
      </div>
      <Task v-for="item in taskRes.results" :key="item.id" :task="item"/>
    </div>
  </div>
</template>

<style>
.task-list {
  @apply bg-white duration-300 opacity-0 overflow-hidden shadow border;

  border-radius: 24px;
  padding: 1.15rem 0;
  height: 0;
}

.task-list.active {
  @apply -my-4 md:mb-0 mt-0 md:-mt-3 opacity-100 py-3;

  height: calc(50vh);
}
</style>

