<script setup lang="ts">
import type {ITask} from "~/types";
import WebApp from '@twa-dev/sdk'

const {task} = defineProps<{ task: ITask }>()
const is_completed = ref(task.account_task?.is_complete || false)
const doing = ref(false)
const store = useGlobalStore()

const updateTask = async () => {
  const data = await useNativeFetch<{ is_complete: boolean }>(`/2024/tasks/${task.id}/do`, {
    method: "POST",
  })
  is_completed.value = data.is_complete
}

const act = async () => {
  if (['twitter_connect', 'twitter_change_bio', 'tweet_rename'].includes(task.type)) {
    const data = await useNativeFetch<{ url: string }>('/meow/twitter-verify', {
      query: {
        task_id: task.id
      }
    })
    if (data) {
      WebApp.openLink(data.url)
    }
    doing.value = true
  } else {
    doing.value = true
    if (task.meta) {
      switch (task.meta.action) {
        case "open_link":
          if (task.meta.url.includes("t.me")) {
            WebApp.openTelegramLink(task.meta.url)
          } else {
            WebApp.openLink(task.meta.url)
          }
          break
        default:
          break;
      }
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
      <div class="">
        <div class="font-semibold">{{ task.name }}</div>
        <div class="flex gap-1 items-center">
          <img class="w-4 h-4" v-if="task.reward_type === 'boost'" src="/icon/thunder.png" alt="">
          <img class="w-4 h-4" v-else src="/icon/star.png" alt="">
          <div class="text-xs">{{ task.reward_amount }}</div>
        </div>
      </div>
      <div class="space-y-1">
        <nuxt-icon v-if="doing" name="load" class="animate-spin w-5 h-5 text-green-500"/>
        <nuxt-icon v-else-if="is_completed" name="check" class="w-5 h-5 text-gray-500"/>
        <div v-else class="cursor-pointer" @click="act">
          <img class="w-5 h-5" src="/icon.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
