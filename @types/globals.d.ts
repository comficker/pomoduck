import {MiniKit} from '@worldcoin/minikit-js'
import WebApp from "@twa-dev/sdk";
export {};

declare global {
  interface Window {
    itv: Timeout,
    Telegram: any
    webviewClose: any
    IDKit: any,
    MiniKit: typeof MiniKit
    telegram: typeof WebApp
    onTelegramAuth: any
    MiniKitBridge: any
  }
}

declare module '#app' {
  interface NuxtApp {
    $openLink(url: string): void,
    $sendHaptic(): void,
    $setupTelegram(): void
    $logging(message: any): void
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $openLink(url: string): void,
    $sendHaptic(): void,
    $setupTelegram(): void
    $logging(message: any): void
  }
}
