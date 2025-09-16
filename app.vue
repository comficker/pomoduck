<script setup lang="ts">
import WebApp from '@twa-dev/sdk'
import { Toaster } from '@/components/ui/sonner'
import {formatFloat} from "~/lib/utils";
import TaskList from "~/components/TaskList.vue";
import Auth from "~/components/modal/Auth.vue";
import MergeAccount from "~/components/modal/MergeAccount.vue";

useHead({
  title: "PomoDuck Timer",
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
    }
  ],
  meta: [
    {name: 'viewport', content: 'width=device-width, user-scalable=no'},
    {name: 'apple-mobile-web-app-status-bar-style', content: 'default'},
  ],
  script: [
    {
      src: "https://www.googletagmanager.com/gtag/js?id=G-DYC8GTSSMK", async: true
    },
    {
      hid: "gtmHead",
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-DYC8GTSSMK');
        `,
    },
  ]
})

const router = useRouter()
const route = useRoute()
const store = useGlobalStore()
const authStore = useAuthStore()

const menuTitle = computed(() => {
  return `${store.openDrawer ? 'Hide' : 'Show'} Task Manager`
})
const showMenu = computed(() => {
  return ['/', '/report'].includes(route.path)
})

watch(() => route.path, () => {
  if (authStore.activeAuth == 'telegram') {
    if (route.name !== 'index') {
      WebApp.BackButton.show();
    } else {
      WebApp.BackButton.hide();
    }
  }
})

onMounted(async () => {
  const body = document.querySelector('body')
  if (body) {
    body.style.backgroundColor = "#fff"
  }
  if (authStore.activeAuth == 'telegram') {
    WebApp.expand()
    WebApp.setHeaderColor("#fff")
    WebApp.setBackgroundColor("#fff")
    WebApp.BackButton.onClick(() => router.back());
    if (WebApp.enableClosingConfirmation) {
      WebApp.enableClosingConfirmation()
    }
    if (['ios', 'android'].includes(WebApp.platform)) {
      WebApp.requestFullscreen()
      document.body.style.setProperty("--head-top-extra", "100px")
    }
  }
})

await authStore.auth()
</script>

<template>
  <div v-if="authStore.logs.length" class="fixed top-0 inset-x-0 p-4 bg-black/20 z-10">
    <blockquote class="w-full">
      {{JSON.stringify(authStore.logs)}}
    </blockquote>
  </div>
  <div class="wrapper w-full flex flex-col relative z-0">
    <div class="w-full flex gap-4 p-4 py-2 justify-between">
      <div class="flex-1 space-y-1">
        <nuxt-link class="block" to="/">
          <img class="h-8" :src="`/logo.png`" alt="">
        </nuxt-link>
        <div class="uppercase font-bold text-2xs hidden md:flex items-center gap-1 text-gray-500">
          <span>Powered by</span>
          <NuxtIcon name="wld" class="size-4" filled/>
          <NuxtIcon name="ton" class="size-[17px]" filled/>
        </div>
      </div>
      <div class="flex items-center gap-2 num">
        <div
            class="w-20 font-semibold uppercase flex gap-2 items-center justify-center bg-gray-100 rounded-xl py-0.5 px-2"
        >
          <img src="/icon/star.png" class="size-4" alt="">
          <span>{{ formatFloat(store.info.balance, 2, 2) }}</span>
        </div>
        <div
            class="w-16 font-semibold uppercase flex gap-2 items-center justify-center bg-gray-100 rounded-xl py-0.5 px-2">
          <img src="/icon/thunder.png" class="size-4" alt="">
          <span>{{ store.info.boost_balance }}</span>
        </div>
        <nuxt-link class="router" v-if="store.loggedIn" to="/settings">
          <NuxtIcon name="cog" class="size-6"/>
        </nuxt-link>
      </div>
    </div>
    <div class="max-w-md mx-auto flex-1 w-full relative overflow-auto no-scroll">
      <nuxt-page/>
    </div>
    <div
        v-if="showMenu"
        class="relative md:fixed bottom-0 md:bottom-auto md:top-0 inset-x-0 max-w-md mx-auto w-full z-10 bg-white p-4 md:p-3"
        :class="{'py-6': authStore.activeAuth === 'telegram'}"
    >
      <div class="relative">
        <div v-if="route.path == '/'" class="-z-10 absolute bottom-1 md:bottom-auto md:top-1 -inset-x-2">
          <div class="md:hidden flex justify-center" @click="store.openDrawer = !store.openDrawer">
            <div class="task-control dropbox">
              <NuxtIcon name="task" class="w-4 h-4"/>
              <span class="">{{ menuTitle }}</span>
              <NuxtIcon :name="`chevron-double-${!store.openDrawer ? 'up': 'down'}`" class="w-4 h-4"/>
            </div>
          </div>
          <TaskList :key="store.refreshTask" :class="{'active': store.openDrawer}" class="relative z-10"/>
          <div class="hidden md:flex justify-center" @click="store.openDrawer = !store.openDrawer">
            <div class="task-control dropbox">
              <NuxtIcon name="task" class="w-4 h-4"/>
              <span class="">{{ menuTitle }}</span>
              <NuxtIcon :name="`chevron-double-${store.openDrawer ? 'up': 'down'}`" class="w-4 h-4"/>
            </div>
          </div>
        </div>
        <div class="menu">
          <template v-if="store.openDrawer">
            <div
                v-for="item in ['public', 'private']" class="item" :class="{'active': store.taskFilter === item}"
                @click="store.taskFilter = item"
            >
              <NuxtIcon :name="`${item}_task`" class="size-5"/>
              <span class="capitalize">{{ item }} task</span>
            </div>
          </template>
          <template v-else>
            <nuxt-link to="/" class="">
              <NuxtIcon name="home" class="w-5 h-5"/>
              <span>Home</span>
            </nuxt-link>
            <nuxt-link to="/report" class="">
              <NuxtIcon name="rank" class="w-5 h-5"/>
              <span>Report</span>
            </nuxt-link>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div v-if="authStore.cooking" class="fixed bg-white inset-0 flex flex-col justify-center gap-6 items-center z-10">
    <img class="size-16" src="/icon.png" alt="">
    <span class="text-center text-xl font-bold">Cooking...</span>
    <Button class="h-12 text-xl w-48 rounded-2xl" size="lg" @click="authStore.auth()">Retry</Button>
  </div>
  <Dialog :open="!!store.modalName" @update:open="store.modalName = null">
    <DialogContent class="max-w-sm">
      <Auth v-if="store.modalName === 'auth'"/>
      <MergeAccount v-else-if="store.modalName === 'merge'"/>
    </DialogContent>
  </Dialog>
  <ClientOnly>
    <Toaster/>
  </ClientOnly>
</template>

<style>
</style>
