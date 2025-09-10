import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  css: [
    '~/assets/css/tailwind.css',
    '~/assets/fonts/stolzl/stylesheet.css'
  ],
  modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt", "nuxt-icons", "@pinia/nuxt"],
  // @ts-ignore
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  runtimeConfig: {
    public: {
      appURL: "https://www.pomoduck.com",
      api: 'https://welcome.pomoduck.com',
      apiVersion: 'v2',
      botName: 'Pomoduck_bot',
      chain: "mainnet",
      receiver: ""
    }
  },
  vite: {
    plugins: [nodePolyfills()],
    server: {
      strictPort: true
    }
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['tgs-player'].includes(tag),
    },
  }
})
