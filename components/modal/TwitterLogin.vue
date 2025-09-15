<script setup lang="ts">
import {Button} from "~/components/ui/button";

const connect = async () => {
  window.open(`${useRuntimeConfig().public.api}/v2/auth-twitter`, "_self")
}
</script>

<template>
  <Button variant="outline" size="lg" class="w-full justify-start items-center gap-2 px-3 font-semibold" @click="connect">
    <NuxtIcon filled name="x" class="size-5"/>
    <span>Continue with X</span>
  </Button>
</template>

<style scoped>

</style>
