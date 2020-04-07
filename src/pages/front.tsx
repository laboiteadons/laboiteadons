import React from 'react'
import { Link } from 'react-router-dom'
import { useWeb3 } from '../ethereum'
import { Jumbotron, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap'

export const FrontPage = () => {
    const { network, selectedAccount, balance, loading, connected } = useWeb3()
    return (
        <>
            {
                !loading && !connected && (
                    <div className="alert alert-light">
                        We didn't detect an Ethereum wallet. <a href="#getting-started"> Find out how to get up and running with your wallet.</a>
                    </div>
                )
            }
            <Jumbotron>
                <Row>
                    <Col>
                        <h2>Donations 3.0 for modern causes</h2>
                        <p className="lead">
                            Now you can easily track and distribute your donations to multiple causes.<br/>
                            Transfers are cheap, instantaneous, highly secured and transparent on the <Link to="/about/blockchain">Ethereum Blockchain</Link>.<br/>
                            The app <Link to="/about/governance">doesn't need any central authority</Link> and is <Link to="/about/hosting">resistant against tempering</Link>, so you can stay in total control of your data.
                        </p>
                    </Col>
                    <Col>
                        <img src="/images/undraw_online_wishes_dlmr.png" alt="" className="img-fluid" />
                    </Col>
                </Row>
            </Jumbotron>
            <div className="my-5 text-center">
                <Link to="/donate" className="btn btn-primary btn-lg">Donate</Link>
            </div>
            <div className="my-5 text-center">
                <h3>How does it work?</h3>
                <p>
                    Instead of donating once to one cause, you can distribute your donation to any number of causes.<br/>
                    All donations are transparent and highly secured thanks to the Ethereum public blockchain.
                </p>
                <Link to="/about" className="btn btn-secondary">Learn more</Link>
            </div>
            <p className="alert alert-info my-5">
                As a proof-of-concept, all transactions are using the Rinkeby Ethereum Test Network and no donation of real currency is processed.
            </p>
            <div className="my-5" id="getting-started">
                {
                    !network ? (
                        <>
                            <h2>You need an Ethereum wallet to continue.</h2>
                            <h3>How to set up your Ethereum wallet</h3>
                            <p>Whether you decide to go with <a href="https://www.brave.com" target="_blank" rel="noreferrer noopener">Brave Browser</a> (we &lt;3 Brave) or the <a href="https://www.metamask.io" target="_blank" rel="noreferrer noopener">Metamask Browser Extension</a> for Chrome and Firefox, the steps to get started are very similar.</p>
                            <p>Once installed, go to the <strong>"Crypto Wallets" window</strong>  (by clicking on the metamask extension icon, or in your browser settings) and "create a new local wallet".</p>
                            <p>You will be directed to create your seed words. Follow the steps and <strong>backup your seed words</strong> by writing them down in a safe place, like a piece of paper, a password manager, an external drive in a vault... You will need your seed words to generate your private keys in case you lose access to your wallets. With your private keys, you can prove your identity on the Ethereum blockchain and transfer your funds.</p>
                            <p>You can then <strong>"create an account"</strong> or "import an account from a private key" to get an account dedicated to this application. We recommend creating an account for each service you use to avoid sharing your transactions history and making it easier for applications to create a profile of you.</p>
                            <p>By clicking on the "Network" name, you can <strong>switch to the Rinkeby Ethereum Test Network</strong>. There, only Test Ether are transferred and never real currencies.</p>
                            <p>You can get Test Ether in the <a href="https://faucet.rinkeby.io/" target="_blank" rel="noreferrer noopener">Rinkeby Authenticated Faucet</a>.</p>
                            <p>Congratulations! You now have your own Ethereum wallet. Keep it secure by <strong>never sharing your keys</strong>. Your wallet has a public address you can share and track on <a href="https://www.etherscan.io" target="_blank" rel="noreferrer noopener">Etherscan</a>.</p>
                            <p><a href="https://ethereum.org/wallets">Find out more about Ethereum wallets and how to use them.</a></p>
                        </>
                    ) : !selectedAccount ? (
                            <>
                                <h2>Your Ethereum wallet is locked</h2>
                                <p>
                                    You seem to have an Ethereum extension installed but we cannot access your wallet.
                                    <br/>Make sure your wallet is available, unlocked and enabled for this application.
                                </p>
                            </>
                        ) : (
                            <Card>
                                <CardBody>
                                    <CardTitle>You're connected to Ethereum!</CardTitle>
                                    <CardText>
                                        Account: {selectedAccount}<br/>
                                        Balance: {balance} ETH
                                    </CardText>
                                </CardBody>
                            </Card>
                        )
                }
            </div>
        </>
    )
}

export default FrontPage