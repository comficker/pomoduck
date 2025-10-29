<script setup lang="ts">
import {formatFloat} from "~/lib/utils";
import {toast} from "vue-sonner";

const route = useRoute()
const store = useGlobalStore()

const label = ref(route.query.type || 'EGG')

const balance = computed(() => {
  return label.value === 'EGG' ? store.info.balance : store.info.boost_balance
})

const purchase = () => {
  toast.info("Coming Soon!")
}
</script>

<template>
  <div class="px-4 space-y-4">
    <div class="label text-center">Balance</div>
    <div class="tabs justify-center">
      <div
          v-for="item in ['EGG', 'Boost']"
          class="tab"
          :class="{'active': label === item}"
          @click="label = item"
      >{{ item }}
      </div>
    </div>
    <div class="text-7xl num text-center font-bold">{{ formatFloat(balance, 0, 2)}}</div>
    <div v-if="label === 'Boost'" class="flex justify-center gap-4">
      <Button class="w-48 items-center gap-2" variant="link" @click="purchase">
        <span class="text-lg">Purchase</span>
        <NuxtIcon name="open" class="size-6"/>
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
