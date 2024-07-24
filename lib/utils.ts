import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'
import type {Updater} from '@tanstack/vue-table'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatFloat(num: any, digits: number = 4) {
    return num?.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: digits}) || 0
}

export function shortAddress(address: string): string {
    return address.substring(0, 4) + '......' + address.substring(address.length - 5, address.length)
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
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    return {
        days, hours, minutes, seconds
    }
}

export const timeSince = (str: string) => {
    const now = new Date().getTime() / 1000
    const d = new Date(str).getTime() / 1000
    return timeLeftStr(now - d)
}

export const timeLeftStr = (distance: number) => {
    const obj = calculateTimeDistance(distance * 1000)
    let str = ''
    if (obj.days) {
        str += `${obj.days}d`
    }
    if (obj.hours) {
        str += `${obj.hours}h`
    }
    if (obj.minutes) {
        str += `${obj.minutes}m`
    }
    if (obj.seconds) {
        str += `${obj.seconds}s`
    }
    return str
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
    ref.value = typeof updaterOrValue === 'function'
        ? updaterOrValue(ref.value)
        : updaterOrValue
}


export function timeSince2(d: string) {
    const date = new Date(d)
    const seconds = Math.floor(((new Date().getTime()/1000) - date.getTime() / 1000))

    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) return interval + "y";

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + "m";

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d";

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h";

    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + " m";

    return Math.floor(seconds) + "s";
}
