<script setup lang="ts">
import WebApp from '@twa-dev/sdk'
import Toaster from '~/components/ui/toast/Toaster.vue'
import {formatFloat} from "~/lib/utils";
import TaskList from "~/components/TaskList.vue";

useHead({
  title: "PomoDuck - Quack! Quack Quack Quack!",
  link: [{
    href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=IBM+Plex+Mono:wght@400;700&display=swap",
    rel: "stylesheet"
  }],
  meta: [
    {name: 'viewport', content: 'width=device-width, user-scalable=no'},
    {name: 'apple-mobile-web-app-status-bar-style', content: 'default'},
  ],
  script: []
})

const router = useRouter()
const route = useRoute()
const store = useGlobalStore()
const authStore = useAuthStore()

const menuTitle = computed(() => {
  return `${store.openDrawer ? 'Hide' : 'Show'} Task Manager`
})

watch(() => route.path, () => {
  if (route.name !== 'index') {
    WebApp.BackButton.show();
  } else {
    WebApp.BackButton.hide();
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
  }
})

const showCooking = computed(() => {
  if (store.info && store.info.id) return false;
  if (['wld', 'telegram'].includes(authStore.activeAuth)) return store.loading;
  return authStore.loading
})

await authStore.auth()
</script>

<template>
  <textarea v-if="false" class="w-full p-3 rounded border" :value="JSON.stringify(authStore.logs)"/>
  <div class="h-screen w-full flex flex-col gap-4">
    <div class="w-full flex gap-4 p-4 py-2 justify-between">
      <div class="flex-1 space-y-1">
        <nuxt-link class="block" to="/">
          <img class="h-5 md:h-8" :src="`/logo.png`" alt="">
        </nuxt-link>
        <div class="uppercase font-bold text-2xs flex items-center gap-1 text-gray-500">
          <span>Powered by</span>
          <NuxtIcon name="wld" class="w-3 h-3" filled/>
          <NuxtIcon name="ton" class="w-3 h-3" filled/>
          <a href="/about" target="_blank">
            <NuxtIcon name="open" class="w-4 h-4"/>
          </a>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div
            class="w-20 font-semibold uppercase flex gap-2 items-center justify-center bg-gray-100 rounded-xl py-0.5 px-2"
        >
          <img src="/icon/star.png" class="w-4 h-4" alt="">
          <span class="major-mono">{{ formatFloat(store.info.balance, 2, 2) }}</span>
        </div>
        <div
            class="w-20 font-semibold uppercase flex gap-2 items-center justify-center bg-gray-100 rounded-xl py-0.5 px-2">
          <img src="/icon/thunder.png" class="w-4 h-4" alt="">
          <span class="major-mono">{{ store.info.boost_balance }}</span>
        </div>
      </div>
    </div>
    <div class="max-w-md mx-auto flex-1 w-full relative overflow-auto">
      <nuxt-page/>
    </div>
    <div
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
          <TaskList :key="store.refreshTask" :class="{'active': store.openDrawer}"/>
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
                v-for="item in ['my', 'public']" class="item" :class="{'active': store.taskFilter === item}"
                @click="store.taskFilter = item"
            >
              <NuxtIcon :name="`${item}_task`" class="w-5 h-5"/>
              <span class="capitalize">{{ item }} task</span>
            </div>
          </template>
          <template v-else>
            <nuxt-link to="/" class="">
              <NuxtIcon name="home" class="w-5 h-5"/>
              <span>Home</span>
            </nuxt-link>
            <nuxt-link to="/leaderboard" class="">
              <NuxtIcon name="rank" class="w-5 h-5"/>
              <span>Leaderboard</span>
            </nuxt-link>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showCooking" class="fixed bg-white inset-0 flex flex-col justify-center gap-6 items-center z-10">
    <img class="w-16 h-16" src="/icon.png" alt="">
    <span class="text-center text-xl font-bold">Cooking...</span>
    <Button class="h-12 text-xl w-48 rounded-2xl" size="lg" @click="authStore.auth()">Retry</Button>
  </div>
  <Toaster/>
</template>

<style>
.menu {
  @apply px-1 bg-black/70 rounded-full p-1 text-sm grid grid-cols-2 gap-2 font-semibold uppercase text-white;
}

.menu a.router-link-active,
.menu .item.active {
  @apply bg-yellow-500;
}

.menu a,
.menu .item {
  @apply block p-3 flex justify-center items-center gap-1 rounded-full duration-100 cursor-pointer;
}

.dropbox {
  @apply overflow-hidden shadow border rounded-xl rounded-b-none md:rounded-b-xl md:rounded-t-none border-b-0 md:border-t-0
}

.task-control {
  @apply text-xs bg-white cursor-pointer flex items-center gap-1 p-1 px-4;

  z-index: 0;
}
</style>
