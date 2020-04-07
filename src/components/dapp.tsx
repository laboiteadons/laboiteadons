import React from 'react'
import { useDApp } from '../dapp'
import { useWeb3 } from '../ethereum'

export const DAppStatusBox = () => {
  const { availableNetworkIds, loading } = useDApp()
  const { networkId, selectedAccount, balance } = useWeb3()
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
        : loading ?
          <div className="alert alert-info">
            Loading
          </div>
          : (
            <div className="alert alert-info">
              Account: {selectedAccount}<br/>
              Balance: {balance} ETH
            </div>
          )
}