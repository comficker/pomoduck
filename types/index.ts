export interface Links {
  "next": string | null
  "previous": string | null
}

export interface APIResponse<T> {
  "links": Links
  "count": number
  "page_size": number
  "num_pages": number
  "results": T[]
}

export interface Account {
  id: number
  username: string
  first_name: string
  last_name: string
  balance: number
  egg: number
  footprint: number
  twitter_username: string
  total_focus: number
}

export interface Info {
  id: number,
  tg_id: number,
  username: string
  first_name: string
  last_name: string
  balance: number
  meta: any,
  doing?: ITask,
  inviter?: number
  is_staff: boolean
  day_streak: number
  footprint: number
  egg: number
  egg_extra: number
  total_focus: number
  total_break: number
  joined: string
}

export interface ITask {
  id: number
  name: string
  creator: number
  description: null
  type: string
  is_active: boolean
  account_task: AccountTask[]
  meta: {
    "action": string
    "url": string
  }
  reward_amount: number
  reward_type: string
  duration_est: number
  unit: number
  status: number
  tag: string
}

export interface AccountTask {
  id: number
  status: number
  start_at: string | null
  finished_at: string | null
  boost_amount: number
}

export interface AccountTaskDetail {
  id: number
  task: ITask
  start_at: string | null
  finished_at: string | null
  status: number;
}

export interface Tag {
  "name": string,
  "id_string": string
  "icon": string,
}

export interface AuthDataInput {
  "username": string,
  "email": string
  "password": string
  "re_password"?: string
  "invite_code"?: string
}

export interface Achievement {
  "name": string
  "description": string
  "id_string": string
  "condition": string
  "rarity": string
  "claimed": null | { xp: number, egg: number, footprint: number }
}

export interface IShopItem {
  circulating_supply: number
  description: string
  id: number
  id_string: string
  label: string
  max_supply: number
  name: string
  price: number
  base_rent_fee: number
  for_sale_count: number
  for_rent_count: number
  current_status: {
    can_buy: boolean
    can_sell: boolean
    can_rent: boolean
    can_equip: boolean
    own: number
    rent: string | null
    is_equipped: boolean
    has_active: boolean
  }
  meta: any
}

export interface IAccountItem {
  'id': number
  'uid': string
  'status': number
  'rent_expired': string | null
  'account': number
  'renter': number
  'sell_price': number
  'rent_fee': number
}

export interface IPaymentData {
  "tx_id": string,
  "network": string,
  "payTo": string,
  "asset": "USDC",
  "resource": string,
  "amount": number
  "description": string,
}
