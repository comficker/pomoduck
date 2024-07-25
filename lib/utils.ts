import {type ClassValue, clsx} from 'clsx'
import {twMerge} from 'tailwind-merge'
import type {Updater} from '@tanstack/vue-table'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatFloat(num: any, digits: number = 4) {
    return num?.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: digits}) || 0
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
