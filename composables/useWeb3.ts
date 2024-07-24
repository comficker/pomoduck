import {defineStore} from 'pinia'
import {type SendTransactionRequest, TonConnectUI, toUserFriendlyAddress} from '@tonconnect/ui'
import {Address, beginCell, toNano, TonClient} from 'ton'
import {getHttpEndpoint} from "@orbs-network/ton-access";
import type {TX} from "~/types";
import { Cell } from '@ton/core';

export const useWalletConnect = defineStore('wallet-connect', () => {
    const config = useRuntimeConfig()
    const connector = ref<TonConnectUI | null>(null)
    const connected = ref(false)
    const currentWallet = ref<undefined | string>(undefined)
    const connecting = ref(false)
    const reconnecting = ref(false)
    const globalStore = useGlobalStore()
    const getTonClient = async () => {
        let endpoint = ''
        if (config.public.chain == "mainnet") {
            endpoint = await getHttpEndpoint()
        } else {
            endpoint = await getHttpEndpoint({
                network: "testnet",
            });
        }
        return new TonClient({endpoint})
    }

    const checkConnect = async (send = false) => {
        connected.value = connector.value?.connected || false
        currentWallet.value = connector.value?.account?.address ? Address.parse(connector.value.account.address).toString({bounceable: false}): undefined
        if (send && connected.value) {
            useAuthFetch('/missions/connect-wallet', {
                method: 'POST',
                body: {
                    "address": currentWallet.value
                }
            })
        }
    }

    const onStartup = async () => {
        const tonConnectUI = new TonConnectUI({
            manifestUrl: 'https://app.plumapp.io/manifest.json',
        });
        tonConnectUI.uiOptions = {
            actionsConfiguration: {
                twaReturnUrl: `https://t.me/${config.public.botUsername}/play`
            }
        }
        tonConnectUI.connectionRestored.then((r) => {
            setInterval(() => {
                checkConnect()
            }, 1000)
        })
        connector.value = tonConnectUI
    }

    const connect = async (forced = true) => {
        await checkConnect(true)
        if (connector.value && !connector.value.account?.address) {
            await connector.value.openModal()
        }
    }

    const disconnect = async () => {
        if (connector.value && connector.value.connected) {
            await connector.value.disconnect()
            currentWallet.value = undefined
            connected.value = false
        }
    }

    const userFriendlyAddress = computed(() => {
        if (connector?.value?.connected && connector?.value?.wallet) {
            return toUserFriendlyAddress(connector.value.wallet.account.address)
        }
    })

    const getBalance = async () => {
        const tonClient = await getTonClient()
        if (currentWallet.value) return tonClient.getBalance(Address.parse(currentWallet.value))
        return 0
    }

    onStartup().then(() => {
    })

    const upgradeNode = async (cpu: number, amount: number = 1) => {
        const names = ["t2", "t3", "t4", "t5"]
        const prices = globalStore.info.boostPrice
        const body = beginCell()
            .storeUint(0, 32)
            .storeStringTail(`${globalStore.info.telegramId}${names[cpu]}`)
            .endCell();

        const transaction: SendTransactionRequest = {
            validUntil: Math.floor(Date.now() / 1000) + 360,
            messages: [
                {
                    address: Address.parse(config.public.receiver).toString(),
                    amount: toNano(prices[cpu] * amount).toString(),
                    payload: body.toBoc().toString("base64")
                }
            ]
        }
        const result =  await connector.value?.sendTransaction(transaction);
        if (result?.boc) {
            const cell = Cell.fromBase64(result?.boc)
            const buffer = cell.hash();
            return buffer.toString('hex');
        }
        return null
    }

    const pay = async (activeTX: TX) => {
        const transaction: SendTransactionRequest = {
            validUntil: Math.floor(Date.now() / 1000) + 360,
            messages: [
                {
                    address: Address.parse(activeTX.fromAddress).toString(),
                    amount: toNano(activeTX.amount  - 0.01).toString(),
                }
            ]
        }
        const result =  await connector.value?.sendTransaction(transaction);
        if (result?.boc) {
            const cell = Cell.fromBase64(result?.boc)
            const buffer = cell.hash();
            return buffer.toString('hex');
        }
        return null
    }

    return {
        onStartup,
        connect,
        disconnect,
        connector,
        connected,
        userFriendlyAddress,
        currentWallet,
        reconnecting,
        getBalance,
        upgradeNode,
        connecting,
        pay
    }
})
