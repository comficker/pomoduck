<script setup lang="ts">
import type {APIResponse, ITask} from "~/types";
import {TASK_STATUS} from "~/lib/constants";
import {getRandomInt} from "~/lib/utils";

const store = useGlobalStore()

const status = ref(TASK_STATUS.ACTIVE)
const taskFilter = ref<string>('Public')

const query = computed(() => {
  return {
    page_size: 50,
    creator_id: taskFilter.value === 'Your' ? store.info.id : undefined,
    status: status.value
  }
})
const {data: taskRes, refresh, pending} = useAuthFetch<APIResponse<ITask>>(`/tasks/`, {
  method: "GET",
  query: query,
  watch: [query]
})

const isActiveSticky = ref(false)

const createTask = () => {
  useNativeFetch<ITask>('/tasks/', {
    method: "POST",
    body: {}
  }).then((res) => {
    if (res) {
      taskRes.value?.results.unshift(res)
    }
  })
}

const checkSticky = () => {
  isActiveSticky.value = false
}

watch(() => [taskRes, store.taskFilter, store.loggedIn], () => checkSticky(), {
  deep: true,
})

watch(() => store.refreshTask, () => refresh())

onMounted(() => {
  checkSticky()
})
</script>

<template>
  <div class="px-4 space-y-2">
    <div class="label">Tasks</div>
    <div v-if="store.loggedIn" class="flex label justify-between">
      <div class="flex gap-2">
        <div
            v-for="item in ['Public', 'Your']"
            class="cursor-pointer"
            :class="{'text-blue-500': taskFilter === item}"
            @click="taskFilter = item"
        >{{item}}</div>
      </div>
      <div class="flex gap-2">
        <div
            v-for="item in [[1, 'Available'], [2, 'Completed']]"
            class="cursor-pointer"
            :class="{'text-blue-500': item[0] === status}"
            @click="status = item[0]"
        >{{ item[1] }}
        </div>
      </div>
    </div>
    <div class="space-y-1 -mx-2">
      <div v-if="taskRes?.results.length === 0" class="p-3 py-1.5 text-sm">
        <div v-if="store.loggedIn" class="text-center">Don't have any task now!</div>
        <div v-else class="text-center">You must login to work!</div>
      </div>
      <template v-if="pending">
        <div v-for="i in 5" class="task p-2 space-y-2">
          <div class="h-4 bg-gray-200 animate-pulse" :style="{width: `${getRandomInt(30, 70)}%`}"/>
          <div class="h-4 bg-gray-200 animate-pulse" :style="{width: `${getRandomInt(20, 50)}%`}"/>
        </div>
      </template>
      <template v-else-if="taskRes">
        <Task
            v-for="(item, i) in taskRes.results"
            :key="`${store.refreshTask}_${item.id}`"
            :task="item"
            @update:task="taskRes.results[i] = $event"
            @deleted="taskRes?.results.splice(i, 1)"
        />
      </template>
      <div
          v-show="store.loggedIn && taskFilter == 'Your' && status == TASK_STATUS.ACTIVE"
          class="sticky bottom-0 py-2 flex justify-center"
          :class="{active: isActiveSticky}"
      >
        <Button variant="link" class="gap-2" @click="createTask">
          <NuxtIcon name="plus" class="w-5 h-5"/>
          <div>Add your task</div>
        </Button>
      </div>
    </div>
  </div>
</template>
