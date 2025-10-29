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
</script>

<template>
  <div class="flex w-full items-center content text-2xl">
    <NuxtIcon v-if="canAction" name="chevron-left" class="text-gray-500 cursor-pointer size-6" @click="onMoveH(false)"/>
    <div class="flex-1 h-10 relative">
      <div v-for="(tasks, i) in taskRes" class="absolute inset-0">
        <div
            class="w-full h-full flex justify-center items-center cursor-pointer gap-1 duration-200 transition-all"
            :class="{
              'bg-gradient-to-r via-yellow-50 font-semibold': i == active,
              'mt-8 opacity-30 scale-60': canAction && i !== active,
              'opacity-0': !canAction && i !== active
            }"
            @click="onClick(i)"
        >
          <span>{{ tasks[0].name }}</span>
        </div>
      </div>
    </div>
    <NuxtIcon v-if="canAction" name="chevron-right" class="text-gray-500 cursor-pointer size-6" @click="onMoveH(true)"/>
  </div>
</template>
