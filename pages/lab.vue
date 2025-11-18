<script setup lang="ts">
const {$sendHaptic} = useNuxtApp()

const tapping = ref(false)
const tap = () => {
  $sendHaptic()
  tapping.value = true
  setTimeout(() => {
    tapping.value = false
  }, 500)
}
</script>

<template>
  <div class="h-full flex justify-center items-center flex-1">
    <NuxtIcon id="egg" :class="{'tapped': tapping}" name="egg" class="w-64" filled @click="tap"/>
  </div>
</template>

<style scoped>
#egg.tapped {
  animation: shake 0.5s;
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
</style>
