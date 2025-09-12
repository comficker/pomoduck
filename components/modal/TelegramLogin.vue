<script setup lang="ts">
const authStore = useAuthStore()
const store = useGlobalStore()

onMounted(() => {
  window.onTelegramAuth = async (user) => {
    await authStore.authTelegram(user)
    await store.loadInfo(true)
  };
  const container = document.getElementById("telegram-login-container");
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://telegram.org/js/telegram-widget.js?19";

  script.setAttribute("data-telegram-login", "Pomoduck_bot");
  script.setAttribute("data-size", "large");
  script.setAttribute("data-userpic", "true");
  script.setAttribute("data-radius", "8")
  script.setAttribute("data-onauth", "window.onTelegramAuth(user)");
  script.setAttribute("data-request-access", "write");
  container?.appendChild(script);
})
</script>

<template>
  <div id="telegram-login-container"/>
</template>

<style scoped>

</style>
