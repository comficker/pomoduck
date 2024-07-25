import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
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
      apiVersion: '2024',
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
  }
})
