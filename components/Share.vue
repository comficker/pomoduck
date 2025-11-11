<script setup lang="ts">
const {$openLink} = useNuxtApp()
const props = defineProps<{ url: string, title: string }>()

function share() {
  $openLink(`https://t.me/share/url?url=https://${props.url}&text=${props.title}`)
}
</script>

<template>
  <Button class="gap-2 h-10 w-full" @click="share">
    <NuxtIcon name="mate" class="w-6 h-6"/>
    <span>Invite</span>
  </Button>
</template>

<style scoped>

</style>
