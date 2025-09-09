import type {SpinePlayer} from "@esotericsoftware/spine-player";
import {MiniKit} from '@worldcoin/minikit-js'

export {};

declare global {
    interface Window {
        itv: Timeout,
        sp: SpinePlayer,
        Telegram: any
        webviewClose: any
        MiniKit: MiniKit
    }
}
