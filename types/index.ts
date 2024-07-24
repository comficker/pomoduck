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
    twitter_username: string
}

export interface Info {
    id: number,
    tg_id: number,
    username: string
    first_name: string
    last_name: string
    level: number
    checkin_day: number
    checkin_last_time: string
    last_claim: string
    balance: number
    meta: any,
    boost_level: number
    boost_balance: number
    is_running: boolean
}

export interface ITask {
    id: number
    name: string
    description: null
    type: string
    is_active: boolean
    account_task: AccountTask
    meta: {
        "action": string
        "url": string
    }
    reward_amount: number
    reward_type: string
}

export interface AccountTask {
    is_complete: boolean;
}

export interface Tag {
    "name": string,
    "id_string": string
    "icon": string,
}
