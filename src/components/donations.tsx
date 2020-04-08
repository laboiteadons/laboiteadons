import React, { ChangeEvent } from 'react'
import { Pie } from 'react-chartjs-2'
import Autosuggest from 'react-autosuggest'
import { Slice, Donation, Cause } from '../types'
import { Alert, Col, Row } from 'reactstrap'
import { useDApp } from '../dapp'
import './autosuggest.css'

export const DonationInput: React.FC<{
    sum: string,
    setSum: (arg0: string) => void
}> = React.memo(({ sum, setSum }) => (
    <div className="card">
        <div className="card-body">
            <div className="card-text">
                <div className="input-group">
                    <label>
                        Enter the amount to donate (ETH):
                        <input name="sum" type="text" value={sum} onChange={e => setSum(e.target.value)} className="form-control" />
                    </label>
                </div>
            </div>
        </div>
    </div>
))

export const DistributionPie: React.FC<{ distribution: Slice[] }> = React.memo(({ distribution }) => {
    if (distribution.length === 0)
        return <Pie data={{ datasets: [{ data: [100, 200, 300] }] }} legend={null} options={{
            animation: false,
            hover: false,
            responsiveAnimationDuration: 0,
            tooltips: { enabled: false }
        }} />

    const chartData = {
        labels: distribution.map((s: Slice) => s.name),
        datasets: [{
            data: distribution.map((s: Slice) => s.shares),
            backgroundColor: distribution.map((s:Slice) => '#' + s.addr.substr(2, 6))
        }]
    }
    return <Pie data={chartData} legend={null} options={{ animation: { duration: 250 }, tooltips: { enabled: true } }} />
})

export const DistributionAutosuggest : React.FC<{ onSelect: (c: Cause) => void, list: Cause[] }> = ({ onSelect, list }) => {
    const [searchValue, setSearchValue] = React.useState<string>("")
    const [suggestions, setSuggestions] = React.useState<Cause[]>([])
    
    const getSuggestions: (value: string) => Cause[] = (value: string) => {
        value = value.trim().toLowerCase()
        return value.length > 0 ?
            list.filter((c: Cause) => c.name.toLowerCase().search(value) >= 0)
            : []
    }

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={(p: {value: string}) => setSuggestions(getSuggestions(p.value))}
            onSuggestionsClearRequested={() => setSuggestions([])}
            getSuggestionValue={(s: Cause) => s.name}
            renderSuggestion={(s: Cause) => <div>{s.name}</div>}
            inputProps={{
                placeholder: "Find a cause by name",
                value: searchValue,
                onChange: (e: any, d: Autosuggest.ChangeEvent) => setSearchValue(d.newValue)
            }}
            onSuggestionSelected={(e: any, d: { suggestion: Cause }) => {
                onSelect(d.suggestion)
                setSearchValue("")
            }}
        />
    )
}

export const DistributionSliceItem: React.FC<{
    slice: Slice,
    removeSlice: () => void,
    updateSlice: (shares: number) => void
}> = ({ slice, removeSlice, updateSlice }) => {
    const [shares, setShares] = React.useState(slice.shares)
    return (
        <Row style={{ borderBottom: `2px solid #${slice.addr.substr(2, 6)}`}}>
            <Col className="col-9">{slice.name}</Col>
            <Col className="col-3">
                <input type="text" style={{width: "3em"}} value={shares} onChange={
                    (e: ChangeEvent<HTMLInputElement>) => {
                        e.preventDefault()
                        var _shares = parseInt(e.target.value)
                        setShares(_shares)
                        if (_shares > 0) updateSlice(_shares)
                    }
                } />
                <span role="button" className="i-close" onClick={removeSlice}>&times;</span>
            </Col>
        </Row>
    )
}

export const DistributionSlices: React.FC<{
    distribution: Slice[],
    setDistribution: (d: Slice[]) => void,
    cloneLatestDonation: (()=>void)|null|undefined
}> = ({ distribution, setDistribution, cloneLatestDonation }) => {
    return distribution.length > 0 ? (
        <ul className="list-unstyled">
        {
            distribution.map((slice: Slice, i: number) => {
                return (
                    <li key={slice.addr}>
                        <DistributionSliceItem slice={slice}
                            removeSlice={() => {
                                var _distribution = distribution.filter(s => s.addr !== slice.addr)
                                setDistribution(_distribution)
                            }}
                            updateSlice={(shares: number) => {
                                setDistribution(distribution.map(s => s.addr === slice.addr ? {...s, shares } : s))
                            }}
                        />
                    </li>
                )
            })
        }
        </ul>
    ) : (
        <>
            <p>Start by adding causes to your distribution...</p>
            {
                cloneLatestDonation && <button className="btn btn-primary" onClick={cloneLatestDonation}>Or clone your latest donation</button>
            }
        </>
    )
}
    
export const DistributionInput: React.FC<{
    distribution: Slice[],
    setDistribution: (arg0: Slice[]) => void
    cloneLatestDistribution: (()=>void)|null|undefined
}> = ({ distribution, setDistribution, cloneLatestDistribution }) => {
    const { causes } = useDApp()
    const onSelect = (c: Cause) => {
        setDistribution([...distribution, {
            addr: c.addr,
            name: c.name,
            shares: 100,
            causeCid: c.ipfsCid
        }])
    }
    const remaindingCauses: Cause[] = causes.filter(c => !distribution.find(s => s.addr === c.addr))
    return (
        <Row>
            <Col className="col-7">
                <DistributionAutosuggest onSelect={onSelect} list={remaindingCauses} />
                <div className="my-5">
                    <DistributionPie distribution={distribution} />
                </div>
            </Col>
            <Col className="col-5">
                <DistributionSlices distribution={distribution} setDistribution={setDistribution} cloneLatestDonation={cloneLatestDistribution} />
            </Col>
        </Row>
    )
}
        
export const DonationSuccessBox: React.FC<{donation: Donation}> = React.memo(({ donation }) => (
    <Alert className="alert-success">
        <h5>Your donation has been processed!</h5>
        <a href={`https://rinkeby.etherscan.io/tx/${donation.transaction_hash}`} target="_blank" rel="noreferrer noopener" className="btn btn-primary">
            Review your transaction on Etherscan
        </a>
    </Alert>
))