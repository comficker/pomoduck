<script setup lang="ts">
import {Toaster} from '@/components/ui/sonner'
import Auth from "~/components/modal/Auth.vue";
import MergeAccount from "~/components/modal/MergeAccount.vue";
import {useAuthStore} from "~/stores/auth.store";
import PHeader from "~/components/PHeader.vue";
import MHeader from "~/components/MHeader.vue";

const route = useRoute()
const store = useGlobalStore()
const authStore = useAuthStore()
const cfg = useRuntimeConfig()

const tabCount = ref(0)
const theme = computed(() => getTheme())

function getTheme() {
  const dark_mode = store.info?.meta?.dark_mode || {is_auto: true, is_dark: false}
  if (!dark_mode.is_auto) {
    return dark_mode.is_dark ? 'dark' : 'light'
  } else {
    if (process.client) {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      return media.matches ? 'dark' : 'light'
    }
    return 'system'
  }
}

function switchTheme() {
  document.documentElement.classList.toggle('dark', getTheme() === 'dark')
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

watch(theme, () => {
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
    },
    {
      innerHTML: `
        (function() {
          const test = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const theme = '${theme.value}' === 'system' ? (test ? 'dark' : 'light') : '${theme.value}';
          document.documentElement.classList.toggle('dark', theme === 'dark');
        })();
      `,
      tagPosition: 'head'
    }
  ]
})
</script>

<template>
  <div class="wrapper w-full flex flex-col relative z-0 divide-y">
    <PHeader class="hidden md:block"/>
    <div class="md:px-4 flex-1">
      <div class="md:border-x has-star h-full max-w-3xl mx-auto relative">
        <div class="absolute inset-0 overflow-x-hidden overflow-auto no-scroll divide-y border-t md:border-t-0">
          <nuxt-page/>
        </div>
        <div
            v-if="tabCount > 5"
            class="absolute duration-100 inset-0 p-4 bg-white z-10 overflow-auto border-t"
        >
          <div
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
      </div>
    </div>
    <MHeader class="md:hidden!"/>
    <div class="md:px-4 uppercase font-bold text-2xs text-gray-500">
      <div class="md:border-x has-star max-w-3xl mx-auto flex justify-center md:justify-between">
        <div class="p-2 flex items-center gap-1" @click="tabCount++">
          <span>Version 1.0.0</span>
        </div>
        <div class="p-2 hidden md:flex items-center gap-1">
          <span>Powered by</span>
          <a class="size-4" target="_blank"
             href="https://world.org/mini-app?app_id=app_3a93096ed6e4f35613c5387f47a4266d">
            <NuxtIcon name="wld"/>
          </a>
          <a class="size-4" target="_blank" href="https://t.me/Pomoduck_bot">
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
</template>
