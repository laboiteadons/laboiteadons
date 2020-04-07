import React from 'react'
import { useDApp } from '../dapp'
import { useWeb3 } from '../ethereum'

export const Web3StatusBox = React.memo(() => {
  const { availableNetworkIds } = useDApp()
  const { networkId, selectedAccount, balance } = useWeb3()
  console.log("Web3StatusBox")
  return !networkId ?
    <div className="alert alert-warning">
      You are not connected to Ethereum.
    </div>
    : !availableNetworkIds.find(i => i === String(networkId)) ?
      <div className="alert alert-warning">
        You are not connected to the correct network. Try connecting to Rinkeby Ethereum Test Network.
      </div>
      : !selectedAccount ?
        <div className="alert alert-warning">
          Your wallet is locked.
        </div>
        : (
          <div className="alert alert-info">
            Account: {selectedAccount}<br/>
            Balance: {balance} ETH
          </div>
        )
})