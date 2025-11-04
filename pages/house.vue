<script setup lang="ts">
import {toast} from "vue-sonner";

const route = useRoute()
const store = useGlobalStore()

const coming = () => {
  toast.info("Coming Soon!")
}

useHead({
  title: "Duckhouse"
})
</script>

<template>
  <div class="px-4 space-y-4">
    <div class="label">Duck house</div>
    <div class="grid grid-cols-2 gap-3">
      <div class="border rounded">
        <div class="pt-full relative">
          <div class="absolute inset-4 center">
            <div class="size-16">
              <img src="/icon/thunder.png" alt="">
            </div>
          </div>
        </div>
        <div class="p-3 pt-0 space-y-2 relative z-10">
          <div class="flex justify-between label">
            <div>Boost</div>
            <div>{{store.info.boost_balance}}</div>
          </div>
          <Button class="w-full" @click="coming">Purchase</Button>
        </div>
      </div>
      <div class="border rounded">
        <div class="pt-full relative">
          <div class="absolute inset-4 center">
            <NuxtIcon filled name="eggs" class="size-32"/>
          </div>
        </div>
        <div class="p-3 pt-0 space-y-2 relative z-10">
          <div class="flex justify-between label">
            <div>Egg</div>
            <div>{{store.info.egg}}</div>
          </div>
          <Button class="w-full" @click="coming">Hatching</Button>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div
          v-for='i in ["common","uncommon", "rare", "epic", "legendary", "mythical"]'
          class="border rounded"
      >
        <div class="pt-full relative">
          <div class="absolute inset-4 center">
            <NuxtIcon filled :name="`duck/${i}`" class="size-32"/>
          </div>
        </div>
        <div class="flex justify-between p-3 label">
          <div>{{ i }}</div>
          <div>0</div>
        </div>
      </div>
    </div>
  </div>
</template>
