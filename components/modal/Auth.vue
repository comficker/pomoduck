<script lang="ts" setup>
import {Button} from "~/components/ui/button";
import type {AuthDataInput} from "~/types";
import {DialogDescription, DialogHeader, DialogTitle} from "~/components/ui/dialog";
import TelegramLogin from "~/components/modal/TelegramLogin.vue";
import WorldLogin from "~/components/modal/WorldLogin.vue";
import GoogleLogin from "~/components/modal/GoogleLogin.vue";
import TwitterLogin from "~/components/modal/TwitterLogin.vue";

const authStore = useAuthStore()
const store = useGlobalStore()
const route = useRoute()
const isLogging = ref(true)
const fetching = ref(false)
const updating = ref(true)

const form = ref<AuthDataInput>({
  "username": "",
  "email": "",
  "password": "",
  "re_password": "",
  "invite_code": <string>route.query.ref || "",
})

const meta = computed(() => {
  return {
    title: isLogging.value ? "Login" : "Registration",
    desc: "Only the living get to play. The longer you last, the fatter the feast."
  }
})

const submit = async () => {
  if (fetching.value) return;
  fetching.value = true
  await authStore.authLocal(!isLogging.value, form.value)
  fetching.value = false
}
</script>

<template>
  <DialogHeader>
    <DialogTitle class="text-3xl font-bold gap-2 items-center flex">
      <span>{{ meta.title }}</span>
    </DialogTitle>
    <DialogDescription class="text-left" v-if="meta.desc">{{ meta.desc }}</DialogDescription>
  </DialogHeader>
  <div v-if="false" class="space-y-3">
    <div v-if="!isLogging || store.loggedIn" class="relative">
      <input
          :disabled="!updating" class="w-full" v-model="form.username" type="text" name="Username"
          placeholder="Username"
      >
    </div>
    <div class="relative">
      <input
          :disabled="!updating" class="w-full" v-model="form.email" type="email" name="email"
          placeholder="Email">
    </div>
    <div class="relative">
      <input
          :disabled="!updating" class="w-full" v-model="form.password" type="password" name="password"
          placeholder="Password">
    </div>
    <template v-if="!isLogging && !store.loggedIn">
      <div class="relative">
        <input
            class="w-full" v-model="form.re_password" type="password" name="password2"
            placeholder="Retype password">
      </div>
      <div class="relative">
        <input class="w-full" v-model="form.invite_code" type="text" name="invite_code"
               placeholder="[Optional] Invite Code">
      </div>
    </template>
  </div>
  <div class="w-full space-y-3">
    <template v-if="false">
      <Button size="lg" class="w-full text-lg" :class="{'animated-pulse': fetching}" @click="submit">
        <span>{{ isLogging ? 'Login' : 'Register' }}</span>
      </Button>
      <div class="text-center text-gray-600 text-sm font-semibold">
        <span>{{ isLogging ? "Don't have an account? " : 'Already have account? ' }}</span>
        <span
            class="cursor-pointer text-blue-500 underline"
            @click="isLogging = !isLogging">{{ isLogging ? 'Register' : 'Login' }}</span>
      </div>
    </template>
    <TelegramLogin/>
    <WorldLogin/>
    <GoogleLogin/>
    <TwitterLogin/>
  </div>
</template>
