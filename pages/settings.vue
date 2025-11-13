<script setup lang="ts">
import {Switch} from "~/components/ui/switch";
import {cloneDeep, debounce} from "~/lib/utils";
import useStatefulCookie from "~/composables/useStatefulCookie";
import TelegramLogin from "~/components/modal/TelegramLogin.vue";

const authToken = useStatefulCookie('auth_token')

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
  telegram_username: string | null,
  email: string | null,
  twitter_username: string | null,
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
  telegram_username: null,
  email: null,
  twitter_username: null,
}

const authStore = useAuthStore()
const store = useGlobalStore()
const route = useRoute()

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

function toggleNotifySwitch(e: boolean) {
  if (form.value.meta) {
    form.value.meta.notify.in_app = e
    form.value.meta.notify.telegram = e
    form.value.meta.notify.extension = e
  }
}

function connectOauth(channel: string) {
  const isInApp = ['telegram', 'wld'].includes(authStore.activeAuth)
  window.open(`${useRuntimeConfig().public.api}/v2/auth-${channel}?token=${authToken.value}`, isInApp ? "_blank" : "_self")
}

const push = debounce(() => {
  useNativeFetch('/settings', {
    method: 'POST',
    body: form.value,
  })
}, 800)

const handleTelegramConnected = async (user: any) => {
  const response = await authStore.authTelegram(user, true)
  await store.loadInfo(false)
  if (response && response.merge) {
    store.modalData = {token: response.merge}
    store.modalName = 'merge'
    console.log(store.modalName);
  }
}

onMounted(() => {
  init()
  if (route.query.merge) {
    store.modalData = {token: route.query.merge.toString()}
    store.modalName = 'merge'
  }
})

watch(pending, () => {
  init()
})

watch(() => JSON.stringify(form.value), () => {
  push()
})

useHead({
  title: "Settings"
})
</script>

<template>
  <div class="p-4 label">
    <h1>Settings</h1>
  </div>
  <div class="p-4 space-y-3">
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
  <div class="p-4 space-y-3">
    <div class="space-y-1">
      <div class="label">Connect</div>
      <p class="text-sm italic">You can login and synchronize via connected app</p>
    </div>
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <span class="font-semibold">Google</span>
        <div v-if="data?.google_id">
          {{ data.email || data.google_id }}
        </div>
        <Button v-else variant="outline" size="xs" @click="connectOauth('google')">Connect</Button>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-semibold">Telegram</span>
        <div v-if="data?.tg_id">
          {{ data.telegram_username || data.tg_id }}
        </div>
        <client-only v-else>
          <TelegramLogin @done="handleTelegramConnected"/>
        </client-only>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-semibold">X</span>
        <div v-if="data?.twitter_id">
          {{ data.twitter_username || data.twitter_id }}
        </div>
        <Button v-else variant="outline" size="xs" @click="connectOauth('twitter')">Connect</Button>
      </div>
    </div>
  </div>
</template>
