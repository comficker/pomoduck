<script setup lang="ts">
import TaskSwitch from "~/components/TaskSwitch.vue";
import {formatFloat} from "~/lib/utils";
import KnockButton from "~/components/KnockButton.vue";

const {$sendHaptic} = useNuxtApp()
const store = useGlobalStore()
const authStore = useAuthStore()

useHead({
  title: "Pomodoro Timer - PomoDuck Timer"
})

const holdStart = ref<Date | null>(null)
const now = ref<Date | null>(new Date())
const intervalId = ref<any>(null)
const timeoutId = ref<any>(null)

const holdPercent = computed(() => {
  if (now.value && holdStart.value) {
    return 100 * ((now.value.getTime() - holdStart.value.getTime()) / 2000)
  }
  return 0
})

const display2Digit = (num: number) => {
  if (num <= 9) {
    return `0${num}`
  }
  return num.toString()
}

const runTimer = async () => {
  if (store.isRunning) {
    return
  }
  $sendHaptic()
  await store.work()
}

const onMouseDown = () => {
  if (store.isRunning) {
    holdStart.value = new Date()
    now.value = new Date()
    intervalId.value = setInterval(() => {
      now.value = new Date()
    }, 100)

    timeoutId.value = setTimeout(async () => {
      if (intervalId.value) {
        clearInterval(intervalId.value)
      }
      if (holdStart.value) {
        await store.stop()
        holdStart.value = null
      }
    }, 2000)
  }
}

const onMouseUp = () => {
  holdStart.value = null
  now.value = null
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
  }
}

const retry = async () => {
  await authStore.authTelegram()
  if (window.MiniKit) {
    const result = window.MiniKit?.install()
    authStore.logging(JSON.stringify(result))
    if (window.MiniKit?.isInstalled())
      await authStore.authWithWorldCoin()
  }
  const isSuccess = await store.init()
  if (!isSuccess) {
    store.modalName = 'auth'
  }
}

onMounted(() => {
  if (window.itv) {
    clearInterval(window.itv)
  }
  store.computeTimer()
  window.itv = setInterval(() => store.computeTimer(), 500)
})
</script>

