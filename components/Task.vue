<script setup lang="ts">
import type {ITask} from "~/types";
import WebApp from '@twa-dev/sdk'

const {task} = defineProps<{ task: ITask }>()

const is_completed = ref(task.account_task.length && task.account_task[0].status === 1)
const doing = ref(false)
const store = useGlobalStore()

const completedPomo = computed(() => task.account_task.filter(x => x.status == 1).lengt)

const updateTask = async () => {
  const data = await useNativeFetch<{ status: number }>(`/tasks/${task.id}/do`, {
    method: "POST",
  })
  is_completed.value = data.status == 1
}

const act = async () => {
  if (is_completed.value) return;

  if (task.type === 'default') {
    await store.work(task.id);
    return;
  }

  doing.value = true
  if (['one_time_x_connect', 'one_time_x_change_bio', 'one_time_x_rename'].includes(task.type)) {
    const data = await useNativeFetch<{ url: string }>(`/twitter/verify?task_id=${task.id}`)
    if (data) WebApp.openLink(data.url);
  } else if (task.type === 'one_time' && task.meta) {
    switch (task.meta.action) {
      case "open_link":
        if (task.meta.url.includes("t.me") && store.isUserOnTelegram()) {
          WebApp.openTelegramLink(task.meta.url)
        } else {
          WebApp.openLink(task.meta.url)
        }
        break
      default:
        break;
    }
  }
  setTimeout(async () => {
    await updateTask()
    doing.value = false
    await store.loadInfo()
  }, 7000)
}
</script>

<template>
  <div class="task py-1.5 px-2 rounded-xl flex items-center gap-4">
    <div class="flex-1 flex gap-4 justify-between items-center">
      <div class="text-lg font-semibold">
        <div class="font-bold">{{ task.name }}</div>
        <div class="flex gap-1 items-center">
          <img class="w-4 h-4" v-if="task.reward_type === 'boost'" src="/icon/thunder.png" alt="">
          <img class="w-4 h-4" v-else src="/icon/star.png" alt="">
          <div class="text-xs">{{ task.reward_amount }}</div>
          <template v-if="task.unit > 1">
            <nuxt-icon v-for="i in task.unit" class="w-4 h-4" :class="{'text-yellow-500': i <= completedPomo}" name="clock"></nuxt-icon>
          </template>
        </div>
      </div>
      <div class="space-y-1">
        <div
            @click="act"
            class="cursor-pointer rounded-none hover:rounded-2xl hover:bg-yellow-100 duration-300 p-2"
            :class="{
              'animate-pulse': doing,
               'grayscale': is_completed
            }">
          <img class="w-5 h-5" src="/icon.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
