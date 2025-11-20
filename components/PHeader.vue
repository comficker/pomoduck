<script setup lang="ts">
const route = useRoute()
const store = useGlobalStore()
</script>

<template>
  <div class="md:px-4">
    <div class="md:border-x has-star max-w-3xl w-full mx-auto flex gap-4 p-4 py-2 justify-between items-center">
      <div class="flex-1 flex gap-4 items-center">
        <div class="menu">
          <nuxt-link class="block" to="/">
            <NuxtIcon name="house" class="size-5"/>
            <span class="hidden md:block">Home</span>
          </nuxt-link>
          <nuxt-link to="/shop" :class="{'router-link-active': route.path.split('/')[1] == 'shop'}">
            <NuxtIcon name="storefront" class="size-5"/>
            <span class="hidden md:block">Shop</span>
          </nuxt-link>
        </div>
      </div>
      <div class="menu">
        <nuxt-link to="/leaderboard">
          <NuxtIcon name="leaderboard" class="size-5"/>
        </nuxt-link>
        <nuxt-link to="/achievement" class="">
          <NuxtIcon name="medal" class="size-5"/>
        </nuxt-link>
        <nuxt-link to="/task" class="">
          <NuxtIcon name="task" class="size-5"/>
        </nuxt-link>
        <nuxt-link to="/report" class="">
          <NuxtIcon name="rank" class="size-5"/>
        </nuxt-link>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <div
                class="flex divide-x divide-gray-100 items-center justify-center bg-white text-yellow-500 shadow rounded-lg cursor-pointer"
            >
              <div class="p-2 py-1">
                Menu
              </div>
              <div class="flex-1 p-1">
                <NuxtIcon name="chevron-down" class="size-5"/>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" class="text-base min-w-52">
            <DropdownMenuItem v-if="!store.loggedIn"  @click="store.modalName = 'auth'">Login</DropdownMenuItem>
            <template v-else>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuItem as-child>
                <nuxt-link to="/house">House</nuxt-link>
              </DropdownMenuItem>
              <DropdownMenuItem as-child>
                <nuxt-link to="/settings">Settings</nuxt-link>
              </DropdownMenuItem>
              <DropdownMenuSeparator/>
              <DropdownMenuItem @click="store.logout()">Logout</DropdownMenuItem>
            </template>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
