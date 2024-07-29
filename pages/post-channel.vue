<script setup lang="ts">
import {Checkbox} from '~/components/ui/checkbox'
import {Button} from "~/components/ui/button";
import {CheckCircledIcon} from "@radix-icons/vue";
import {useToast} from "~/components/ui/toast";
import * as lodash from "lodash";

const {cloneDeep} = lodash
const {toast} = useToast()
const form = ref({
  text: "",
  photo: "",
  is_test: true,
})
const buttons = ref<{ text: string, url: string }[][]>([])
const currentRow = ref(0)
const isSucceed = ref(false)
const isSending = ref(false)
const reset = () => {
  form.value.text = ""
  form.value.photo = ""
}

const botToken = '7054965058:AAEgJ63FL5S086KYmD37PF9LL-sS4cklaHA'

const channelID = computed(() => form.value.is_test ? "-1002157260678" : "-1002157260678")

const send = async () => {
  if (isSending.value) {
    return
  }
  if (buttons.value.length > 0 && buttons.value.filter(x => (x.length == 0 || x.filter(y => !y.url || !y.text).length)).length) {
    toast({
      title: "Lỗi nhập liệu",
      description: "Button đếu đúng format"
    });
    return
  }
  isSending.value = true
  const body = cloneDeep({
    chat_id: channelID.value,
    "parse_mode": "HTML",
    "disable_web_page_preview": true,
    "disable_notification": false,
    ...form.value,
    ...buttons.value.length ? {
      "reply_markup": {
        "inline_keyboard": buttons.value
      }
    } : {}
  })
  const method = body.photo ? "sendPhoto" : "sendMessage"
  if (body.photo) {
    body.caption = body.text
  }
  const url = `https://api.telegram.org/bot${botToken}/${method}`
  const response = await $fetch(url, {
    method: "POST",
    body: body
  })
  console.log(response);
  isSending.value = false
  toast({
    title: response ? "Ok rồi đấy!" : "Lỗi mẹ rồi, F12 xem lỗi gì hộ cái!",
    description: response ? 'Keep it up!' : 'Please retry!',
  });
}

const addButton = () => {
  buttons.value[currentRow.value].push({
    text: "",
    url: ""
  })
}

const addRow = () => {
  buttons.value.push([
    {
      text: "",
      url: ""
    }
  ])
  currentRow.value = buttons.value.length - 1
}
</script>

<template>
  <div class="max-w-sm w-full mx-auto py-8 space-y-3">
    <textarea v-model="form.text" class="border p-3 rounded bg-gray-900/40 w-full outline-none"/>
    <div class="flex gap-2 items-center px-3 p-2 border rounded-md">
      <input v-model="form.photo" class="flex-1 outline-none bg-transparent" placeholder="Image"/>
    </div>
    <div class="border rounded-md p-2 space-y-2">
      <div
          v-for="(row, i) in buttons" class="border rounded p-2 space-y-1" @click="currentRow = i"
          :class="{'border-blue-500': currentRow === i}">
        <div class="flex justify-between text-2xs uppercase font-bold">
          <div class="">Row: {{ i + 1 }}</div>
          <div class="text-red-500 cursor-pointer" @click="buttons.splice(i , 1)">delete</div>
        </div>
        <div v-for="(btn, j) in row" :key="i" class="border rounded p-2 space-y-1 text-xs relative">
          <input v-model="btn.text" class="w-full outline-none p-1 bg-transparent" placeholder="Text">
          <input v-model="btn.url" class="w-full outline-none p-1 bg-transparent" placeholder="Url">
          <div
              class="absolute text-2xs -top-1 right-0 px-1 font-bold uppercase border border-t-0 border-r-0 rounded-bl">
            <div class="text-red-500 cursor-pointer" @click="row.splice(j , 1)">delete</div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <Button class="text-xs font-semibold" variant="outline" size="xs" @click="addRow">Add row</Button>
        <Button class="text-xs font-semibold" variant="outline" size="xs" @click="addButton">Add button</Button>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <div>
        <div class="items-top flex space-x-2">
          <Checkbox :checked="form.is_test" @update:checked="form.is_test = $event" id="terms1"/>
          <label
              for="terms1"
              class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >is test</label>
        </div>
      </div>
      <div class="flex gap-2 items-center">
        <Button :variant='"outline"' class="gap-2" @click="reset">
          <span>Reset</span>
        </Button>
        <Button class="gap-2" :class="{'animate-pulse': isSending}" @click="send">
          <CheckCircledIcon v-if="isSucceed" class="w-4 h-4 text-green-500"/>
          <svg v-if="isSending" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
               fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isSucceed ? 'ReSend' : 'Send' }}</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-2xs {
  font-size: 10px;
}
</style>
