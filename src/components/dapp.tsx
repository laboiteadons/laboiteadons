import React from 'react'
import { Link } from 'react-router-dom'
import { useDApp } from '../dapp'
import { useWeb3 } from '../ethereum'

export const DAppStatusBox = () => {
  const { availableNetworkIds, loading } = useDApp()
  const { connected, networkId, selectedAccount, balance, isReadOnlyProvider } = useWeb3()
  return !connected || !networkId ?
    <div className="alert alert-danger">
      You are not connected to Ethereum. <Link to="/about/wallet">Get started with an Ethereum wallet.</Link>
    </div>
    : isReadOnlyProvider ? 
      <div className="alert alert-warning">
        You need an Ethereum wallet to process donations. <Link to="/about/wallet">Get started with an Ethereum wallet.</Link>
      </div>
      : !availableNetworkIds.find(i => i === networkId) ?
        <div className="alert alert-warning">
          You're not on a valid Ethereum network. Try switching to Rinkeby Ethereum Test Network.
        </div>
        : !selectedAccount ?
          <div className="alert alert-warning">
            Your Ethereum wallet is locked.
          </div>
          : loading ?
            <div className="alert alert-info">
              Loading...
            </div>
            : (
              <div className="alert alert-info">
                You're connected with the Ethereum wallet {selectedAccount}<br/>
                Current balance: {balance} ETH
              </div>
            )
}