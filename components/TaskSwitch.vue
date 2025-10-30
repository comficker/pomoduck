<script setup lang="ts">
import type {ITask} from "~/types";
import {sendHaptic} from "~/lib/utils";

const store = useGlobalStore()
const authStore = useAuthStore()
const {data: taskRes} = useAuthFetch<ITask[][]>(`/switch-tasks`, {
  method: "GET",
  key: 'index'
})

const active = ref(0)

const canAction = computed(() => {
  return store.percent == 0 && !store.isRunning
})

const onClick = (index: number) => {
  if (!taskRes.value || !canAction.value) return;
  sendHaptic(authStore.activeAuth)
  active.value = index
  store.info.doing = taskRes.value[active.value][0]
}

const onMoveH = (isUp = true) => {
  if (!taskRes.value || !canAction.value) return;
  sendHaptic(authStore.activeAuth)
  if (isUp) {
    taskRes.value[active.value].unshift(<ITask>taskRes.value[active.value].pop())
  } else {
    taskRes.value[active.value].push(<ITask>taskRes.value[active.value].shift())
  }
  store.info.doing = taskRes.value[active.value][0]
}

watch(taskRes, () => {
  if (!taskRes.value) return;
  for (let i = 0; i < taskRes.value.length; i++) {
    for (let j = 0; j < taskRes.value[i].length; j++) {
      if (store.info.doing?.id == taskRes.value[i][j].id) {
        active.value = i
        const [itemToMove] = taskRes.value[i].splice(j, 1);
        console.log(itemToMove);
        taskRes.value[i].unshift(itemToMove);
        break
      }
    }
  }
})
</script>

<template>
  <div class="flex w-full items-center content text-2xl">
    <NuxtIcon v-if="canAction" name="chevron-left" class="text-gray-500 cursor-pointer size-6" @click="onMoveH(false)"/>
    <div class="flex-1 h-10 relative">
      <div v-for="(tasks, i) in taskRes" class="absolute inset-0">
        <div
            class="w-full h-full flex justify-center items-center cursor-pointer gap-1 duration-200 transition-all"
            :class="{
              'font-semibold': i == active,
              'mt-8 opacity-30 scale-60': i !== active,
              'opacity-0!': !canAction && i !== active
            }"
            @click="onClick(i)"
        >
          <span>{{ tasks[0].name || "Untitled" }}</span>
        </div>
      </div>
    </div>
    <NuxtIcon v-if="canAction" name="chevron-right" class="text-gray-500 cursor-pointer size-6" @click="onMoveH(true)"/>
  </div>
</template>
