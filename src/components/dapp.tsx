import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDApp } from '../dapp'
import { useWeb3 } from '../ethereum'

export const DAppStatusBox = () => {
  const { t } = useTranslation()
  const { availableNetworkIds, loading } = useDApp()
  const { connected, networkId, selectedAccount, balance, isReadOnlyProvider } = useWeb3()
  return !connected || !networkId ?
    <div className="alert alert-danger">
      {t('You are not connected to Ethereum.')} <Link to="/about/wallet">{t('Get started with an Ethereum wallet.')}</Link>
    </div>
    : isReadOnlyProvider ? 
      <div className="alert alert-warning">
        {t('You need an Ethereum wallet to process donations.')} <Link to="/about/wallet">{t('Get started with an Ethereum wallet.')}</Link>
      </div>
      : !availableNetworkIds.find(i => i === networkId) ?
        <div className="alert alert-warning">
          {t('You\'re not on a valid Ethereum network. Try switching to Rinkeby Ethereum Test Network.')}
        </div>
        : !selectedAccount ?
          <div className="alert alert-warning">
            {t('Your Ethereum wallet is locked.')}
          </div>
          : loading ?
            <div className="alert alert-info">
              {t('Loading...')}
            </div>
            : (
              <div className="alert alert-info">
                {t('You\'re connected with the Ethereum wallet {{wallet}}', { wallet: selectedAccount })}<br/>
                {t('Current balance: {{balance}} ETH', { balance })}
              </div>
            )
}