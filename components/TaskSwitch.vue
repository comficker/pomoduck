<script setup lang="ts">
import type {APIResponse, ITask} from "~/types";
const {$sendHaptic} = useNuxtApp()

const store = useGlobalStore()
const {data: taskRes} = useAuthFetch<APIResponse<ITask>>(`/tasks/?page_size=50&status=1`, {
  method: "GET",
  key: 'index',
  query: {
    page_size: 3,
    status: 1,
    type: "default"
  }
})

const canAction = computed(() => {
  return store.percent == 0 && !store.isRunning
})

const onClick = (task: ITask) => {
  if (!taskRes.value || !canAction.value) return;
  $sendHaptic()
  task.account_task = []
  store.info.doing = task
}
</script>

<template>
  <div class="border md:border-x-0 md:rounded-none rounded-lg w-full divide-x mx-auto grid grid-cols-3 content text-left text-sm overflow-hidden">
    <div v-for="item in taskRes?.results.sort((a, b) => b.duration_est - a.duration_est)" class="">
      <div
          @click="onClick(item)"
          class="cursor-pointer flex justify-between items-end p-2 py-1 md:p-4"
          :class="{
            'opacity-20': !canAction && store.info.doing?.id !== item.id,
            'animate-pulse': !canAction && store.info.doing?.id === item.id,
            'text-yellow-500': canAction && store.info.doing?.id === item.id
          }"
      >
        <div class="space-y-1">
          <div class="text-xs md:text-sm uppercase">{{ item.tag === 'work' ? 'Focus' : item.name }}</div>
          <div class="flex">
            <NuxtIcon :name="item.tag" class="size-4 md:size-6"/>
          </div>
        </div>
        <NuxtIcon v-for="i in item.reward_amount" :name="item.reward_type" filled class="size-3"/>
      </div>
    </div>
  </div>
</template>
