import React from 'react'
import { useDApp } from '../dapp'
import { useWeb3 } from '../ethereum'
import { useTranslation } from 'react-i18next'

export const Web3StatusBox = React.memo(() => {
  const { t } = useTranslation()
  const { availableNetworkIds } = useDApp()
  const { networkId, selectedAccount, balance } = useWeb3()
  return !networkId ?
    <div className="alert alert-warning">
      {t('You are not connected to Ethereum.')}
    </div>
    : !availableNetworkIds.find(i => i === String(networkId)) ?
      <div className="alert alert-warning">
        {t('You are not connected to the correct network. Try connecting to Rinkeby Ethereum Test Network.')}
      </div>
      : !selectedAccount ?
        <div className="alert alert-warning">
          {t('Your Ethereum wallet is locked.')}
        </div>
        : (
          <div className="alert alert-info">
            {t('Wallet: {{wallet}}', { wallet: selectedAccount })}<br/>
            {t('Balance: {{balance}} ETH', { balance })}
          </div>
        )
})