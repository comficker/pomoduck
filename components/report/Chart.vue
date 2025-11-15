<script setup lang="ts">
import {TooltipArrow, TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger} from 'reka-ui'
import {timeLeftStr} from "~/lib/utils";

const {data} = defineProps<{ data: { [key: string]: { egg: number, break: number, footprint: number, work: number } } }>()

const tooltipToggle = ref<{ [key: string]: boolean }>({})

const cr = computed(() => {
  const values = Object.keys(data).map(key => data[key].work)
  if (!values.length) return [];

  const max = Math.max(...values);
  const step = max / 5;

  return [step, step * 2, step * 3, step * 4];
})

function formatDateLocal(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getMonthShortName(monthIndex: number) {
  const shortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return shortNames[monthIndex];
}

const tables = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisSunday = new Date(today);
  const dayOfWeek = today.getDay();
  thisSunday.setDate(today.getDate() - dayOfWeek);

  let targetSunday;
  if (thisSunday < today) {
    targetSunday = new Date(thisSunday);
    targetSunday.setDate(thisSunday.getDate() + 7);
  } else {
    targetSunday = thisSunday;
  }
  targetSunday.setHours(0, 0, 0, 0);

  const startDate = new Date(targetSunday);
  startDate.setDate(startDate.getDate() - 111);
  startDate.setHours(0, 0, 0, 0);

  const dates = [];
  const cur = new Date(startDate);
  while (cur <= targetSunday) {
    dates.push(formatDateLocal(cur));
    cur.setDate(cur.getDate() + 1);
  }

  const parts = [];
  const months = [];
  const partSize = 28;
  const weekSize = 7;
  for (let i = 0; i < 4; i++) {
    const startIdx = i * partSize;
    const partDates = dates.slice(startIdx, startIdx + partSize);
    const weeks = [];
    for (let j = 0; j < 4; j++) {
      weeks.push(dates.slice(i * partSize + j * weekSize, i * partSize + (j + 1) * weekSize));
    }
    parts.push(weeks);
    const midDateStr = partDates[14];
    const [year, month, day] = midDateStr.split('-').map(Number);
    const monthShort = getMonthShortName(month - 1);

    months.push(monthShort);
  }

  const lastDateStr = dates[dates.length - 1];
  if (lastDateStr !== formatDateLocal(targetSunday)) {
    console.warn('Last date mismatch', lastDateStr, formatDateLocal(targetSunday));
  }

  return {
    parts,
    months
  };
})

const handleCLickToolTip = (day: string, val: boolean) => {
  if (window.innerWidth < 600) return
  tooltipToggle.value[day] = val
}
</script>

<template>
  <div class="space-y-2">
    <div class="label">Working activity</div>
    <div class="flex gap-2">
      <div class="w-4 flex flex-col text-2xs justify-between num">
        <div class="mb-2">_</div>
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
      <div class="flex-1 grid grid-cols-4 gap-2">
        <div v-for="(chunk, i) in tables.parts" class="">
          <div class="text-xs mb-2">{{ tables.months[i] }}</div>
          <div class="grid grid-cols-4 gap-0.5">
            <div v-for="week in chunk" class="">
              <TooltipProvider v-for="day in week" :delayDuration="100">
                <Tooltip :open="!!tooltipToggle[day]">
                  <TooltipTrigger
                      class="pt-full mb-0.5 relative" as="div"
                      @click="tooltipToggle[day] = !tooltipToggle[day]"
                      @mouseover="handleCLickToolTip(day, true)"
                      @mouseleave="handleCLickToolTip(day, false)"
                  >
                    <div
                        class="absolute inset-0 bg-black/10 md:rounded border hover:border-gray-500 duration-200"
                        :class="{
                          'border-0': data[day],
                          'c0': data[day] && data[day].work < cr[0],
                          'c1': data[day] && data[day].work > cr[0],
                          'c2': data[day] && data[day].work > cr[1],
                          'c3': data[day] && data[day].work > cr[2],
                          'c4': data[day] && data[day].work > cr[3]
                        }"
                    />
                  </TooltipTrigger>
                  <TooltipContent
                      class="z-20 text-black space-y-0.5 data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-grass11 select-none rounded-md bg-white px-[15px] py-[10px] text-sm leading-none shadow-sm border will-change-[transform,opacity]"
                  >
                    <p class="label">{{ day }}</p>
                    <template v-if="data[day]">
                      <div class="flex gap-0.5">
                        <NuxtIcon name="subdirectory" class="size-3"/>
                        <div>Focus time: <span class="font-bold">{{ timeLeftStr(data[day].duration) }}</span></div>
                      </div>
                      <div class="flex gap-0.5">
                        <NuxtIcon name="subdirectory" class="size-3"/>
                        <div class="flex items-center gap-1">
                          <span>Footprint:</span>
                          <span class="font-bold n">{{ data[day].footprint }}</span>
                          <NuxtIcon name="footprint" class="size-4" filled/>
                        </div>
                        <div class="flex items-center gap-1">
                          <span>Eggs:</span>
                          <span class="font-bold n">{{ data[day].egg }}</span>
                          <NuxtIcon name="egg" class="size-4" filled/>
                        </div>
                      </div>
                    </template>
                    <TooltipArrow
                        class="fill-white stroke-gray-200"
                        :width="12"
                        :height="6"
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.c0 {
  background: #ebedf0;
}

.c1 {
  background: #9be9a8;
}

.c2 {
  background: #40c463;
}

.c3 {
  background: #30a14e;
}

.c4 {
  background: #216e39;
}
</style>
