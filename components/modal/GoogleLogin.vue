<script setup lang="ts">
import {Button} from "~/components/ui/button";

const connect = async () => {
  window.open(`${useRuntimeConfig().public.api}/auth-google`, "_self")
}
</script>

<template>
  <Button variant="outline" size="lg" class="w-full justify-start items-center gap-2 px-3 font-semibold" @click="connect">
    <NuxtIcon filled name="google" class="size-5"/>
    <span>Continue with Google</span>
  </Button>
</template>

<style scoped>

</style>
