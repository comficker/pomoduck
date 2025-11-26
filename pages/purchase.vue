<script setup lang="ts">
import {formatFloat} from "~/lib/utils";
import type {APIResponse, IPaymentData, IShopItem} from "~/types";
import {type PayCommandInput, Tokens, tokenToDecimals} from "@worldcoin/minikit-js";
import {toast} from "vue-sonner";

const {$logging} = useNuxtApp()
const authStore = useAuthStore()
const {data} = useAuthFetch<APIResponse<IShopItem>>('/items/', {
  query: {
    label: "shop",
    page_size: 4
  },
  key: "shop_purchase"
})

const starterPack = computed(() => {
  return data.value?.results.filter(x => x.id_string === 'starter-pack')[0] || null
})
const method = computed(() => {
  switch (authStore.activeAuth) {
    case 'telegram':
      return 'ton'
    case 'wld':
      return 'wld'
    default:
      return 'base'
  }
})
const pay = (id: number, payload: any = undefined) => {
  useNativeFetch<any>(`/items/${id}/pay`, {
    method: "POST",
    body: {
      method: method.value,
      payload
    }
  }).catch(async e => {
    if (e.data.accepts) {
      const paymentData: IPaymentData = e.data.accepts
      let payloadData;
      $logging(JSON.stringify(paymentData))
      if (paymentData.network === "wld") {
        if (!window.MiniKit || !window.MiniKit.isInstalled()) return;
        const payload: PayCommandInput = {
          reference: paymentData.tx_id,
          to: paymentData.payTo,
          tokens: [
            {
              symbol: Tokens[<"USDC">paymentData.asset.toUpperCase()],
              token_amount: tokenToDecimals(paymentData.amount, Tokens.USDC).toString(),
            },
          ],
          description: paymentData.description,
        }
        $logging(JSON.stringify(payload))
        payloadData = await window.MiniKit.commandsAsync.pay(payload)
            .then(({finalPayload}) => finalPayload)
            .catch((e) => {
              $logging(e)
              return null
            })
      }
      if (payloadData) {
        $logging(JSON.stringify(payloadData))
        return pay(id, payloadData)
      }
    } else {
      toast.error("Your payment was failed!", {
        description: "Please try again!",
      })
    }
    return false
  }).then(() => {
    toast("Your payment is in processing!", {
      description: "Please wait few seconds!"
    })
    return true
  })
}
</script>

<template>
  <div class="p-4 py-3 gap-4 label flex items-center">
    <h1 class="cursor-pointer text-primary flex-1">Duckshop</h1>
    <NuxtIcon name="info" class="size-8"/>
  </div>
  <div class="p-4 text-black">
    <div
        v-if="starterPack"
        class="border-8 bg-[#F7E5BB] border-[#EBBA48] flex md:flex-row md:items-end gap-4 md:gap-8 py-6 p-4 flex-col-reverse"
    >
      <div class="md:w-1/3">
        <div class="relative mx-auto">
          <div class="absolute -top-4 -left-4">
            <img class="size-10 md:size-16" src="/shop/best.svg" alt="">
          </div>
          <img class="w-1/3 md:w-2/3 -mb-4" src="/shop/chest.png" alt="">
        </div>
      </div>
      <div class="md:w-1/2">
        <div class="text-2xl font-bold">{{ starterPack.name }}</div>
        <div class="text-[#505050] text-sm">
          Get {{ starterPack.meta.exchange_footprint }} footprint &
          {{ starterPack.meta.exchange_item }} random item
        </div>
        <div class="mt-2 flex">
          <div class="size-12 center border-2 border-[#EBBA48] bg-white flex-col">
            <NuxtIcon name="hat" class="size-4" filled/>
            <div class="text-xs">{{ starterPack.meta.exchange_item }}</div>
          </div>
          <div class="size-12 center border-2 border-[#EBBA48] bg-white flex-col ml-2 mr-4">
            <NuxtIcon name="footprint" class="size-4" filled/>
            <div class="text-xs">{{ starterPack.meta.exchange_footprint }}</div>
          </div>
          <div class="flex-1">
            <div class="btn center gap-1" @click="pay(starterPack.id)">
              <div class="font-bold text-lg">${{ starterPack.price }}</div>
              <div class="text-sm line-through text-gray-500">$32</div>
            </div>
          </div>
        </div>
      </div>
      <div class="md:w-32 flex md:flex-col text-white text-center md:py-4 md:gap-2 gap-4 text-sm">
        <div class="flex gap-2 items-center h-6 bg-black rounded-full">
          <NuxtIcon name="clock" class="-ml-2 size-7" filled/>
          <span class="pr-3">2d 34h</span>
        </div>
        <div class="flex gap-2 items-center h-6 bg-black rounded-full">
          <NuxtIcon name="chest" class="-ml-2 size-7" filled/>
          <span class="pr-3">{{ starterPack?.circulating_supply }}/{{ starterPack.max_supply }}</span>
        </div>
      </div>
    </div>
  </div>
  <div class="p-4 text-black">
    <div class="text-center flex center label text-xs">
      <div class="bg-white px-3 -mt-8 text-gray-400">Footprint pack</div>
    </div>
    <div class="grid gap-3">
      <div
          v-for="item in data?.results.filter(x => x.id_string != 'starter-pack')"
          class="item cursor-pointer bg-gradient-to-t from-[#F9F9F9] to-[#DEDEDE]"
      >
        <div class="flex items-center relative z-10 p-4 md:py-0 gap-3">
          <div class="md:w-1/3">
            <img class="size-20 md:size-40 mx-auto" :src="`/shop/${item.id_string}.png`" alt="">
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-4">
              <div class="md:text-2xl content font-bold">{{ item.name }} Pack</div>
            </div>
            <div class="num text-2xl md:text-5xl">{{ formatFloat(item.meta?.exchange_footprint || 0) }}</div>
          </div>
          <div class="md:w-1/3 center gap-2 content">
            <div class="btn center gap-1" @click="pay(item.id)">
              <div class="font-bold text-lg">${{ item.price }}</div>
            </div>
          </div>
        </div>
        <div class="absolute top-0 right-0">
          <img class="h-10" src="/shop/popular.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn {
  padding: 6px 32px;
  box-shadow: 0 6px 0 0 #000000;
  background-color: #FEC02D;
  border-radius: 40px;
  text-transform: uppercase;
  text-align: center;
  cursor: pointer;
}

.item {
  position: relative;
  border-top-right-radius: 20px;
}

.item:after {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  content: "";
  background: #E4E4E4;
  height: 48px;
}

.num {
  font-weight: 700;
  background: linear-gradient(#FFE98A, #FFC837);
  -webkit-background-clip: text;
  color: #FEDB0F;
  -webkit-text-stroke: 1px #8F2B0B;
  text-shadow: 0 4px 0 #C86F1A;
}
</style>
