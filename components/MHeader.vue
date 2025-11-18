<script setup lang="ts">
const route = useRoute()
const store = useGlobalStore()

const items = [
  {i: "house", n: "Home", t: "/"},
  {i: "storefront", n: "Shop", t: "/shop"},
  {i: "rank", n: "Report", t: "/report"},
  {i: "task", n: "Task", t: "/task"},
]
</script>

<template>
  <div class="has-star mobile-menu label grid-cols-5 text-2xs">
    <nuxt-link
        v-for="item in items" class="item" :to="item.t" active-class="active"
        :class="{'active': '/' + route.path.split('/')[1] == item.t}"
    >
      <NuxtIcon :name="item.i" class="size-6"/>
      <span>{{ item.n }}</span>
    </nuxt-link>
    <DropdownMenu v-if="store.loggedIn">
      <DropdownMenuTrigger as-child>
        <div class="item">
          <NuxtIcon name="chevron-double-up" class="size-6"/>
          <span>Menu</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" class="text-base min-w-52">
        <DropdownMenuLabel class="label text-xs">Menu</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem as-child>
          <nuxt-link to="/house">Duck House</nuxt-link>
        </DropdownMenuItem>
        <DropdownMenuItem as-child>
          <nuxt-link to="/achievement" class="">
            <span>Achievement</span>
          </nuxt-link>
        </DropdownMenuItem>
        <DropdownMenuItem as-child>
          <nuxt-link to="/leaderboard">
            <span>Leaderboard</span>
          </nuxt-link>
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
</template>

<style scoped>
.mobile-menu {
  width: 100%;
  display: grid;
  justify-content: center;
  align-items: center;
}

.mobile-menu .item {
  display: flex;
  gap: 4px;
  padding: 10px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.mobile-menu .item.active {
  color: #E69B36;
}

.mobile-menu .item.active:before {
  content: "";
  position: absolute;
  width: 4px;
  height: 4px;
  background: #E69B36;

  top: 2px;
  border-radius: 50%;
}
</style>
