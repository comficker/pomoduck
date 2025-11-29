export {};

declare global {
  interface Window {
    itv: Timeout,
    Telegram: any
    webviewClose: any
    IDKit: any,
    MiniKit: any
    telegram: any
    onTelegramAuth: any
    MiniKitBridge: any
    TON_CONNECT_UI: any
    tonConnectUI: any
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
