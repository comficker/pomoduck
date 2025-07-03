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

const menuTitle = computed(() => {
  return `${store.openDrawer ? 'Hide' : 'Show'} Task Manager`
})

onMounted(() => {
  const body = document.querySelector('body')
  if (body) {
    body.style.backgroundColor = "#fff"
  }

  WebApp.expand()
  WebApp.setHeaderColor("#fff")
  WebApp.setBackgroundColor("#fff")
  WebApp.BackButton.onClick(() => router.back());
  if (WebApp.enableClosingConfirmation) {
    WebApp.enableClosingConfirmation()
  }
  store.authTelegram()
})

watch(() => route.path, () => {
  if (route.name !== 'index') {
    WebApp.BackButton.show();
  } else {
    WebApp.BackButton.hide();
  }
})
</script>

<template>
  <div class="h-screen w-full flex flex-col">
    <div class="flex gap-4 p-4 justify-between">
      <nuxt-link class="flex items-center gap-1" to="/">
        <img class="h-8" :src="`/logo.png`" alt="">
      </nuxt-link>
      <div class="flex items-center gap-2">
        <div
            class="w-20 font-semibold uppercase flex gap-2 items-center justify-center bg-gray-100 rounded-xl py-0.5 px-2">
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
    <div class="max-w-md mx-auto flex-1 w-full relative mb-24">
      <div class="absolute inset-0 overflow-auto">
        <nuxt-page/>
      </div>
    </div>
    <div class="fixed bottom-0 md:bottom-auto md:top-0 inset-x-0 max-w-md mx-auto w-full z-10 bg-white p-4">
      <div class="relative">
        <div v-if="route.path == '/'" class="-z-10 absolute bottom-1 md:bottom-auto md:top-1 -inset-x-2">
          <div class="md:hidden flex justify-center" @click="store.openDrawer = !store.openDrawer">
            <div class="task-control dropbox">
              <NuxtIcon name="task" class="w-4 h-4"/>
              <span class="">{{ menuTitle }}</span>
              <NuxtIcon :name="`chevron-double-${!store.openDrawer ? 'up': 'down'}`" class="w-4 h-4"/>
            </div>
          </div>
          <TaskList :class="{'active': store.openDrawer}"/>
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
                v-for="item in ['public', 'my']" class="item" :class="{'active': store.taskFilter === item}"
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
  <Toaster/>
</template>

<style>
.menu {
  @apply px-1 bg-black/70 rounded-2xl p-1 text-sm grid grid-cols-2 gap-2 font-semibold uppercase text-white;
}

.menu a.router-link-active,
.menu .item.active {
  @apply bg-yellow-500;
}

.menu a,
.menu .item {
  @apply block p-3 flex justify-center items-center gap-1 rounded-xl duration-100;
}

.dropbox {
  @apply overflow-hidden shadow border rounded-xl rounded-b-none md:rounded-b-xl md:rounded-t-none border-b-0 md:border-t-0
}

.task-control {
  @apply text-xs bg-white cursor-pointer flex items-center gap-1 p-1 px-4;

  z-index: 0;
}
</style>
