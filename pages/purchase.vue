<script setup lang="ts">
import {formatFloat} from "~/lib/utils";
import type {APIResponse, IShopItem} from "~/types";
import {type PayCommandInput, Tokens, tokenToDecimals} from "@worldcoin/minikit-js";

const {$logging} = useNuxtApp()

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

const pay = async (id: number) => {
  // const response = await useNativeFetch<any>(`/items/${id}/pay`, {
  //   method: "POST",
  // })
  // if (!response) return;
  try {
    const payload: PayCommandInput = {
      reference: "test",
      to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      tokens: [
        {
          symbol: Tokens.USDC,
          token_amount: tokenToDecimals(0.11, Tokens.USDC).toString(),
        },
      ],
      description: 'Test example payment for minikit',
    }

    $logging(JSON.stringify(payload))

    if (!window.MiniKit || !window.MiniKit.isInstalled()) {
      return
    }

    const {finalPayload} = await window.MiniKit.commandsAsync.pay(payload)
    $logging(JSON.stringify(payload))
    $logging(JSON.stringify(finalPayload))
  } catch (error) {
    $logging(JSON.stringify(error))
  }
}
</script>

<template>
  <div class="p-4 py-3 gap-4 label flex items-center">
    <h1 class="cursor-pointer text-primary flex-1">Duckshop</h1>
    <NuxtIcon name="info" class="size-8"/>
    <Button @click="pay(1)">
      Test
    </Button>
  </div>
  <div class="p-4 text-black">
    <div
        v-if="starterPack"
        class="border-8 bg-[#F7E5BB] border-[#EBBA48] flex md:flex-row md:items-end gap-6 p-4 flex-col-reverse"
    >
      <div class="flex-1">
        <div class="relative mx-auto">
          <div class="absolute -top-4 -left-4">
            <img class="size-16" src="/shop/best.svg" alt="">
          </div>
          <img class="w-1/3 md:w-2/3 -mb-4" src="/shop/chest.png" alt="">
        </div>
      </div>
      <div class="flex-1 md:w-1/2">
        <div class="text-2xl uppercase font-bold">Starter pack</div>
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
      <div class="md:w-28 flex md:flex-col text-white text-center md:py-4 md:gap-2 gap-4 text-sm">
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
          @click="pay(item.id)"
      >
        <div class="flex items-center relative z-10 p-4 md:py-0 gap-3">
          <div class="md:w-1/3">
            <img class="size-20 md:size-40 mx-auto" :src="`/shop/${item.id_string}.png`" alt="">
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-4">
              <div class="md:text-2xl content font-bold">{{ item.name }} Pack</div>
            </div>
            <div class="num text-3xl md:text-5xl">{{ formatFloat(item.meta?.exchange_footprint || 0) }}</div>
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
