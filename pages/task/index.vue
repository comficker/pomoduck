<script setup lang="ts">
import type {APIResponse, Project, ITask} from "~/types";
import {ArrowDown, FlameIcon, NewspaperIcon} from "lucide-vue-next";

const route = useRoute()
const [taskRes] = await Promise.all([
  useNativeFetch<APIResponse<ITask>>(`/tasks/`, {
    query: {
      project_id: route.params.id
    }
  })
])
const rewards = computed(() => 0)
</script>

<template>
  <div>
    <div v-if="taskRes.results.length === 0" class="mx-4 my-3 p-3 py-1.5 text-sm bg-yellow-50 border border-yellow-100 rounded">
      <div>Don't have any task now!</div>
    </div>
    <Task v-for="item in taskRes.results" :key="item.id" :task="item"/>
    <div class="bg-white px-4 py-2 absolute bottom-0 right-0 left-0">
      <Button size="lg" class="h-12 w-full gap-2">Claim {{ rewards }} <span class="major-mono">DG</span></Button>
    </div>
  </div>
</template>

