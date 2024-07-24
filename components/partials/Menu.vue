<template>
  <div class="menu bg-black grid grid-cols-3 text-center items-center justify-center text-sm text-[#4D4D4F]">
    <nuxt-link to="/" class="block cursor-pointer">
      <NuxtIcon class="mx-auto w-6" alt="" name="home"/>
      <span>Home</span>
    </nuxt-link>
    <nuxt-link to="/quest" class="block cursor-pointer">
      <NuxtIcon class="mx-auto w-6" alt="" name="quest"/>
      <span>Quests</span>
    </nuxt-link>
    <nuxt-link to="/friend" class="block cursor-pointer">
      <NuxtIcon class="mx-auto w-6" alt="" name="friend"/>
      <span>Referral</span>
    </nuxt-link>
  </div>
</template>

<style>
.menu a.router-link-exact-active svg {
  color: #0066FF;
}

.menu a.router-link-exact-active span {
  color: #FFFFFF;
}
</style>

