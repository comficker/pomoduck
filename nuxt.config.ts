import {nodePolyfills} from "vite-plugin-node-polyfills";
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    ssr: true,
    css: [
        '~/assets/css/tailwind.css',
        '~/assets/fonts/stolzl/stylesheet.css',
        'vue-sonner/style.css'
    ],
    modules: ["shadcn-nuxt", "nuxt-icons", "@pinia/nuxt"],
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
        api: 'https://welcome.pomoduck.com/v2',
        public: {
            env: "production",
            appURL: "https://www.pomoduck.com",
            api: 'https://welcome.pomoduck.com/v2',
            botName: 'Pomoduck_bot',
            chain: "mainnet",
            receiver: ""
        }
    },
    vite: {
        plugins: [
            tailwindcss(),
            nodePolyfills()
        ],
        server: {
            strictPort: true
        }
    },
    vue: {
        compilerOptions: {
            isCustomElement: (tag) => ['tgs-player'].includes(tag),
        },
    },
    app: {
        head: {
            titleTemplate: '%s - PomoDuck.com - Quack! Quack! Quack! Quack', // default fallback title
            htmlAttrs: {
                lang: 'en',
            },
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ]
        }
    },
    nitro: {
        preset: 'node-server',
    },
})
