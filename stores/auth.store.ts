import {defineStore} from 'pinia'
import {MiniKit, ResponseEvent, verifyCloudProof} from '@worldcoin/minikit-js'

export const useAuthStore = defineStore('auth', () => {
    const worldUser = ref(MiniKit.user)
    const authWithWorldCoin = async () => {
        if (!MiniKit.isInstalled()) {
            console.warn('Tried to invoke "walletAuth", but MiniKit is not installed.')
            return;
        }
        await MiniKit.commandsAsync.walletAuth({
            nonce: '123123',
            statement: 'Login to Mini App',
            requestId: "0",
            expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
            notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        });
    }


    onMounted(() => {
        MiniKit.subscribe(ResponseEvent.MiniAppWalletAuth, async payload => {
            console.log(payload);
        })
    })
    return {
        authWithWorldCoin,
        worldUser
    }
})

