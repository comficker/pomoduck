import {type UseFetchOptions, useFetch} from '#app'
import {defu} from 'defu'
import useStatefulCookie from "~/composables/useStatefulCookie";

export function useAuthFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
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
    return useFetch(url, params)
}
