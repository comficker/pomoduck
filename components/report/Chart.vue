<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
</script>

<template>
  <div class="space-y-2">
    <div class="label">Working activity</div>
    <div class="grid grid-cols-4 gap-1">
      <div v-for="k in 4" class="grid grid-cols-4 gap-1">
        <div v-for="i in 4" class="space-y-1">
          <TooltipProvider v-for="j in 7">
            <Tooltip>
              <TooltipTrigger class="pt-full relative" as="div">
                <div class="absolute inset-0 bg-gray-100 rounded border border-gray-200/50 hover:border-gray-500 duration-200"></div>
              </TooltipTrigger>
              <TooltipContent class="z-20 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-grass11 select-none rounded-md bg-white px-[15px] py-[10px] text-sm leading-none shadow-sm border will-change-[transform,opacity]">
                <p>Add to library</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  </div>
</template>
