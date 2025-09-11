<script setup lang="ts">

import {Switch} from "~/components/ui/switch";
</script>

<template>
  <div class="w-full h-full p-4 flex flex-col relative gap-6">
    <div class="space-y-3">
      <div class="label">Settings</div>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="font-semibold">Notify</span>
          <Switch />
        </div>
        <div class="space-y-2 flex-1">
          <div class="flex justify-between">
            <div class="flex gap-2">
              <NuxtIcon name="subdirectory" class="size-5"/>
              <span class="font-semibold">In app</span>
            </div>
            <Switch />
          </div>
          <div class="flex justify-between">
            <div class="flex gap-2">
              <NuxtIcon name="subdirectory" class="size-5"/>
              <span class="font-semibold">Telegram</span>
            </div>
            <Switch />
          </div>
          <div class="flex justify-between">
            <div class="flex gap-2">
              <NuxtIcon name="subdirectory" class="size-5"/>
              <span class="font-semibold">Extension</span>
            </div>
            <Switch />
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <span class="font-semibold">Sound</span>
        <Switch />
      </div>
      <div class="flex justify-between">
        <span class="font-semibold">Haptic Feedback</span>
        <Switch />
      </div>
    </div>
    <div class="space-y-3">
      <div class="label">Connected</div>
      <div class="space-y-2">
        <div class="flex justify-between">
          <span class="font-semibold">Google</span>
          <Button variant="outline" size="sm">Connect</Button>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">Telegram</span>
          <Button variant="outline" size="sm">Connect</Button>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold">X</span>
          <Button variant="outline" size="sm">Connect</Button>
        </div>
      </div>
    </div>
    <hr>
    <Button size="lg" variant="destructive" class="rounded-full">Logout</Button>
  </div>
</template>