<template>
  <div id="timer" class="h-full flex flex-col justify-center gap-4 ">
    <div class="flex-1 text-center center flex-col relative">
      <div class="">
        <div class="absolute top-6 left-6 z-20">
          <KnockButton/>
        </div>
        <div class="absolute top-3 right-3 z-20 flex gap-4 text-primary">
          <div class="center font-bold gap-2">
            <NuxtIcon filled name="footprint" class="size-4"/>
            <div>{{ formatFloat(store.info.footprint) }}</div>
          </div>
          <div class="center font-bold gap-2">
            <NuxtIcon filled name="eggs" class="size-4"/>
            <div>{{ formatFloat(store.info.egg) }}</div>
          </div>
        </div>
      </div>
      <div class="w-full flex-1 overflow-hidden relative">
        <div class="absolute inset-0 md:-top-24">
          <div class="pt-full relative">
            <div id="bg" class="absolute inset-0"/>
            <div class="absolute inset-0 bg-gradient-to-b from-transparent dark:to-black to-white"/>
          </div>
        </div>
        <div class="h-full relative z-10 py-8 flex flex-col items-center justify-center">
          <div class="mx-auto size-40 md:size-48">
            <svg viewBox="0 0 237 215" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_67_1948)">
                <path d="M128.836 48.1722C128.836 48.1722 146.108 6.77193 152.457 4.23067C158.805 1.6894 162.364 -1.61133 191.32 4.23067C220.277 10.0727 230.184 9.30833 227.137 27.3455C224.089 45.3778 208.846 86.7829 208.846 86.7829C208.846 86.7829 201.481 116.757 198.686 127.171C195.892 137.584 175.318 161.458 169.223 163.24C163.128 165.017 74.2275 149.526 69.6561 147.744C65.0847 145.967 68.1323 140.631 72.4505 135.807C76.7687 130.982 95.5653 114.98 105.214 105.58C113.851 87.2892 128.836 48.1771 128.836 48.1771V48.1722Z" fill="#8A8C91" stroke="black" stroke-width="1.94733" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M213.759 123.456V177.85C213.759 179.301 214.937 180.479 216.388 180.479H218.778C220.219 180.479 221.392 179.315 221.407 177.874L221.889 124.469L213.759 123.451V123.456Z" fill="black" stroke="black" stroke-width="1.94733" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M153.654 186.632C156.755 186.968 159.895 188.424 159.842 189.383C159.798 190.167 157.593 191.024 155.86 191.247C154.623 191.398 153.586 191.228 152.89 191.973C152.481 192.406 152.389 192.932 152.345 193.219C151.707 197.401 151.391 199.49 150.738 199.864C150.091 200.239 148.611 199.626 145.149 195.921C144.307 196.33 142.998 196.953 141.367 197.64C138.09 199.012 136.445 199.689 135.934 199.183C134.921 198.19 137.706 193.906 138.037 193.404C139.711 190.858 141.649 189.159 143.071 188.103L138.188 178.205L137.389 176.667C139.473 176.375 141.43 173.814 143.582 173.171C144.171 175.299 146.264 182.694 146.853 184.821C146.921 185.079 147.029 185.182 147.072 185.25C147.608 186.058 153.654 186.637 153.654 186.637V186.632Z" fill="#F5C236" stroke="black" stroke-width="2.76034" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M85.522 165.796C84.0372 165.255 78.6723 163.313 77.9031 164.574C77.5526 165.143 78.2779 166.166 79.5632 167.953C81.0675 170.046 82.601 171.56 83.7061 172.548C83.3848 173.084 82.9807 173.882 82.6935 174.919C82.3284 176.263 82.0071 177.382 82.5377 178.22C83.2534 179.349 85.1131 179.364 86.116 179.374C88.3895 179.388 88.8714 178.463 90.0301 178.906C91.1206 179.325 91.0086 180.269 92.732 182.407C93.769 183.687 94.8449 185.026 95.5508 184.807C96.5439 184.49 96.8165 181.014 96.0473 177.967C95.2149 174.656 93.3308 172.353 94.4165 170.844C94.5236 170.693 94.6161 170.581 94.7475 170.489C96.5634 169.233 100.877 167.032 102.688 165.776C101.042 163.732 99.5574 161.604 98.3744 159.384L90.4001 168.011C89.2998 167.398 87.6349 166.565 85.5171 165.796H85.522Z" fill="#F5C236" stroke="black" stroke-width="2.76034" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M163.566 33.5721C163.591 33.5136 163.61 33.4552 163.634 33.3968C163.673 33.2069 163.634 33.3238 163.566 33.5721Z" fill="black" stroke="black" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M163.566 33.572C163.498 33.7473 163.43 33.9225 163.362 34.1027C162.743 36.6926 163.333 34.4045 163.566 33.572Z" fill="black" stroke="black" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M208.885 18.4851C206.821 15.014 202.206 16.567 199.139 17.3411C200.346 15.9049 201.135 14.2594 200.468 12.3559C196.242 9.63939 194.129 13.7288 192.533 17.2291C191.637 16.8542 193.039 17.3654 191.593 16.8056C190.142 16.2457 185.42 16.0558 183.361 16.1337C180.143 16.2506 173.994 19.3566 172.597 20.486C167.251 24.7994 165.548 28.4506 163.634 33.4066C163.586 33.6549 163.405 34.424 162.997 36.1231C161.244 43.411 162.743 61.2047 162.661 70.7126C162.661 71.1897 162.661 71.5889 162.661 71.915C162.578 72.6112 162.48 73.4242 162.378 74.3736C161.054 86.1793 151.809 105.326 140.588 119.328C136.157 122.663 133.621 122.706 131.401 123.266C124.074 125.126 122.005 124.24 115.832 126.504C106.363 129.829 96.242 136.615 95.2245 147.433C94.1194 161.293 105.492 175.099 119.084 178.171C128.787 180.43 138.83 177.387 145.729 173.361C157.31 166.774 163.245 154.857 159.579 141.727C158.109 136.104 155.003 131.455 159.267 124.761C179.028 102.469 191.671 83.2144 204.037 54.0629C206.149 49.0826 208.141 43.8637 208.511 38.1727C208.876 32.4816 207.065 27.1508 203.014 22.9543C202.698 22.7206 202.357 22.6135 202.109 22.3506C204.187 22.5502 210.589 21.3477 208.89 18.4851H208.885Z" fill="black" stroke="black" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M169.111 63.0644C167.957 62.9914 165.752 62.709 163.824 62.7869C161.828 62.8356 159.856 63.1131 157.88 63.3614C153.64 63.8336 147.491 64.5152 144.093 61.4919C142.389 59.9633 142.623 57.3879 144.755 56.2049C147.642 54.5887 151.356 54.4718 154.667 54.3404C162.641 54.3647 170.796 53.8049 178.429 56.6626C180.917 57.5729 183.463 58.9458 184.334 61.5796C185.887 65.9513 184.237 71.8907 179.525 73.4778C173.96 75.2547 167.957 72.8741 162.32 72.285C159.589 71.9345 156.454 71.769 154.263 70.4205C152.35 69.4127 151.069 66.5988 152.929 64.9582C154.185 63.8287 156.21 63.5366 158.377 63.2543C161.755 62.7042 165.723 62.3829 169.121 63.0596L169.111 63.0644Z" fill="#F5C236" stroke="black" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M162.953 54.0872C167.841 54.5108 172.943 51.0348 174.033 45.7867C174.14 45.2804 174.203 44.7838 174.228 44.2873C174.491 39.1901 170.757 34.6139 166.103 33.723C165.65 33.6402 165.182 33.5818 164.715 33.5721C160.64 33.426 156.317 35.9089 154.711 40.2417C152.685 45.7186 155.791 51.9938 160.932 53.6783C161.59 53.8925 162.261 54.0288 162.938 54.0872" fill="white"/>
                <path d="M162.953 54.0872C167.841 54.5108 172.943 51.0348 174.033 45.7867C174.14 45.2804 174.203 44.7838 174.228 44.2873C174.491 39.1901 170.757 34.6139 166.103 33.723C165.65 33.6402 165.182 33.5818 164.715 33.5721C160.64 33.426 156.317 35.9089 154.711 40.2417C152.685 45.7186 155.791 51.9938 160.932 53.6783C161.59 53.8925 162.261 54.0288 162.938 54.0872" stroke="black" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M164.983 41.7071C166.779 41.7509 168.566 41.6244 168.522 43.3818C168.478 45.1296 166.984 46.517 165.187 46.4683C163.391 46.4245 161.969 44.9689 162.013 43.2163C162.057 41.4637 163.182 41.6584 164.978 41.7022L164.983 41.7071Z" fill="black"/>
                <path d="M154.248 41.2397L173.605 42.5444" stroke="black" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M181.043 57.1007C181.944 57.6654 182.923 58.1085 183.96 58.4054C190.868 60.3917 198.944 55.5136 200.346 48.5373C201.398 43.299 198.414 38.2213 194.772 35.8261C188.531 31.7221 178.122 34.0394 175.309 41.3468C174.934 42.3107 174.715 43.3233 174.622 44.3554C174.242 48.7418 176.311 53.4592 179.865 56.2731C180.24 56.5749 180.635 56.8524 181.039 57.1056L181.043 57.1007Z" fill="white" stroke="black" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M185.152 42.8657C187.479 42.9241 189.797 42.7586 189.743 45.037C189.685 47.3056 187.752 49.0972 185.425 49.0388C183.098 48.9803 181.253 47.0914 181.311 44.8276C181.37 42.5639 182.825 42.8073 185.152 42.8657Z" fill="black"/>
                <path d="M175.62 42.89L199.767 44.1947" stroke="black" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M118.481 159.448C119.63 161.556 120.778 163.659 121.927 165.767C122.234 166.326 123.052 166.55 123.592 166.205C124.133 165.859 124.357 165.139 124.03 164.54C122.882 162.432 121.733 160.329 120.584 158.221C120.277 157.661 119.459 157.437 118.919 157.783C118.378 158.128 118.154 158.849 118.481 159.448Z" fill="white"/>
                <path d="M118.948 164.511C119.055 164.418 119.055 164.413 118.953 164.486C119.011 164.442 119.075 164.404 119.133 164.365C119.26 164.287 119.386 164.214 119.518 164.146C119.79 164.004 120.068 163.883 120.345 163.751C120.895 163.498 121.45 163.259 122 163.011C123.115 162.505 124.22 161.965 125.228 161.263C125.749 160.903 126.041 160.183 125.666 159.599C125.33 159.078 124.561 158.776 124.001 159.16C122.959 159.881 121.82 160.436 120.666 160.952C119.513 161.468 118.174 161.901 117.225 162.782C116.757 163.216 116.752 164.073 117.225 164.506C117.726 164.963 118.446 164.968 118.948 164.506V164.511Z" fill="white"/>
                <path d="M152.286 97.5321C153.469 96.2079 155.485 94.2606 158.484 92.6784C161.448 91.1157 164.17 90.5412 165.922 90.3124C168.021 90.0008 170.883 89.7915 174.242 90.1956C177.85 90.6288 180.781 91.3932 184.899 93.8955" stroke="white" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M76.8953 90.9794L60.8931 89.0759C60.8931 89.0759 14.2205 118.223 10.983 119.746C7.74559 121.27 2.78963 125.272 2.03017 127.175C1.27071 129.079 -1.587 132.126 7.17599 133.081C15.939 134.035 89.2803 144.322 92.3279 144.891C95.3755 145.461 173.863 155.748 173.863 155.748L192.533 157.841L216.728 133.266L235.208 109.265C235.208 109.265 234.639 106.027 233.305 105.648C231.971 105.268 185.298 99.3626 185.298 99.3626L76.9051 90.9794H76.8953Z" fill="#EEDDBF" stroke="black" stroke-width="1.94733" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M147.52 123.456C147.52 123.456 150.602 122.409 155.743 119.362C160.889 116.314 174.315 106.787 175.362 105.171C176.409 103.549 170.791 103.457 170.791 103.457L143.358 100.599L141.737 118.125L147.515 123.461L147.52 123.456Z" fill="#BCC2C2" stroke="black" stroke-width="1.94733" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M78.94 115.078C78.94 115.078 70.177 74.69 69.9238 72.9131C69.6707 71.1361 69.5441 69.1012 71.9539 69.2277C74.3686 69.3543 135.583 75.3229 137.74 75.3229C139.896 75.3229 140.407 77.4795 141.167 82.9418C141.931 88.4041 147.515 123.456 147.515 123.456L114.878 120.788L78.9351 115.073L78.94 115.078Z" fill="#BCC2C2" stroke="black" stroke-width="1.94733" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M185.659 97.4494C185.152 97.3228 181.214 90.0836 165.338 92.4983C149.463 94.913 150.986 109.007 151.113 109.518C151.24 110.029 154.287 111.3 156.064 107.488C156.064 107.488 156.57 110.282 163.177 107.488C169.783 104.693 177.655 98.2137 181.336 98.9781C185.021 99.7424 185.654 97.4543 185.654 97.4543L185.659 97.4494Z" fill="black" stroke="black" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M5.66199 133.246V187.64C5.66199 189.091 6.84012 190.269 8.29088 190.269H10.6812C12.1223 190.269 13.2955 189.105 13.3101 187.664L13.7921 134.259L5.66199 133.241V133.246Z" fill="black" stroke="black" stroke-width="1.94733" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M174.505 157.004V211.397C174.505 212.848 175.683 214.026 177.134 214.026H179.525C180.966 214.026 182.139 212.863 182.153 211.422L182.635 158.016L174.505 156.999V157.004Z" fill="black" stroke="black" stroke-width="1.94733" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M46.5267 139.346V163.328C46.5267 164.335 47.3446 165.148 48.3475 165.148H50.1828C51.1808 165.148 51.989 164.35 52.0036 163.352L52.3395 139.804L46.5219 139.346H46.5267Z" fill="black" stroke="black" stroke-width="1.94733" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M106.144 187.26C105.633 185.454 107.132 180.342 108.286 178.376C109.279 179.106 110.204 179.632 110.784 179.958C113.315 181.379 116.626 182.236 120.253 182.708C119.342 183.59 115.779 187.382 115.014 188.935C113.437 192.134 114.138 194.762 114.6 195.979C114.6 195.979 110.565 192.995 109.976 189.899C109.425 186.968 111.022 183.999 111.67 183.064C110.935 183.254 109.693 183.653 108.515 184.442C108.189 184.665 107.537 185.133 106.967 185.829C106.504 186.389 106.266 186.895 106.139 187.255L106.144 187.26Z" fill="black" stroke="black" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M117.838 94.1438C118.018 95.1613 118.967 100.458 115.414 104.109C112.682 106.909 108.978 107.021 107.206 107.079C105.687 107.128 103.36 107.196 101.067 105.823C97.8291 103.885 96.2469 100.015 96.2859 96.6899C96.354 91.0329 101.135 85.9406 106.563 85.3418C107.128 85.2786 111.46 84.8745 114.771 87.9805C117.132 90.2004 117.624 92.951 117.838 94.1438Z" fill="black" stroke="black" stroke-width="2.02036" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M100.283 99.2117C100.283 99.2117 101.402 96.5147 104.616 93.8274C107.829 91.1401 108.676 90.6727 108.617 91.9093C108.393 92.9219 107.434 94.2461 108.194 94.1097C108.953 93.9686 111.266 92.7563 112.254 92.474C113.242 92.1916 114.566 92.1624 113.919 92.9803C113.271 93.7982 110.058 96.3346 109.693 96.6705C109.328 97.0064 109.61 97.2352 111.188 97.1768C112.765 97.1184 114.089 97.206 113.753 97.8827C113.418 98.5594 106.597 100.361 104.849 100.843C103.102 101.32 100.667 101.831 100.293 99.2069" fill="#F7941D"/>
              </g>
              <defs>
                <clipPath id="clip0_67_1948">
                  <rect width="236.172" height="215" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div class="content text-7xl md:text-8xl font-bold flex gap-3 items-center text-left">
            <div class="grid grid-cols-2 gap-2">
              <div
                  v-for="(i, index) in display2Digit(store.timer.mm)" class="w-12 md:w-20 p-1"
                  :class="{'text-right': index == 0}"
              >
                <span>{{ i }}</span>
              </div>
            </div>
            <div>:</div>
            <div class="grid grid-cols-2 gap-2">
              <div v-for="(i, index) in display2Digit(store.timer.ss)" class="w-12 md:w-20 p-1"
                   :class="{'text-right': index == 0}">
                <span>{{ i }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full px-4 md:px-0">
        <TaskSwitch/>
      </div>
    </div>
    <div class="p-4 flex flex-col justify-center items-center">
      <div v-if="store.loggedIn" class="inline-flex w-3/4 md:w-1/2 mx-auto">
        <Button
            :variant="store.isRunning ? 'secondary': 'default'" size="lg"
            class="btn-timer"
            :class="{'animate-pulse': store.status}"
            @click="runTimer"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp"
            @touchstart="onMouseDown"
            @touchend="onMouseUp"
        >
          <div v-if="store.isRunning" class="absolute bg-black/60 inset-0 overflow-hidden">
            <div class="h-full w-full flex flex-nowrap">
              <div
                  class="h-full bg-[#313131] duration-200"
                  :style="{width: `${holdStart ? holdPercent : store.percent}%`}"
              />
              <div class="wave"/>
            </div>
          </div>
          <div class="flex gap-1 items-center relative z-10  uppercase text-base">
            <span v-if="store.status">...</span>
            <template v-else-if="store.percent >= 100">
              <span>Claim</span>
            </template>
            <span v-else-if="store.percent > 0">
              hold to give up
            </span>
            <span v-else>Start session</span>
          </div>
        </Button>
      </div>
      <Button v-else class="w-2/3 rounded-2xl h-12 text-xl relative overflow-hidden" @click="retry">
        Start session
      </Button>
      <div class="my-4 flex flex-col items-center justify-center gap-2 text-xs font-bold uppercase">
        <NuxtLink
            to="/boost"
            class="flex gap-1 cursor-pointer items-center text-yellow-500 relative"
        >
          <img class="size-4" src="/icon/thunder.png" alt="">
          <span>Boost</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
#bg {
  background-color: #DEDEDE;
  --first: #ededed;
  --second: #eeeeee;
}

#bg:before,
#bg:after {
  content: "";
  position: absolute;
  border-radius: 50%;
}

#bg:before {
  inset: 5%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, var(--first) 100%);
}

#bg:after {
  inset: 25%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, var(--second) 100%);
}

.dark #bg {
  background-color: rgba(29, 29, 29, 0.11);
  --first: #1D1D1DFF;
  --second: #1D1D1DFF;
}

.dark .dark\:to-black {
  --tw-gradient-to: var(--background);
}
</style>
