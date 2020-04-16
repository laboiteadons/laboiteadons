import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useDApp } from '../dapp'
import { useWeb3 } from '../ethereum'
import {
    Jumbotron,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from 'reactstrap'


export const Intro = () => {
    const { t } = useTranslation()
    return (
        <Jumbotron className="m-0">
            <Trans t={t} i18nKey="intro">
                <h1>Decentralized donations</h1>
                <p>
                    Transparency, security and no third-party when distributing your donations to charities.
                </p>
            </Trans>
        </Jumbotron>
    )
}
    
export const DAppStatusBox = () => {
    const { t } = useTranslation()
    const { availableNetworkIds, loading } = useDApp()
    const { connected, networkId, selectedAccount, balance, isReadOnlyProvider } = useWeb3()
    return !connected || !networkId ?
        <div className="alert alert-danger">
            {t('You are not connected to Ethereum.')}
            <HelpWalletModalButton buttonTitle={t('Connect with a Wallet')} />
        </div>
        : isReadOnlyProvider ? 
            <div className="alert alert-warning">
                {t('You need an Ethereum wallet to process donations.')}
                <HelpWalletModalButton />
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
                            <div className="alert alert-info overflow-hidden">
                                {t('You\'re connected with the Ethereum wallet {{wallet}}', { wallet: selectedAccount })}<br/>
                                {t('Current balance: {{balance}} ETH', { balance })}
                            </div>
                        )
}

export const HelpWallet = React.memo(() => (
    <Trans i18nKey="walletHelp">
        <p>Start by downloading and installing an Ethereum wallet. We suggest <a href="https://www.brave.com" target="_blank" rel="noreferrer noopener">Brave Browser</a> or the <a href="https://www.metamask.io" target="_blank" rel="noreferrer noopener">Metamask Browser Extension</a> for Chrome, Firefox, Android or iOS.</p>
        <p>Once installed, go to the <strong>"Crypto Wallets" window</strong>  (by clicking on the metamask extension icon, or in your browser settings) and "create a new local wallet".</p>
        <p>You will be directed to create your seed words. Follow the steps and <strong>backup your seed words</strong> by writing them down in a safe place, like a piece of paper, a password manager, an external drive in a vault... You will need your seed words to generate your private keys in case you lose access to your wallets. With your private keys, you can prove your identity on the Ethereum blockchain and transfer your funds.</p>
        <p>You can then <strong>"create an account"</strong> or "import an account from a private key" to get an account dedicated to this application. We recommend creating an account for each service you use to avoid sharing your transactions history and making it easier for applications to create a profile of you.</p>
        <p>By clicking on the "Network" name, you can <strong>switch to the Rinkeby Ethereum Test Network</strong>. There, only Test Ether are transferred and never real currencies.</p>
        <p>You can get Test Ether in the <a href="https://faucet.rinkeby.io/" target="_blank" rel="noreferrer noopener">Rinkeby Authenticated Faucet</a>.</p>
        <p>Congratulations! You now have your own Ethereum wallet. Keep it secure by <strong>never sharing your keys</strong>. Your wallet has a public address you can share and track on <a href="https://www.etherscan.io" target="_blank" rel="noreferrer noopener">Etherscan</a>.</p>
        <p><a href="https://ethereum.org/wallets">Find out more about Ethereum wallets and how to use them.</a></p>
    </Trans>
))

export const HelpWalletModalButton:React.FC<{ buttonTitle?: string }> = ({ buttonTitle }) => {
    const { t } = useTranslation()
    const [isModalShown, setModalShown] = React.useState(false)
    const toggle = () => setModalShown(!isModalShown)
    return (
        <div>
            <Button color="primary" onClick={toggle}>{buttonTitle || t('Get an Ethereum wallet')}</Button>
            <Modal isOpen={isModalShown} toggle={toggle}>
                <ModalHeader toggle={toggle}>{t('Getting an Ethereum wallet')}</ModalHeader>
                <ModalBody>
                    <HelpWallet />
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>{t('Close')}</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}