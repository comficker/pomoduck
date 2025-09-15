<script setup lang="ts">
import {Switch} from "~/components/ui/switch";
import WebApp from "@twa-dev/sdk";
import {cloneDeep, debounce} from "~/lib/utils";

interface ISettings {
  "meta": {
    notify: {
      in_app: boolean,
      telegram: boolean,
      extension: boolean,
    },
    vibration: boolean,
    sound: boolean
  } | null,
  "tg_id": string | null,
  "google_id": string | null,
  "twitter_id": string | null,
  "wld_id": string | null,
}

const DEFAULT = {
  meta: {
    notify: {
      in_app: true,
      telegram: true,
      extension: true
    },
    vibration: true,
    sound: true
  },
  tg_id: null,
  google_id: null,
  twitter_id: null,
  wld_id: null,
}

const authStore = useAuthStore()
const {data, pending} = useAuthFetch<ISettings>('/settings')

const form = ref<ISettings>(cloneDeep(DEFAULT))

const init = () => {
  if (data.value) {
    form.value = data.value
    if (!form.value.meta) {
      form.value.meta = cloneDeep(DEFAULT.meta)
    }
  }
}

const showLogout = computed(() => {
  if (authStore.activeAuth == 'wld') return false
  return !['ios', 'android'].includes(WebApp.platform);

})

function toggleNotifySwitch(e: boolean) {
  if (form.value.meta) {
    form.value.meta.notify.in_app = e
    form.value.meta.notify.telegram = e
    form.value.meta.notify.extension = e
  }
}

function connectGG() {

}

function connectX() {

}

function connectTG() {

}

const push = debounce(() => {
  useNativeFetch('/settings', {
    method: 'POST',
    body: form.value,
  })
}, 800)

onMounted(() => {
  init()
})

watch(pending, () => {
  init()
})

watch(() => JSON.stringify(form.value), () => {
  push()
})
</script>

<template>
  <div class="w-full h-full p-4 flex flex-col relative gap-6">
    <div class="space-y-3">
      <div class="label">Settings</div>
      <div v-if="form.meta" class="space-y-2">
        <div class="flex justify-between">
          <span class="font-semibold">Notify</span>
          <Switch
              :model-value="form.meta && form.meta.notify.in_app && form.meta.notify.extension && form.meta.notify.telegram"
              @update:model-value="toggleNotifySwitch"
          />
        </div>
        <div class="space-y-2 flex-1">
          <div class="flex justify-between">
            <div class="flex gap-1">
              <NuxtIcon name="subdirectory" class="size-4"/>
              <span class="font-semibold">In app</span>
            </div>
            <Switch v-model="form.meta.notify.in_app"/>
          </div>
          <div class="flex justify-between">
            <div class="flex gap-1">
              <NuxtIcon name="subdirectory" class="size-4"/>
              <span class="font-semibold">Telegram</span>
            </div>
            <Switch v-model="form.meta.notify.telegram"/>
          </div>
          <div class="flex justify-between">
            <div class="flex gap-1">
              <NuxtIcon name="subdirectory" class="size-4"/>
              <span class="font-semibold">Extension</span>
            </div>
            <Switch v-model="form.meta.notify.extension"/>
          </div>
        </div>
      </div>
      <div v-if="form.meta" class="flex justify-between">
        <span class="font-semibold">Sound</span>
        <Switch v-model="form.meta.sound"/>
      </div>
      <div v-if="form.meta" class="flex justify-between">
        <span class="font-semibold">Haptic Feedback</span>
        <Switch v-model="form.meta.vibration"/>
      </div>
    </div>
    <div class="space-y-3">
      <div class="space-y-1">
        <div class="label">Connected</div>
        <p class="text-sm italic">You can login and synchronize via connected app</p>
      </div>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="font-semibold">Google</span>
          <Button variant="outline" size="sm" @click="connectGG">Connect</Button>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Telegram</span>
          <Button variant="outline" size="sm" @click="connectTG">Connect</Button>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">X</span>
          <Button variant="outline" size="sm" @click="connectX">Connect</Button>
        </div>
      </div>
    </div>
    <Button v-if="showLogout" size="lg" variant="destructive" class="rounded-full" @click="authStore.logout()">Logout
    </Button>
  </div>
</template>
