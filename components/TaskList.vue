<script setup lang="ts">
import type {APIResponse, ITask} from "~/types";

const store = useGlobalStore()

const {data: taskRes, refresh, pending} = useAuthFetch<APIResponse<ITask>>(`/tasks/`, {
  method: "GET",
  query: {
    page_size: 50
  }
})
const isActiveSticky = ref(false)

const createTask = () => {
  useNativeFetch<ITask>('/tasks/', {
    method: "POST",
    body: {

    }
  }).then((res) => {
    if (res) {
      taskRes.value?.results.unshift(res)
    }
  })
}

const checkSticky = () => {
  const parent = document.querySelector('.parent')
  const child = document.querySelector('.child')
  if (parent && child) {
    isActiveSticky.value = parent.scrollHeight != child.scrollHeight
  }
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
      <div v-if="!pending && taskRes" class="w-full h-full relative">
        <div class="parent absolute inset-0 overflow-auto no-scroll">
          <div class="child space-y-1">
            <div v-if="taskRes.results.length === 0" class="p-3 py-1.5 text-sm">
              <div class="text-center">Don't have any task now!</div>
            </div>
            <Task
                v-for="(item, i) in taskRes.results.filter(x => store.taskFilter === 'my' ? !!x.creator : !x.creator)"
                :key="`${store.refreshTask}_${item.id}`" :task="item"
                @update:task="taskRes.results[i] = $event"
            />
            <div
              v-show="store.loggedIn && store.taskFilter == 'my'"
              class="sticky shadow-lg bottom-0 bg-white flex justify-center"
              :class="{active: isActiveSticky}"
            >
              <Button variant="link" class="gap-2" @click="createTask">
                <NuxtIcon name="plus" class="w-5 h-5"/>
                <div>Add task</div>
              </Button>
            </div>
          </div>
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


.sticky {
  transition: .1s;
}

.sticky.active {
  box-shadow: 0 7px 7px 5px;
}
</style>

