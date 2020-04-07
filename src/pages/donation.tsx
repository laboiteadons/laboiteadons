import React from 'react'
import { DonationInput, DistributionInput, DonationSuccessBox } from '../components/donations'
import { useDApp } from '../dapp'
import { Slice, Donation, Cause } from '../types'
import { DAppStatusBox } from '../components/dapp'
import { Alert } from 'reactstrap'

export const DonationPage = () => {
    const { donate, causes, loading } = useDApp()
    const [sum, setSum] = React.useState<number>(0.0)
    const [distribution, setDistribution] = React.useState<Slice[]>([])
    const [donating, setDonating] = React.useState<boolean>(false)
    const [latestDonation, setLatestDonation] = React.useState<Donation|undefined>()
    const [error, setError] = React.useState<string>("")

    // Init with default value.
    const mounted = React.useRef<boolean>(false)
    React.useEffect(() => {
        if (!loading && !mounted.current) {
            mounted.current = true
            setDistribution(
                causes.slice(0, 3).map((c: Cause) => ({
                    name: c.name,
                    addr: c.addr,
                    shares: (Math.floor((Math.random() * 99)) * 10),
                    causeCid: c.ipfsCid
                }))
            )
        }
    }, [loading, causes])

    return (
        <>
            <DAppStatusBox />
            <div className="my-3">
                <div className="row">
                    <div className="col-10 offset-1">
                        <div className="my-3">
                            <DistributionInput distribution={distribution} setDistribution={setDistribution} />
                        </div>
                        <DonationInput sum={sum} setSum={setSum} />
                        
                        <div className="my-3 text-center">
                            {
                                donating ?
                                    <Alert className="alert-info">Processing donation.... Please wait for confirmation.</Alert>
                                    : (
                                        <button className="btn btn-primary" onClick={() => {
                                            setError("")
                                            setLatestDonation(undefined)
                                            if (sum > 0) {
                                                setDonating(true)
                                                donate(distribution, window.web3.utils.toWei(String(sum), 'ether').toString(16))
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
        </>
    )
}

export default DonationPage