<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const prop = defineProps({
  value: { type: String, required: true },
  textCopy: { type: String, default: 'Copy' },
  textCopied: { type: String, default: 'Copied' },
  classText: { type: String, default: '' },
  type: { type: String as PropType<'icon' | 'text' | 'button'>, default: 'icon', validator: (v: string) => ['icon', 'text', 'button'].includes(v) },
})

const { copy, copied, isSupported } = useClipboard()

function handleCopy() {
  copy(prop.value)
}
</script>

<template>
  <div
    v-if="isSupported"
    class="inline-flex cursor-pointer items-center hover:opacity-80 gap-1"
    @click="handleCopy"
  >
    <slot
      v-if="$slots.default"
      name="default"
      :copied="copied"
      :copy="handleCopy"
    />
    <span
      v-else-if="type === 'text'"
      :class="classText"
    >
      {{ copied ? prop.textCopied : prop.textCopy }}
    </span>
    <Button
      v-else-if="type === 'button'"
      class="min-w-[105px]"
      :class="classText"
    >
      {{ copied ? prop.textCopied : prop.textCopy }}
    </Button>
    <template v-else>
      <NuxtIcon
          :name="copied ? 'check' : 'copy'"
          :class="['size-4', classText, { 'text-blue-400': copied }]"
          class="text-base"
      />
      <span v-if="textCopy" :class="{ 'text-blue-400': copied }">{{ textCopy }}</span>
    </template>
  </div>
</template>
