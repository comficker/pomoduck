<script setup lang="ts">
import WebApp from '@twa-dev/sdk'
import {Toaster} from '@/components/ui/sonner'
import {formatFloat} from "~/lib/utils";
import Auth from "~/components/modal/Auth.vue";
import MergeAccount from "~/components/modal/MergeAccount.vue";
import CurentTask from "~/components/CurentTask.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    <textarea v-for="log in authStore.logs" class="w-full" :value="JSON.stringify(log)"/>
  </div>
  <div class="wrapper w-full flex flex-col relative z-0 bg-neutral-100">
    <div class="w-full flex gap-4 p-4 py-2 justify-between items-center">
      <div class="flex-1 space-y-1 flex gap-4 items-center">
        <div class="">
          <nuxt-link class="block" to="/">
            <img class="md:block hidden h-8" :src="`/logo.png`" alt="">
            <img class="md:hidden h-8" :src="`/icon.png`" alt="">
          </nuxt-link>
        </div>
        <div class="menu">
          <nuxt-link to="/leaderboard">
            <img src="/trophy.png" class="size-4" alt="Leaderboard"/>
            <span class="hidden md:block">Leaderboard</span>
          </nuxt-link>
        </div>
      </div>
      <div class="menu">
        <nuxt-link to="/achievement" class="">
          <NuxtIcon name="medal" class="size-5"/>
          <span class="hidden md:block">Achievement</span>
        </nuxt-link>
        <nuxt-link to="/task" class="">
          <NuxtIcon name="task" class="size-5"/>
          <span class="hidden md:block">Task</span>
        </nuxt-link>
        <nuxt-link to="/report" class="">
          <NuxtIcon name="rank" class="size-5"/>
          <span class="hidden md:block">Report</span>
        </nuxt-link>
        <DropdownMenu v-if="store.loggedIn">
          <DropdownMenuTrigger as-child>
            <div
                class="num flex divide-x divide-gray-100 items-center justify-center bg-white text-yellow-500 shadow rounded-lg">
              <div class="flex p-2 py-2 items-center">
                <span>{{ formatFloat(store.info.balance, 2, 2) }}</span>
              </div>
              <div class="flex-1 p-1">
                <NuxtIcon name="chevron-down" class="size-5"/>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" class="num">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem v-if="false">Profile</DropdownMenuItem>
            <DropdownMenuItem as-child>
              <nuxt-link to="/balance">Balance</nuxt-link>
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <nuxt-link to="/settings">Settings</nuxt-link>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem @click="authStore.logout()">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button v-else class="num" @click="store.modalName = 'auth'">Login</Button>
      </div>
    </div>
    <div class="max-w-md mx-auto flex-1 w-full relative overflow-y-auto no-scroll">
      <nuxt-page/>
    </div>
    <div class="p-2 uppercase font-bold text-2xs hidden md:flex justify-center items-center gap-1 text-gray-500">
      <span>Powered by</span>
      <a class="size-5" target="_blank" href="https://world.org/mini-app?app_id=app_3a93096ed6e4f35613c5387f47a4266d">
        <NuxtIcon name="wld" filled/>
      </a>
      <a class="size-5" target="_blank" href="https://t.me/Pomoduck_bot">
        <NuxtIcon name="ton" filled/>
      </a>
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
