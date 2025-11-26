<script setup lang="ts">
import type {APIResponse, IAccountItem, IShopItem} from "~/types";
import {toast} from "vue-sonner";
import {formatFloat} from "~/lib/utils";
import {ACCOUNT_STATUS} from "~/lib/constants";

const store = useGlobalStore()
const route = useRoute()
const router = useRouter()

const STATUS_NAMES: any = {
  [ACCOUNT_STATUS.FOR_SALE]: "Selling",
  [ACCOUNT_STATUS.FOR_RENT]: "Leasing",
}

const page = ref(1)
const activeTab = ref(0)
const selected = ref<number[]>([])
const tabs = computed(() => ([
  {
    title: "Buy",
    val: {
      status: ACCOUNT_STATUS.FOR_SALE
    },
    amount: cloneItem.value?.for_sale_count || 0
  },
  {
    title: "Rent",
    val: {
      status: ACCOUNT_STATUS.FOR_RENT
    },
    amount: cloneItem.value?.for_rent_count || 0
  },
  {
    title: "Owned",
    val: {
      account_id: store.info.id
    },
    amount: (cloneItem.value?.current_status?.own || 0)
  }
]))
const total = ref(0)

const q = computed(() => ({
  page_size: 12,
  item__id_string: route.params.id,
  ...tabs.value[activeTab.value].val,
  page: page.value
}))

const {data: cloneItem} = useAuthFetch<IShopItem>(`/items/${route.params.id}/`)
const {data: accountItems, refresh, pending} = useAuthFetch<APIResponse<IAccountItem>>(`/account-items/`, {
  query: q
})

const actionData = computed(() => {
  switch (activeTab.value) {
    case 0:
      return {
        title: selected.value.length ? `Buy ${selected.value.length}`: "Buy one",
        act: 'buy',
        amount: cloneItem.value?.price || 0
      }
    case 1:
      return {
        title: isRenting.value ? "Extend": "Rent",
        act: cloneItem.value?.base_rent_fee || 0
      }
    case 2:
      return {
        title: selected.value.length ? `Sell ${selected.value.length}`: "Sell All",
        act: 'change-status',
        amount: 0
      }
    default:
      return null
  }
})

const isRenting = computed(() => {
  if (cloneItem.value?.current_status.rent)
    return (new Date(cloneItem.value.current_status.rent)) > new Date()
  return false
})

const changePage = (isNext = true) => {
  if (isNext) {
    if (page.value === accountItems.value?.num_pages) {
      page.value = 1
    } else {
      page.value++
    }
  } else {
    if (page.value == 1) {
      page.value = accountItems.value?.num_pages || 0
    } else {
      page.value--
    }
  }
}

const selectItem = (item: IAccountItem) => {
  if (activeTab.value === 1) {
    const renting = item.rent_expired ? new Date(item.rent_expired) > new Date() : false
    if (item.renter === store.info.id || renting || isRenting.value) {
      return;
    }
    if (selected.value.includes(item.id)) {
      selected.value = []
      total.value -= item.rent_fee
    } else {
      selected.value = [item.id]
      total.value = item.rent_fee
    }
    return
  }
  const test = selected.value.indexOf(item.id)
  if (test >= 0) {
    selected.value.splice(test, 1)
    total.value -= item.sell_price
  } else {
    selected.value.push(item.id)
    total.value += item.sell_price
  }
}

const sendAct = async (add_data: any = {}) => {
  if (!cloneItem.value) return;
  const data = await useNativeFetch<IShopItem>(`/items/${cloneItem.value.id}/${actionData.value?.act}`, {
    method: "POST",
    body: {
      ids: selected.value,
      ...add_data
    }
  }).catch((e) => {
    toast.error(e.data.code, {
      action: {
        label: 'Purchase',
        onClick: () => router.push('/purchase'),
      },
    })
    return null
  })
  if (data) {
    if (activeTab.value < 2 && actionData.value?.amount) {
      store.info.footprint -= actionData.value.amount
    }
    selected.value = []
    total.value = 0
    cloneItem.value = data
    await refresh()
  }
}

watch(activeTab, () => {
  selected.value = []
  page.value = 1
  total.value = 0
})
</script>

