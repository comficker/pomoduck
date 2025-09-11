<script setup lang="ts">
import {Switch} from "~/components/ui/switch";

const authStore = useAuthStore()

const form = ref({
  notify: {
    in_app: true,
    telegram: true,
    extension: true
  },
  vibration: true,
  sound: true
})

function toggleNotifySwitch(e: boolean) {
  form.value.notify.in_app = e
  form.value.notify.telegram = e
  form.value.notify.extension = e
}

function connectGG() {

}

function connectX() {

}

function connectTG() {

}
</script>

<template>
  <div class="w-full h-full p-4 flex flex-col relative gap-6">
    <div class="space-y-3">
      <div class="label">Settings</div>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="font-semibold">Notify</span>
          <Switch
              :model-value="form.notify.in_app && form.notify.extension && form.notify.telegram"
              @update:model-value="toggleNotifySwitch"
          />
        </div>
        <div class="space-y-2 flex-1">
          <div class="flex justify-between">
            <div class="flex gap-1">
              <NuxtIcon name="subdirectory" class="size-4"/>
              <span class="font-semibold">In app</span>
            </div>
            <Switch v-model="form.notify.in_app"/>
          </div>
          <div class="flex justify-between">
            <div class="flex gap-1">
              <NuxtIcon name="subdirectory" class="size-4"/>
              <span class="font-semibold">Telegram</span>
            </div>
            <Switch v-model="form.notify.telegram"/>
          </div>
          <div class="flex justify-between">
            <div class="flex gap-1">
              <NuxtIcon name="subdirectory" class="size-4"/>
              <span class="font-semibold">Extension</span>
            </div>
            <Switch v-model="form.notify.extension"/>
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <span class="font-semibold">Sound</span>
        <Switch v-model="form.sound"/>
      </div>
      <div class="flex justify-between">
        <span class="font-semibold">Haptic Feedback</span>
        <Switch v-model="form.vibration"/>
      </div>
    </div>
    <div class="space-y-3">
      <div class="label">Connected</div>
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
    <Button size="lg" variant="destructive" class="rounded-full" @click="authStore.logout()">Logout</Button>
  </div>
</template>
