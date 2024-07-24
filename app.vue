<template>
  <div class="h-screen w-full max-w-md mx-auto flex flex-col">
    <div class="flex-1 w-full relative">
      <div class="absolute inset-0 overflow-auto">
        <nuxt-page/>
      </div>
    </div>
    <div class="w-full relative z-10 bg-white">
      <div class="menu md:pb-0 md:border-t-0 border-t text-sm bg-white bg-gray-50 grid grid-cols-2 font-semibold uppercase">
        <nuxt-link to="/" class="block p-4 flex justify-center items-center gap-1">
          <NuxtIcon name="home" class="w-5 h-5"/>
          <span>Home</span>
        </nuxt-link>
        <nuxt-link to="/invite" class="block p-4 flex justify-center items-center gap-1">
          <NuxtIcon name="hunter" class="w-5 h-5"/>
          <span>Friend</span>
        </nuxt-link>
      </div>
    </div>
  </div>
  <Toaster/>
</template>
<script setup lang="ts">
import WebApp from '@twa-dev/sdk'
import Toaster from '~/components/ui/toast/Toaster.vue'

useHead({
  title: "Delegram",
  link: [{
    href: "https://fonts.googleapis.com/css2?family=Syne+Mono&display=swap",
    rel: "stylesheet"
  }],
  meta: [
    {name: 'viewport', content: 'width=device-width, initial-scale=1'},
    {name: 'apple-mobile-web-app-status-bar-style', content: 'default'},
  ],
  script: []
})
const router = useRouter()
const route = useRoute()
const store = useGlobalStore()
const openDrawer = ref(false)
const openDrawerDelay = ref(false)

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
  store.loadInfo()
})

watch(() => route.path, () => {
  if (route.name !== 'index') {
    WebApp.BackButton.show();
  } else {
    WebApp.BackButton.hide();
  }
})

watch(() => store.drawer, () => {
  openDrawer.value = !!store.drawer;
})

watch(openDrawer, () => {
  setTimeout(() => {
    openDrawerDelay.value = openDrawer.value
    if (!openDrawer.value) {
      store.setDrawer(null)
    }
  }, 100)
  const body = document.querySelector('body')
  if (body) {
    if (openDrawer.value) {
      body.style.overflow = "hidden"
    } else {
      body.style.overflow = "auto"
    }
  }
})

openDrawer.value = !!store.drawer;
</script>

<style>
.menu a.router-link-active {
  @apply text-blue-500;
}
</style>
