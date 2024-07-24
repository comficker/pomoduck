import type {SpinePlayer} from "@esotericsoftware/spine-player";

export {};

declare global {
  interface Window {
    itv: Timeout,
    sp: SpinePlayer,
    Telegram: any
    webviewClose: any
  }
}
