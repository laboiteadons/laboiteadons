import React from 'react'
import { DonationInput, DistributionInput, DonationSuccessBox } from '../components/donations'
import { useDApp, DONATION_CONFIRMED } from '../dapp'
import { Slice, Donation } from '../types'
import { DAppStatusBox } from '../components/dapp'
import { Alert, Media, Row, Col } from 'reactstrap'
import { useWeb3 } from '../ethereum'

export const DonationPage = () => {
    const { networkId, selectedAccount } = useWeb3()
    const { donate, donations } = useDApp()
    const [sum, setSum] = React.useState<string>("")
    const [distribution, setDistribution] = React.useState<Slice[]>([])
    const [donating, setDonating] = React.useState<boolean>(false)
    const [latestDonation, setLatestDonation] = React.useState<Donation|undefined>()
    const [error, setError] = React.useState<string>("")
    const donationsOnNetwork: Donation[] = donations.filter(d => d.networkId === networkId).reverse()
    const cloneLatestDistribution: (()=>void)|null|undefined = donationsOnNetwork && donationsOnNetwork[0] ?
        () => {
            setDistribution(donationsOnNetwork[0].distribution)
            setSum(window.web3.utils.fromWei(donationsOnNetwork[0].weiValue, 'ether'))
        }
        : null

    return (
        <>
            <div className="my-3">
                <DAppStatusBox />
                <div className="row">
                    <div className="col-10 offset-1">
                        <div className="my-3">
                            <DistributionInput distribution={distribution} setDistribution={setDistribution} cloneLatestDistribution={cloneLatestDistribution} />
                        </div>
                        <DonationInput sum={sum} setSum={setSum} />
                        
                        <div className="my-3 text-center">
                            {
                                donating ?
                                    <Alert className="alert-info">Processing donation.... Please wait for confirmation.</Alert>
                                    : (
                                        <button className="btn btn-primary" onClick={() => {
                                            if (!selectedAccount)
                                                return setError("You need a wallet to process donations.")
                                            setError("")
                                            setLatestDonation(undefined)
                                            if (parseFloat(sum) > 0 && distribution.length > 0) {
                                                setDonating(true)
                                                donate(distribution, window.web3.utils.toWei(sum, 'ether').toString(16))
                                                .then((donation: Donation) => setLatestDonation(donation))
                                                .catch(e => {
                                                    console.error(e)
                                                    setError("Your transaction was rejected by the smart contract. Try increasing the gas of your transaction in the Metamask window. When sending large distributions, more gas is needed to process it. You can also try several smaller distributions.")
                                                })
                                                .finally(() => setDonating(false))
                                            }
                                            else {
                                                setError("You didn't set a value to donate.")
                                            }
                                        }}>Donate</button>
                                    )
                            }
                        </div>
                        { latestDonation && <div className="my-3"><DonationSuccessBox donation={latestDonation} /></div> }
                        {
                            error && (
                                <Alert className="my-3 alert-danger">
                                    An error occured, your transaction has not been processed.<br/>
                                    {error}
                                </Alert>
                            )
                        }
                    </div>
                </div>
            </div>
            {
                donationsOnNetwork.length > 0 && (
                    <div>
                        <h3>History of donations</h3>
                        <div>
                            {
                                donationsOnNetwork.map((donation: Donation, i: number) => {
                                    var totalShares = donation.distribution.reduce((total: number, slice: Slice) => total += slice.shares, 0)
                                    return (
                                        <Media key={i} className="py-4">
                                            <div className="media-body">
                                                <h5 className="mt-0">{new Date(donation.timestamp).toLocaleString()}</h5>
                                                <strong>{window.web3.utils.fromWei(donation.weiValue, 'ether')} ETH</strong>
                                                <ul className="list-unstyled">
                                                    {donation.distribution.map((s:Slice, j:number) => (
                                                        <li key={j}>
                                                            <Row>
                                                                <Col className="col-6">{s.name}</Col>
                                                                <Col className="col-6">{Math.floor((s.shares / totalShares) * 1000000) / 10000.0} %</Col>
                                                            </Row>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <a href={`https://rinkeby.etherscan.io/tx/${donation.transaction_hash}`} className={`btn btn-sm ${donation.status === DONATION_CONFIRMED ? "btn-success" : "btn-danger"}`}>Review on Etherscan</a>&nbsp;<button onClick={() => setDistribution(donation.distribution)} className="btn btn-sm btn-primary">Clone donation</button>
                                            </div>
                                        </Media>
                                    )
                                })
                            }
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default DonationPage