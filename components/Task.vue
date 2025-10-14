<script setup lang="ts">
import type {ITask} from "~/types";
import WebApp from '@twa-dev/sdk'
import {TASK_STATUS, BASE_MINING_SPEED} from "~/lib/constants";
import {toast} from 'vue-sonner'

const {task} = defineProps<{ task: ITask }>()
const emits = defineEmits(['update:task', 'deleted'])

const store = useGlobalStore()
const authStore = useAuthStore()

const doing = ref(false)
const updating = ref(false)
const form = ref({
  name: task.name,
  description: task.description,
  unit: task.unit
})

const accountTask = computed(() => {
  const s = task.account_task.find(x => x.finished_at)
  return s || task.account_task[0]
})

const status = computed(() => {
  if (accountTask.value && task.creator) {
    if (accountTask.value.finished_at && accountTask.value.start_at) {
      return TASK_STATUS.COMPLETED
    } else if (accountTask.value.start_at && !accountTask.value.finished_at) {
      return TASK_STATUS.DOING
    } else if (!accountTask.value.start_at && !accountTask.value.finished_at) {
      return TASK_STATUS.DRAFT
    }
  }
  return TASK_STATUS.ACTIVE
})

const progress = computed(() => {
  const completed = task.account_task.filter(x => x.finished_at).length
  return completed >= task.unit ? task.unit : completed
})

const act = async () => {
  if (!store.loggedIn) {
    store.modalName = 'auth'
    return
  }
  if (status.value > 1) return;

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
    await store.work(task.id);
    doing.value = false
  }, 7000)
}

const handleCancel = () => {
  form.value.name = task.name
  form.value.description = task.description
  form.value.unit = task.unit
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
      class="task p-2 md:rounded-xl flex items-center gap-4 group"
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
          <div
              v-if="task.reward_type === 'point' && updating && task.status == TASK_STATUS.ACTIVE"
              class="flex items-center gap-0.5"
          >
            <nuxt-icon name="minus-box" class="cursor-pointer size-4" @click="form.unit--"/>
            <nuxt-icon name="plus-box" class="cursor-pointer size-4" @click="form.unit++"/>
          </div>
          <div class="flex items-center">
            <template v-if="task.reward_type === 'boost'">
              <img v-for="item in task.reward_amount" class="size-4" src="/icon/thunder.png" alt="">
            </template>
            <template v-else>
              <NuxtIcon
                  v-for="item in task.unit"
                  name="barley"
                  class="size-4 "
                  :class="{
                    'text-yellow-500': item > progress && task.duration_est >= 1500,
                    'text-yellow-300': item > progress && task.duration_est >= 900,
                    'text-yellow-200': item > progress && task.duration_est < 900,
                    'text-gray-400': item <= progress
                  }"
              />
            </template>
          </div>
          <div
              v-if="task.creator" @click="updating = !updating"
              class="hidden group-hover:block underline cursor-pointer"
              :class="{'text-blue-500': updating}"
          >
            <NuxtIcon name="cog" class="size-4"/>
          </div>
          <div v-if="updating" class="flex text-xs gap-2 ml-auto">
            <Button variant="link" size="xs" @click="handleCancel">Reset</Button>
            <Button
                v-if="status == TASK_STATUS.DRAFT"
                variant="destructive" size="xs" class="px-3 rounded-lg"
                @click="handleDeleteTask"
            >Delete
            </Button>
            <Button size="xs" class="px-3 rounded-lg" @click="handleSave">Save</Button>
          </div>
        </div>
      </div>
      <div v-if="!updating" class="space-y-1 text-xs">
        <div
            @click="act"
            class="act"
            :class="{
              'animate-pulse': status === TASK_STATUS.DOING,
              'grayscale': status === TASK_STATUS.COMPLETED}
            "
        >
          <span v-if="[TASK_STATUS.ACTIVE, TASK_STATUS.DRAFT].includes(status)">GO!</span>
          <img v-else class="size-5" src="/icon.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
