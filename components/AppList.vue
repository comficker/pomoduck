<script setup lang="ts">
import {FlameIcon, NewspaperIcon, ArrowDown} from "lucide-vue-next";
import App from "~/components/App.vue";
import {useNativeFetch} from "~/composables/useNativeFetch";
import type {APIResponse, Project} from "~/types";

const tabs = [{
  name: "Hot",
  key: "-score"
},{
  name: "New",
  key: "-id"
}]
const disableEarnAlert = useStatefulCookie("disableEarnAlert")
const ordering = ref('-score')
const data = ref<APIResponse<Project>>({
  "links": {
    next: null,
    previous: null,
  }, "count": 0, "page_size": 0, "num_pages": 1, "results": []
})
const fetchData = async () => {
  data.value = await useNativeFetch<APIResponse<Project>>('/projects', {
    query: {
      ordering: ordering.value
    }
  })
}

fetchData()

watch(ordering, () => fetchData())
</script>

<template>
  <div class="relative">
    <div class="sticky p-4 py-3 pt-4 bg-white top-0 mx-0">
      <div class="grid grid-cols-2 bg-gray-100 p-1.5 uppercase font-semibold">
        <div
            v-for="item in tabs" :key="item.key"
            class="cursor-pointer flex items-center gap-1 justify-center p-1.5 rounded"
            :class="{'bg-white text-blue-600bg-white text-blue-600': ordering == item.key}"
            @click="ordering = item.key"
        >
          <FlameIcon class="w-4 h-4"/>
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div v-if="!disableEarnAlert" class="duration-300 mx-4 p-3 py-1.5 text-sm bg-black text-white flex justify-between items-center">
      <div>Earn by support projects</div>
      <div class="text-gray-400 cursor-pointer" @click="disableEarnAlert = 'true'">Got it</div>
    </div>
    <App v-for="item in data.results" :key="item.id" :app="item"/>
  </div>
</template>

<style scoped>

</style>
