<script setup lang="ts">
import {Toaster} from '@/components/ui/sonner'
import {formatFloat} from "~/lib/utils";
import Auth from "~/components/modal/Auth.vue";
import MergeAccount from "~/components/modal/MergeAccount.vue";
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
      href: "https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap"
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

const route = useRoute()
const store = useGlobalStore()
const authStore = useAuthStore()

await authStore.init()
await store.init()

onMounted(async () => {
  const {$setupTelegram} = useNuxtApp()
  $setupTelegram()
  document.addEventListener("contextmenu", function (e) {
    // e.preventDefault()
    e.stopPropagation()
    return false;
  });
})

watch(() => route.path, () => {
  if (authStore.activeAuth === 'telegram') {
    if (route.name !== 'index') {
      window.telegram.BackButton.show();
    } else {
      window.telegram.BackButton.hide();
    }
  }
})
</script>

<template>
  <div v-if="authStore.logs.length" class="fixed top-0 inset-x-0 p-4 bg-black/20 z-10">
    <textarea v-for="log in authStore.logs" class="w-full" :value="JSON.stringify(log)"/>
  </div>
  <div class="wrapper w-full flex flex-col relative z-0 bg-neutral-100">
    <div class="w-full flex gap-4 p-4 py-2 justify-between items-center">
      <div class="flex-1 flex gap-4 items-center">
        <div class="menu">
          <nuxt-link class="block" to="/">
            <NuxtIcon name="house" class="size-5"/>
            <span class="hidden md:block">Home</span>
          </nuxt-link>
          <nuxt-link to="/shop">
            <NuxtIcon name="storefront" class="size-5"/>
            <span class="hidden md:block">Accessories</span>
          </nuxt-link>
        </div>
      </div>
      <div class="menu">
        <nuxt-link to="/leaderboard">
          <NuxtIcon name="leaderboard" class="size-5"/>
        </nuxt-link>
        <nuxt-link to="/achievement" class="">
          <NuxtIcon name="medal" class="size-5"/>
        </nuxt-link>
        <nuxt-link to="/task" class="">
          <NuxtIcon name="task" class="size-5"/>
        </nuxt-link>
        <nuxt-link to="/report" class="">
          <NuxtIcon name="rank" class="size-5"/>
        </nuxt-link>
        <DropdownMenu v-if="store.loggedIn">
          <DropdownMenuTrigger as-child>
            <div
                class="flex divide-x divide-gray-100 items-center justify-center bg-white text-yellow-500 shadow rounded-lg cursor-pointer">
              <div class="hidden md:flex p-4 py-1 gap-1 items-center text-base">
                <NuxtIcon name="egg" class="size-4" filled/>
                <span>{{ formatFloat(store.info.egg, 0, 0) }}</span>
              </div>
              <div class="flex-1 p-1">
                <NuxtIcon name="chevron-down" class="size-5"/>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" class="text-base min-w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem v-if="false">Profile</DropdownMenuItem>
            <DropdownMenuItem as-child>
              <nuxt-link to="/house">House</nuxt-link>
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <nuxt-link to="/settings">Settings</nuxt-link>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem @click="authStore.logout()">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button v-else @click="store.modalName = 'auth'">Login</Button>
      </div>
    </div>
    <div class="max-w-lg mx-auto flex-1 w-full relative overflow-y-auto no-scroll">
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
      <client-only>
        <Auth v-if="store.modalName === 'auth'"/>
        <MergeAccount v-else-if="store.modalName === 'merge'"/>
      </client-only>
    </DialogContent>
  </Dialog>
  <ClientOnly>
    <Toaster/>
  </ClientOnly>
</template>
