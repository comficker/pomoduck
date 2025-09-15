import type {ClassValue} from "clsx"
import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatFloat(num: any, min: number = 0, max: number = 4) {
    return num?.toLocaleString('en-US', {minimumFractionDigits: min, maximumFractionDigits: max}) || 0
}

export function truncateAddress(address: string): string {
    return address.substring(0, 16) + '.....' + address.substring(address.length - 16, address.length)
}

export const copyContent = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Content copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

const calculateTimeDistance = (distance: number) => {
    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hh = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mm = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const ss = Math.floor((distance % (1000 * 60)) / 1000);
    return {
        d, hh, mm, ss
    }
}

export const timeLeftStr = (distance: number) => {
    const obj = calculateTimeDistance(distance * 1000)
    let str = ''
    if (obj.d) {
        str += `${obj.d}d`
    }
    if (obj.hh) {
        str += `${obj.hh}h`
    }
    if (obj.mm) {
        str += `${obj.mm}m`
    }
    if (obj.ss) {
        str += `${obj.ss}s`
    }
    return str
}

export const timeSinceStr = (str: string) => {
    const now = new Date().getTime() / 1000
    const d = new Date(str).getTime() / 1000
    return timeLeftStr(now - d)
}

export function timeSinceObject(d: string | number, isNegative: boolean = false) {
    const date = new Date(d)
    const seconds = Math.floor((new Date().getTime() - date.getTime())) * (isNegative ? -1 : 0)
    return calculateTimeDistance(seconds)
}

export function debounce<T extends Function>(cb: T, wait = 20) {
    let h = 0;
    let callable = (...args: any) => {
        clearTimeout(h);
        h = setTimeout(() => cb(...args), wait);
    };
    return <T>(<any>callable);
}

export function cloneDeep<T>(value: T): T {
    const visited = new WeakMap();

    function _clone(val: any): any {
        if (val === null || typeof val !== 'object') return val;

        if (visited.has(val)) return visited.get(val);

        if (val instanceof Date) return new Date(val.getTime());

        if (val instanceof RegExp) return new RegExp(val.source, val.flags);

        if (Array.isArray(val)) {
            const arr: any[] = [];
            visited.set(val, arr);
            for (let i = 0; i < val.length; i++) {
                arr[i] = _clone(val[i]);
            }
            return arr;
        }

        if (val instanceof Map) {
            const map = new Map();
            visited.set(val, map);
            for (const [key, v] of val.entries()) {
                map.set(_clone(key), _clone(v));
            }
            return map;
        }

        if (val instanceof Set) {
            const set = new Set();
            visited.set(val, set);
            for (const v of val.values()) {
                set.add(_clone(v));
            }
            return set;
        }

        if (val instanceof ArrayBuffer) {
            return val.slice(0);
        }
        if (ArrayBuffer.isView(val)) {
            return new (val.constructor as any)(val);
        }

        const obj: Record<string, any> = {};
        visited.set(val, obj);
        for (const key in val) {
            if (Object.prototype.hasOwnProperty.call(val, key)) {
                obj[key] = _clone(val[key]);
            }
        }
        return obj;
    }

    return _clone(value);
}

export function shortAddress(address: string): string {
    return address.substring(0, 3) + '...' + address.substring(address.length - 4, address.length - 1)
}
