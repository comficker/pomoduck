<script setup lang="ts">
const store = useGlobalStore()
</script>

<template>
  <div class="bg-gradient-to-r text-center via-yellow-200 p-2 px-4 font-semibold text-gray-500">
    <span v-if="store.isRunning && store.info.doing">{{ store.info.doing.name || 'Untitled' }}</span>
    <span v-else>Quack! <b>{{ store.info.username }}</b>!</span>
  </div>
</template>

<style scoped>

</style>
