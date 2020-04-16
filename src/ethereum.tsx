import React, { useState } from 'react'
import Web3 from 'web3'
import { useInterval } from './utils' 

declare global {
    interface Window {
        web3: any
        injectedWeb3: any
    }
}

export const _web3: any = typeof window.web3 !== 'undefined' && window.web3.currentProvider ?
    new Web3(window.web3.currentProvider)
    : process.env.REACT_APP_WEB3_PROVIDER_ENDPOINT &&
        new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_WEB3_PROVIDER_ENDPOINT))

window.injectedWeb3 = window.web3
if (_web3)
    window.web3 = _web3

export const WEB3_REFRESH_ACCOUNTS_INTERVAL = 2 * 1000 // 2 seconds
export const WEB3_REFRESH_NETWORK_INTERVAL = 10 * 1000 // 10 seconds
export const WEB3_REFRESH_ETHEREUM_NOT_FOUND_INTERVAL = 8 * 1000 // 8 seconds
export const WEB3_REFRESH_ETHEREUM_FOUND_INTERVAL = 20 * 1000 // 20 seconds

export const Web3Context = React.createContext<{
    accounts: string[],
    selectedAccount: string,
    network: string,
    networkId: string,
    balance: string,
    isReadOnlyProvider: boolean,
    loading: boolean,
    connected: boolean
}>({
    accounts: [],
    selectedAccount: "",
    network: "",
    networkId: "0",
    balance: "n/a",
    isReadOnlyProvider: true,
    loading: false,
    connected: false
})

type Web3ProviderProps = {
    children: React.ReactNode
    onLogin?: (arg0: string) => void,
    onLogout?: () => void,
    onChangeAccount?: (arg0: string) => void,
    onChangeNetwork?: (arg0: { network: string, networkId: string }) => void
}

export const Web3Provider = (props: Web3ProviderProps) => {
    const [accounts, setAccounts] = useState<{
        selected: string,
        list: string[]
    }>({
        selected: "",
        list: []
    })
    const [balance, setBalance] = useState<string>("n/a")
    const [network, setNetwork] = useState<{
        name: string,
        id: string
    }>({
        name: "",
        id: "0"
    })
    const [loading, setLoading] = useState<boolean>(true)
    const [connected, setConnected] = useState<boolean>(false)
    
    const { onLogin, onLogout, onChangeAccount, onChangeNetwork } = props
    
    const refreshEthereum = React.useCallback(async () => {
        return (
            _web3 && _web3.currentProvider ?
                _web3.eth.getChainId()
                .catch(() => false)
                .then((chainId: string) => !!chainId)
            : Promise.resolve(false)
        )
        .then((_connected: boolean) => {
            if (loading)
            setLoading(false)
            if (connected !== _connected)
            setConnected(_connected)
        })
    } , [connected, loading])
        
    const refreshNetwork = React.useCallback(() => {
        if (_web3)
        _web3.eth.net.getId()
        .then((netId: any) => {
            if (netId !== network.id) {
                let _network = "unknown"
                switch(netId) {
                    case 1: _network = "main"
                    break
                    case 3: _network = "ropsten"
                    break
                    case 4: _network = "rinkeby"
                    break
                    case 5: _network = "goerli"
                    break
                    case 42: _network = "kovan"
                    break
                    case 1337: _network = "local"
                    break
                    case 5777: _network = "develop"
                    break
                    default: _network = "unknown"
                    break
                }
                if (onChangeNetwork)
                onChangeNetwork({
                    network: _network,
                    networkId: netId.toString()
                })
                setNetwork({
                    name: _network,
                    id: netId.toString()
                })
            }
        })
        .catch((e: Error) => {
            console.error("Unable to refresh Ethereum network.", e.message)
        })
    }, [network, onChangeNetwork])
    
    const refreshAccounts = React.useCallback(() => {
        if (_web3)
        _web3.eth.getAccounts()
        .then((_accounts: any) => {
            // @ts-ignore: Metamask Provider specific method.
            if (_accounts.length === 0 && window.injectedWeb3 && window.injectedWeb3.currentProvider && typeof window.injectedWeb3.currentProvider.enable !== 'undefined') {
                // @ts-ignore: Metamask Provider specific method.
                return window.injectedWeb3.currentProvider.enable()
                .then(() => _web3.eth.getAccounts())
            }
            return _accounts
        })
        .then((_accounts: any) => {
            const _selectedAccount = _accounts[0] || ""
            if (onLogin && !accounts.selected && _selectedAccount)
                onLogin(_selectedAccount)
            if (onChangeAccount && accounts.selected && _selectedAccount && accounts.selected !== _selectedAccount)
                onChangeAccount(_selectedAccount)
            if (onLogout && accounts.selected && !_selectedAccount)
                onLogout()
            if (_selectedAccount && (accounts.list[0] !== _accounts[0] || _selectedAccount !== accounts.selected))
                setAccounts({
                    selected: _selectedAccount,
                    list: _accounts
                })
            
            if (_selectedAccount)
                _web3.eth.getBalance(_selectedAccount)
                .catch(() => "")
                .then((data: any) => {
                    var _balance = data ? window.web3.utils.fromWei(data) : "n/a"
                    if (balance !== _balance)
                    setBalance(_balance)
                })
        })
        .catch((e: Error) => {
            console.error("Unable to refresh Ethereum accounts.", e.message)
        })
    } , [accounts, balance, onChangeAccount, onLogin, onLogout])
    
    useInterval(refreshEthereum, connected ? WEB3_REFRESH_ETHEREUM_FOUND_INTERVAL : WEB3_REFRESH_ETHEREUM_NOT_FOUND_INTERVAL)
    useInterval(refreshNetwork, connected ? WEB3_REFRESH_NETWORK_INTERVAL : null)
    useInterval(refreshAccounts, connected ? WEB3_REFRESH_ACCOUNTS_INTERVAL : null)
    
    return (
        <Web3Context.Provider value={{
            accounts: connected ? accounts.list : [],
            selectedAccount: connected ? accounts.selected : "",
            network: connected ? network.name : "",
            networkId: connected ? network.id : "0",
            balance: connected ? balance : "n/a",
            isReadOnlyProvider: typeof window.injectedWeb3 === "undefined",
            loading,
            connected
        }}>
            {props.children}
        </Web3Context.Provider>
    )
}
        
export const useWeb3 = () => React.useContext(Web3Context)