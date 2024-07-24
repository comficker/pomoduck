import {type UseFetchOptions} from '#app'
import {defu} from 'defu'
import useStatefulCookie from "~/composables/useStatefulCookie";

export function useNativeFetch<T>(url: string, options: any): Promise<T> {
    const config = useRuntimeConfig()
    const authData = useStatefulCookie('auth_data')
    const defaults: UseFetchOptions<T> = {
        baseURL: <string>config.public.api + "/" + <string>config.public.apiVersion,
        key: url,
        headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json; indent=2'
        },
        query: {
            ...options.query,
            auth_data: authData.value
        }
    }

    const params = defu(options, defaults)
    return $fetch(url, params)
}
