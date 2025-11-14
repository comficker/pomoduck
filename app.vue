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
import {useAuthStore} from "~/stores/auth.store";

const route = useRoute()
const store = useGlobalStore()
const authStore = useAuthStore()
const cfg = useRuntimeConfig()

const tabCount = ref(0)

function getSystemTheme() {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  return media.matches ? 'dark' : 'light'
}

function switchTheme() {
  let theme = store.theme
  if (theme === 'system') {
    theme = getSystemTheme()
  }
  if (theme === 'dark') {
    document.body.classList.add('dark')
  } else if (theme === 'light') {
    document.body.classList.remove('dark')
  }
}

onMounted(async () => {
  const {$setupTelegram} = useNuxtApp()
  $setupTelegram()
  document.addEventListener("contextmenu", function (e) {
    if (cfg.public.env === 'production') e.preventDefault();
    e.stopPropagation()
    return false;
  });
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  media.addEventListener('change', (e) => {
    switchTheme()
  })
})

watch(() => store.theme, () => {
  switchTheme()
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
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-DYC8GTSSMK');
        `,
    }
  ],
  bodyAttrs: {
    class: store.theme
  }
})
</script>

<template>
  <div class="wrapper w-full flex flex-col relative z-0 divide-y">
    <div class="md:px-4">
      <div class="md:border-x has-star max-w-3xl w-full mx-auto flex gap-4 p-4 py-2 justify-between items-center">
        <div class="flex-1 flex gap-4 items-center">
          <div class="menu">
            <nuxt-link class="block" to="/">
              <NuxtIcon name="house" class="size-5"/>
              <span class="hidden md:block">Home</span>
            </nuxt-link>
            <nuxt-link to="/shop">
              <NuxtIcon name="storefront" class="size-5"/>
              <span class="hidden md:block">Shop</span>
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
                <div class="hidden md:flex p-2 py-1 gap-2 items-center text-base">
                  <NuxtIcon name="footprint" class="size-4" filled/>
                  <span>{{ formatFloat(store.info.footprint, 0, 0) }}</span>
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
              <DropdownMenuItem @click="store.logout()">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button v-else @click="store.modalName = 'auth'">Login</Button>
        </div>
      </div>
    </div>
    <div class="md:px-4 flex-1">
      <div class="md:border-x has-star h-full max-w-3xl mx-auto relative">
        <div class="absolute inset-0 overflow-x-hidden overflow-auto no-scroll divide-y">
          <nuxt-page/>
        </div>
      </div>
    </div>
    <div class="md:px-4 uppercase font-bold text-2xs text-gray-500">
      <div class="md:border-x has-star max-w-3xl mx-auto flex justify-center md:justify-between">
        <div class="p-2 flex items-center gap-1" @click="tabCount++">
          <span>Version 1.0.0</span>
        </div>
        <div class="p-2 hidden md:flex items-center gap-1">
          <span>Powered by</span>
          <a class="size-5" target="_blank"
             href="https://world.org/mini-app?app_id=app_3a93096ed6e4f35613c5387f47a4266d">
            <NuxtIcon name="wld" filled/>
          </a>
          <a class="size-5" target="_blank" href="https://t.me/Pomoduck_bot">
            <NuxtIcon name="ton" filled/>
          </a>
        </div>
      </div>
    </div>
  </div>
  <div v-if="store.status === 'cooking'" class="fixed inset-0 bg-white flex flex-col items-center justify-center gap-4">
    <img class="size-64" src="/cooking.svg" alt="">
    <div class="text-3xl font-bold">Cooooooking...</div>
    <div class="label">Wait few seconds, quack!</div>
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
  <div
      v-if="tabCount > 5"
      class="fixed duration-100 inset-0 p-4 bg-white z-10 overflow-auto border-t"
  >
    <div
        v-if="cfg.public.env !== 'production'"
        class="label bg-white cursor-pointer"
        @click="tabCount = 0"
    >Hide
    </div>
    <div class="divide-y divide-dashed text-xs font-mono">
      <div class="py-1" v-for="log in authStore.logs">
        {{ JSON.stringify(log) }}
      </div>
    </div>
  </div>
</template>
