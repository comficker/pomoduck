<script setup lang="ts">
import type {APIResponse, ITask} from "~/types";

const store = useGlobalStore()

const {data: taskRes} = useAuthFetch<APIResponse<ITask>>(`/tasks/`, {
  method: "GET",
  query: {
    page_size: 50
  }
})
</script>

<template>
  <div class="task-list">
    <div class="h-full p-3 pt-0 pb-14 md:pb-3 md:pt-14">
      <div v-if="taskRes" class="w-full h-full relative">
        <div class="absolute inset-0 overflow-auto no-scroll">
          <div v-if="taskRes.results.length === 0" class="p-3 py-1.5 text-sm">
            <div class="text-center">Don't have any task now!</div>
          </div>
          <Task
              v-for="item in taskRes.results.filter(x => store.taskFilter === 'my' ? !!x.creator : !x.creator)"
              :key="item.id" :task="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.task-list {
  @apply bg-white duration-300 opacity-0 overflow-hidden shadow border;

  border-radius: 24px;
  padding: 1.45rem 0;
  height: 0;
}

.task-list.active {
  @apply -my-4 md:mb-0 mt-0 md:-mt-3 opacity-100 py-3;

  height: calc(50vh);
}
</style>

