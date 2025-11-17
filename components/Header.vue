<script setup lang="ts">

import {formatFloat} from "~/lib/utils";

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
          <nuxt-link to="/shop">
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
        <DropdownMenu v-if="store.loggedIn">
          <DropdownMenuTrigger as-child>
            <div
                class="flex divide-x divide-gray-100 items-center justify-center bg-white text-yellow-500 shadow rounded-lg cursor-pointer"
            >
              <div class="hidden w-24 md:flex p-2 py-1 gap-2 items-center justify-center text-base">
                <NuxtIcon name="footprint" class="size-4" filled/>
                <span>{{ formatFloat(store.info.footprint, 0, 0) }}</span>
              </div>
              <div class="flex-1 p-1">
                <NuxtIcon name="chevron-down" class="size-5"/>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" class="text-base min-w-52">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem v-if="false">Profile</DropdownMenuItem>
            <DropdownMenuItem as-child>
              <nuxt-link to="/house">House</nuxt-link>
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <nuxt-link to="/settings">Settings</nuxt-link>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem @click="store.logout()">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button v-else @click="store.modalName = 'auth'">Login</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
