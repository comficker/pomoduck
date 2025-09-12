<script setup lang="ts">
import {Button} from "~/components/ui/button";
import '@worldcoin/idkit-standalone'

const openConnect = async () => {
  window.IDKit.init({
    app_id: 'app_3a93096ed6e4f35613c5387f47a4266d',
    action: 'test-action',
    action_description: 'Test action description',
    show_modal: true,
    container_id: 'idkit-container',
    verification_level: 'device',
    disable_default_modal_behavior: true,
    handleVerify: async (response: any) => {
      console.log(response);
    },
    onSuccess: (response: any) => {
      console.log('Verification successful:', response)
    },
  })
  await window.IDKit.open()
}
</script>

<template>
  <Button variant="outline" size="lg" class="w-full justify-start items-center gap-2 px-3 font-semibold" @click="openConnect">
    <NuxtIcon filled name="wld" class="size-5"/>
    <span>Continue with WorldCoin</span>
  </Button>
</template>

<style scoped>

</style>
