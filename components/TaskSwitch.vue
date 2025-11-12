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
  <div class="max-w-sm mx-auto grid grid-cols-3 content text-left gap-2 text-sm">
    <template v-if="canAction">
      <div
          v-for="item in taskRes?.results" @click="onClick(item)"
          class="cursor-pointer border p-1 rounded flex justify-between items-end bg-white"
          :class="{'border-orange-500': store.info.doing?.id === item.id}"
      >
        <div class="space-y-1">
          <div class="text-sm">{{ item.tag === 'work' ? 'Focus' : item.name }}</div>
          <div class="flex">
            <NuxtIcon :name="item.tag" class="size-4 text-gray-300"/>
          </div>
        </div>
        <NuxtIcon v-for="i in item.reward_amount" :name="item.reward_type" filled class="size-3"/>
      </div>
    </template>
    <template v-else-if="store.info.doing">
      <div class=""/>
      <div class="cursor-pointer border p-1 rounded flex justify-between items-end border-transparent">
        <div class="space-y-1">
          <div class="text-sm">{{ store.info.doing.tag === 'work' ? 'Focus' : store.info.doing.name }}</div>
          <div class="flex">
            <NuxtIcon :name="store.info.doing.tag" class="size-4 text-gray-300"/>
          </div>
        </div>
        <NuxtIcon
            v-for="i in store.info.doing.reward_amount"
            :name="store.info.doing.reward_type" filled
            class="size-3"
        />
      </div>
      <div class=""/>
    </template>
  </div>
</template>
