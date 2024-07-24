<script setup lang="ts">
import type {APIResponse, Project, ITask} from "~/types";
import {ArrowDown, FlameIcon, NewspaperIcon} from "lucide-vue-next";

const route = useRoute()
const [project, taskRes] = await Promise.all([
  useNativeFetch<Project>(`/projects/${route.params.id}/`, {}),
  useNativeFetch<APIResponse<ITask>>(`/tasks/`, {
    query: {
      project_id: route.params.id
    }
  })
])
const rewards = computed(() => 0)
</script>

<template>
  <div v-if="project" class="sticky bg-white top-0 w-full">
    <div class="p-4 border-b pb-3">
      <div class="flex gap-4 items-center">
        <div class="w-16 h-16">
          <img
              v-if="project.media"
              class="rounded"
              :src="project.media"
              :alt="project.name"
          >
        </div>
        <div>
          <div class="text-3xl">{{ project.name }}</div>
          <div class="mt-2 text-xs flex gap-4 items-center">
            <a class="flex items-center border rounded p-1 px-2 gap-1 shadow-sm" target="_blank" :href="`https://t.me/${project.tg_username}`">
              <img class="w-4 h-4" src="/icon/telegram.svg" alt="">
              <span class="text-2xs uppercase font-bold">Run app</span>
            </a>
            <div>
              <img class="w-4 h-4" src="/icon/link.svg" alt="">
            </div>
            <div>
              <img class="w-4 h-4" src="/icon/x.svg" alt="">
            </div>

          </div>
        </div>
      </div>
      <div class="mt-4 text-xs flex gap-4 items-center">
        <div class="text-xs uppercase font-semibold text-gray-500">Rewards:</div>
        <div class="flex gap-3">
          <div><span class="font-bold">{{ rewards }}</span> <span class="major-mono">DG</span></div>
        </div>
      </div>
    </div>
  </div>
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

