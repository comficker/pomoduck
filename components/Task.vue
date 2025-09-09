<script setup lang="ts">
import type {AccountTaskDetail, ITask} from "~/types";
import WebApp from '@twa-dev/sdk'
import {formatFloat} from "~/lib/utils";
import {TASK_STATUS, BASE_MINING_SPEED} from "~/lib/constants";
import {toast} from "~/components/ui/toast";


const {task} = defineProps<{ task: ITask }>()
const emits = defineEmits(['update:task'])

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
const completedPomo = computed(() => task.account_task.filter(x => x.status == 1).length)
const reward = computed(() => {
  if (task.reward_type === 'boost') return task.reward_amount;
  else {
    return BASE_MINING_SPEED * form.value.unit * task.duration_est
  }
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

watch(() => form.value.unit, () => {
  if (form.value.unit < 1) {
    form.value.unit = 1
  }
  if (form.value.unit > 5) {
    form.value.unit = 5
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
        <input
            v-if="updating" v-model="form.name" type="text"
            class="text-lg border rounded p-0.5 px-3 w-full"
            placeholder="Name"
        >
        <div v-else class="text-lg font-bold">{{ form.name || "Untitled" }}</div>
        <div class="flex gap-3 items-center text-sm">
          <div v-if="task.reward_type === 'point'" class="flex gap-0.5">
            <template v-if="updating">
              <nuxt-icon name="minus-box" class="cursor-pointer w-4 h-4" @click="form.unit--"/>
              <nuxt-icon name="plus-box" class="cursor-pointer w-4 h-4" @click="form.unit++"/>
            </template>
            <nuxt-icon
                v-for="i in form.unit" class="w-4 h-4" :class="{'text-yellow-500': i <= completedPomo}"
                name="tomato" filled
            />
            <span>x</span>
            <div class="flex gap-0.5">
              <span class="underline">{{ task.duration_est / 60 }}</span>
              <span>m</span>
            </div>
          </div>
          <div class="flex gap-0.5 items-center">
            <img class="size-4" v-if="task.reward_type === 'boost'" src="/icon/thunder.png" alt="">
            <img class="size-4" v-else src="/icon/star.png" alt="">
            <div>{{ formatFloat(reward, 3, 3) }}</div>
          </div>
          <div v-if="updating" class="flex gap-2 ml-auto">
            <Button variant="secondary" size="xs" class="text-xs" @click="handleCancel">Cancel</Button>
            <Button size="xs" class="text-xs" @click="handleSave">Save</Button>
          </div>
          <div
              v-else-if="task.status == TASK_STATUS.DRAFT" @click="updating = true"
              class="flex gap-0.5 items-center cursor-pointer">
            <span>Update</span>
            <nuxt-icon name="pen" class="size-4"/>
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

<style scoped>
.act {
  @apply font-bold cursor-pointer rounded-none hover:rounded-2xl hover:bg-yellow-100 duration-300 p-2 flex items-center gap-1;
}
</style>
