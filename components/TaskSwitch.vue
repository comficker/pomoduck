<script setup lang="ts">
import type {APIResponse, ITask} from "~/types";
const {$sendHaptic} = useNuxtApp()

const store = useGlobalStore()
const authStore = useAuthStore()
const {data: taskRes} = useAuthFetch<APIResponse<ITask>>(`/tasks/?page_size=50&status=1`, {
  method: "GET",
  key: 'index'
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
  <div class="max-w-xs mx-auto grid grid-cols-3 content text-left gap-2 text-sm">
    <template v-if="canAction">
      <div
          v-for="item in taskRes?.results" @click="onClick(item)"
          class="bg-white cursor-pointer border p-1 rounded flex justify-between items-end"
          :class="{'border-orange-500': store.info.doing?.id === item.id}"
      >
        <div class="space-y-1">
          <div class="text-2xs">{{ item.tag === 'work' ? 'Focus' : item.name }}</div>
          <div class="flex">
            <NuxtIcon :name="item.tag" class="size-3 text-gray-300"/>
          </div>
        </div>
        <NuxtIcon v-for="i in item.reward_amount" :name="item.reward_type" filled class="size-3"/>
      </div>
    </template>
    <template v-else-if="store.info.doing">
      <div class=""/>
      <div class="flex justify-between items-end border border-transparent">
        <div class="space-y-1">
          <div class="text-2xs">{{ store.info.doing.tag === 'work' ? 'Focus' : store.info.doing.name }}</div>
          <div class="flex">
            <NuxtIcon :name="store.info.doing.tag" class="size-3 text-gray-300"/>
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
