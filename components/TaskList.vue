<script setup lang="ts">
import type {APIResponse, ITask} from "~/types";
import {TASK_STATUS} from "~/lib/constants";

const store = useGlobalStore()

const status = ref(TASK_STATUS.ACTIVE)

const query = computed(() => {
  return {
    page_size: 50,
    creator_id: store.taskFilter == 'private' ? store.info.id : undefined,
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
  <div class="task-list">
    <div class="h-full p-3 pt-0 pb-14 md:pb-0 md:pt-14">
      <div v-if="taskRes" class="w-full h-full relative">
        <div class="parent absolute inset-0 overflow-auto no-scroll">
          <div class="child space-y-1">
            <div v-if="store.taskFilter == 'private'" class="flex capitalize gap-3 py-2 label sticky top-0 bg-white">
              <div
                  v-for="item in [[1, 'Available'], [2, 'Completed']]"
                  class="cursor-pointer" :class="{'text-blue-500': item[0] === status}"
                  @click="status = item[0]"
              >{{ item[1] }}
              </div>
            </div>
            <div v-if="taskRes.results.length === 0" class="p-3 py-1.5 text-sm">
              <div class="text-center">Don't have any task now!</div>
            </div>
            <Task
                v-for="(item, i) in taskRes.results"
                :key="`${store.refreshTask}_${item.id}`"
                :task="item"
                @update:task="taskRes.results[i] = $event"
                @deleted="taskRes.results.splice(i, 1)"
            />
            <div
                v-show="store.loggedIn && store.taskFilter == 'private' && status == TASK_STATUS.ACTIVE"
                class="sticky bottom-0 pt-2 bg-white flex justify-center"
                :class="{active: isActiveSticky}"
            >
              <Button variant="link" class="gap-2" @click="createTask">
                <NuxtIcon name="plus" class="w-5 h-5"/>
                <div>Add your task</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
