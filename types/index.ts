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
    checkin_day: number
    checkin_last_time: string
    balance: number
    meta: any,
    boost_level: number
    boost_balance: number
    doing?: ITask,
    is_staff: boolean
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
}

export interface AccountTask {
    status: number;
    start_at: string | null
    finished_at: string | null
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