<template>
  <div v-if="cloneItem" class="p-4 py-2 gap-2 flex justify-between">
    <div class="flex items-center gap-2">
      <div class="size-6">
        <NuxtIcon filled :name="`${cloneItem.label}/${cloneItem.id_string}`"/>
      </div>
      <div class="font-semibold text-lg">{{ cloneItem.name }}</div>
    </div>
  </div>
  <div class="flex text-secondary label text-sm px-4 gap-3">
    <div
        v-for="(item, i) in tabs" class="py-2 flex justify-between gap-2 cursor-pointer "
        :class="{'text-primary': activeTab === i}"
        @click="activeTab = i"
    >
      <div>{{ item.title }}</div>
    </div>
    <div class="ml-auto py-2 flex gap-2">
      <span v-if="activeTab < 2">Available:</span>
      <span v-else>Total:</span>
      <span class="text-primary">{{tabs[activeTab].amount}}</span>
    </div>
  </div>
  <div
      v-if="!pending"
      class="label grid grid-cols-3 md:grid-cols-4 divide-x divide-y [&>div:nth-child(3n)]:border-r-0 md:[&>div:nth-child(3n)]:border-r-1 md:[&>div:nth-child(4n)]:border-r-0 [&>div:last-child]:border-b [&>div:last-child]:border-r">
    <div
        v-for="item in accountItems?.results" :key="item.id"
        class="cursor-pointer" :class="{'shadow-inner': selected.includes(item.id)}"
        @click="selectItem(item)"
    >
      <div class="pt-full relative">
        <div v-if="cloneItem" class="absolute inset-4 center">
          <NuxtIcon filled :name="`${cloneItem.label}/${cloneItem.id_string}`" class="size-32"/>
        </div>
        <div v-if="selected.includes(item.id)" class="absolute top-2 left-2 text-green-500">
          <NuxtIcon name="check" class="size-4"/>
        </div>
        <div v-if="activeTab === 2" class="absolute top-1 right-2 text-xs text-green-500">
          <div v-if="STATUS_NAMES[item.status]" class="label">{{ STATUS_NAMES[item.status] }}</div>
          <div v-else>{{ item.renter && item.renter === store.info.id ? 'Renting' : '' }}</div>
        </div>
      </div>
      <div class="flex justify-between border-t p-2 text-xs">
        <div class="">
          <div class="text-2xs text-secondary">ID</div>
          <div>{{ item.uid }}</div>
        </div>
        <div class="text-right">
          <div class="text-2xs text-secondary">Price</div>
          <div class="flex items-center justify-end gap-1">
            <NuxtIcon name="footprint" filled class="size-3"/>
            <span>{{ formatFloat(activeTab === 1 ? item.rent_fee : item.sell_price) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="h-screen"></div>
  <div
      v-if="accountItems?.count || selected.length"
      class="flex flex-col md:flex-row justify-between sticky bottom-0 inset-x-0 bg-background border-t label"
  >
    <div class="px-2 flex-1 flex items-center text-xs">
      <div class="flex-1 flex gap-2 items-center">
        <div class="p-2 cursor-pointer" @click="changePage(false)">
          <nuxt-icon name="chevron-left" class="size-5"/>
        </div>
        <div class="w-16 text-center">{{ page }}/{{ accountItems?.num_pages }}</div>
        <div class="p-2 cursor-pointer" @click="changePage(true)">
          <nuxt-icon name="chevron-right" class="size-5"/>
        </div>
      </div>
      <div v-if="activeTab < 2" class="flex items-center gap-1">
        <NuxtIcon name="footprint" filled class="size-3"/>
        <span>{{ formatFloat(total > 0 ? total : actionData?.amount) }}</span>
      </div>
      <div class="underline ml-3">
        <nuxt-link to="/purchase">Purchase</nuxt-link>
      </div>
    </div>
    <div class="p-2 border-t mb:border-t-0 grid gap-2" :class="{'grid-cols-3': activeTab === 2}">
      <template v-if="activeTab == 2">
        <Button
            variant="outline"
            class="px-8 label"
            @click="sendAct({status: ACCOUNT_STATUS.ACTIVE})"
        >{{ selected.length ? "Recall": "Recall all" }}
        </Button>
        <Button
            variant="outline"
            class="px-8 label"
            @click="sendAct({status: ACCOUNT_STATUS.FOR_RENT})"
        >{{ selected.length ? "Lease": "Lease all" }}
        </Button>
      </template>
      <Button
          class="px-8 label md:min-w-32"
          @click="sendAct(activeTab == 2 ? {status: ACCOUNT_STATUS.FOR_SALE}: {})"
      >{{ actionData?.title }}
      </Button>
    </div>
  </div>
</template>
