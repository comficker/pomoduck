<script setup lang="ts">
import type {AccountTaskDetail, ITask} from "~/types";
import WebApp from '@twa-dev/sdk'
import {formatFloat} from "~/lib/utils";
import {TASK_STATUS, BASE_MINING_SPEED} from "~/lib/constants";
import { toast } from 'vue-sonner'

const {task} = defineProps<{ task: ITask }>()
const emits = defineEmits(['update:task', 'deleted'])

const doing = ref(false)
const store = useGlobalStore()
const authStore = useAuthStore()

const updating = ref(false)
const form = ref({
  name: task.name,
  description: task.description,
  unit: task.unit
})

const status = computed(() => {
  if (task.account_task.length === 0) return TASK_STATUS.ACTIVE
  else if (task.account_task.filter(x => x.status === 0).length) {
    return TASK_STATUS.DOING
  } else if (task.account_task.filter(x => x.status === 1).length == task.unit) {
    return TASK_STATUS.COMPLETED
  } else if (task.account_task.filter(x => x.status === 0).length == 0) {
    return TASK_STATUS.ACTIVE
  }
  return task.status
})

const updateTask = async () => {
  await useNativeFetch<AccountTaskDetail>(`/tasks/${task.id}/do`, {
    method: "POST",
  })
  if (task.type == 'one_time') {
    task.status = TASK_STATUS.COMPLETED
  }
}

const act = async () => {
  if ([TASK_STATUS.DOING, TASK_STATUS.COMPLETED].includes(status.value)) return;

  if (task.type === 'default') {
    await store.work(task.id);
    task.status = TASK_STATUS.ACTIVE;
    return;
  }

  doing.value = true
  if (['one_time_x_connect', 'one_time_x_change_bio', 'one_time_x_rename'].includes(task.type)) {
    const data = await useNativeFetch<{ url: string }>(`/twitter/verify?task_id=${task.id}`)
    if (data) WebApp.openLink(data.url);
  } else if (task.type === 'one_time' && task.meta) {
    switch (task.meta.action) {
      case "open_link":
        if (task.meta.url.includes("t.me") && authStore.activeAuth === 'telegram') {
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

const handleCancel = () => {
  form.value.name = task.name
  form.value.description = task.description
  form.value.unit = task.unit
  updating.value = false
}

const handleSave = () => {
  useNativeFetch<ITask>(`/tasks/${task.id}/`, {
    method: 'PUT',
    body: form.value
  }).then((res) => {
    emits('update:task', res)
    updating.value = false
  }).catch(e => {
    toast({
      variant: "destructive",
      title: "Something went wrong!",
      description: "Update task failed",
    })
  })
}

const handleDeleteTask = () => {
  useNativeFetch<ITask>(`/tasks/${task.id}/`, {
    method: 'DELETE',
  }).then((res) => {
    emits('deleted')
    updating.value = false
  }).catch(e => {
    toast({
      variant: "destructive",
      title: "Something went wrong!",
      description: "Delete task failed",
    })
  })
}

watch(() => form.value.unit, () => {
  if (form.value.unit < 1) {
    form.value.unit = 10
  }
  if (form.value.unit > 10) {
    form.value.unit = 1
  }
})
</script>

<template>
  <div
      class="task p-2 rounded-xl flex items-center gap-4"
      :class="{'!bg-yellow-50 border': updating, 'border border-yellow-500': status === TASK_STATUS.DOING}"
  >
    <div class="flex-1 flex gap-4 items-center">
      <div class="flex-1 font-semibold" :class="{'space-y-2': updating}">
        <template v-if="updating">
          <input
              v-model="form.name" type="text"
              class="text-lg border rounded p-0.5 px-3 w-full"
              placeholder="Name"
          >
          <textarea class="w-full" v-model="form.description" placeholder="Note"/>
        </template>
        <div v-else class="text-lg font-bold">{{ form.name || "Untitled" }}</div>
        <div class="flex gap-3 items-center text-sm">
          <div v-if="task.reward_type === 'point'" class="flex items-center gap-0.5">
            <template v-if="updating && task.status == TASK_STATUS.DRAFT">
              <nuxt-icon name="minus-box" class="cursor-pointer size-4" @click="form.unit--"/>
              <nuxt-icon name="plus-box" class="cursor-pointer size-4" @click="form.unit++"/>
            </template>
            <span class="underline">{{ form.unit * task.duration_est / 60 }}</span>
            <span>m</span>
          </div>
          <div class="flex gap-0.5 items-center">
            <template v-if="task.reward_type === 'boost'">
              <img class="size-4" src="/icon/thunder.png" alt="">
              <span>{{task.reward_amount}}</span>
            </template>
            <template v-else>
              <img class="size-4" src="/icon/star.png" alt="">
              <div>{{ formatFloat(form.unit * BASE_MINING_SPEED * task.duration_est * 1.5, 3, 3) }}</div>
            </template>
          </div>
          <div v-if="updating" class="flex gap-2 ml-auto">
            <Button variant="link" size="xs" class="text-xs" @click="handleCancel">Cancel</Button>
            <Button variant="destructive" size="xs" class="text-xs px-3 rounded-lg" @click="handleDeleteTask">Delete</Button>
            <Button size="xs" class="text-xs px-3 rounded-lg" @click="handleSave">Save</Button>
          </div>
          <div
            v-else-if="task.creator" @click="updating = true"
            class="underline cursor-pointer"
          >
            <NuxtIcon name="cog" class="size-4"/>
          </div>
        </div>
      </div>
      <div v-if="!updating" class="space-y-1">
        <div
            @click="act"
            class="act"
            :class="{'animate-pulse': doing || status === TASK_STATUS.DOING,'grayscale': status === TASK_STATUS.COMPLETED}"
        >
          <span v-if="status == TASK_STATUS.ACTIVE">GO!</span>
          <img v-else class="size-5" src="/icon.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
