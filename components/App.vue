<script setup lang="ts">
import {RibbonIcon, Gamepad2Icon} from "lucide-vue-next";
import type {Project} from "~/types";

const {app} = defineProps<{ app: Project }>()
</script>

<template>
  <div class="app">
    <nuxt-link :to="`/app/${app.id}`" class="flex items-center gap-4 py-3 px-4">
      <div class="w-14 h-14">
        <img
            v-if="app.media"
            class="rounded"
            :src="app.media"
            :alt="app.name"
        >
      </div>
      <div class="flex-1 space-y-1">
        <h4 class="leading-5 line-clamp-2	">
          <span class="font-bold">{{ app.name }}</span>
          <span class="text-gray-400"> - {{ app.description }}</span>
        </h4>
        <div class="flex -mx-1.5 items-center uppercase font-semibold text-2xs text-gray-500">
          <div class="p-0.5 px-1.5 flex items-center gap-0.5" :class="{'text-green-600': app.is_verified}">
            <RibbonIcon class="w-3 h-3"/>
            <span>Verified</span>
          </div>
          <div v-for="item in app.tags" :key="item.name" class="p-0.5 px-1.5 flex items-center gap-0.5">
            <NuxtIcon :name="item.icon ? item.icon: 'tag'" class="w-3 h-3"/>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<style scoped>
</style>
