import React, { ChangeEvent } from 'react'
import { Pie } from 'react-chartjs-2'
import Autosuggest from 'react-autosuggest'
import { Slice, Donation, Cause } from '../types'
import { Alert, Col, Row } from 'reactstrap'
import { useDApp } from '../dapp'
import './autosuggest.css'

export const DonationInput: React.FC<{
    sum: number,
    setSum: (arg0: number) => void
}> = React.memo(({ sum, setSum }) => (
    <div className="card">
        <div className="card-body">
            <div className="card-text">
                <div className="input-group">
                    <label>
                        Enter the amount to donate (ETH):
                        <input name="sum" type="number" value={sum || ""} onChange={e => setSum(parseFloat(e.currentTarget.value))} className="form-control" />
                    </label>
                </div>
            </div>
        </div>
    </div>
))

export const DistributionPie: React.FC<{ distribution: Slice[] }> = React.memo(({ distribution }) => {
    console.log("distribution", distribution)
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
    return <Pie data={chartData} legend={null} options={{ animation: { duration: 250 } }} />
})

export const DistributionAutosuggest : React.FC<{ onSelect: (c: Cause) => void, list: Cause[] }> = React.memo(({ onSelect, list }) => {
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
                placeholder: "Find by name",
                value: searchValue,
                onChange: (e: any, d: Autosuggest.ChangeEvent) => setSearchValue(d.newValue)
            }}
            onSuggestionSelected={(e: any, d: { suggestion: Cause }) => {
                onSelect(d.suggestion)
                setSearchValue("")
            }}
        />
    )
})

export const DistributionSlices: React.FC<{distribution: Slice[], setDistribution: (d: Slice[]) => void}> = ({ distribution, setDistribution }) => {
    return (
        <ul className="list-unstyled">
        {
            distribution.map((slice: Slice, i: number) => (
                <li key={i}>
                    <Row style={{ borderBottom: `2px solid #${slice.addr.substr(2, 6)}`}}>
                        <Col className="col-9">{slice.name}</Col>
                        <Col className="col-3">
                            <input type="number" style={{width: "3em"}} defaultValue={slice.shares} onBlur={
                                (e: ChangeEvent<HTMLInputElement>) =>
                                    setDistribution(distribution.map(s => s.addr === slice.addr ? {...s, shares: parseInt(e.target.value) } : s))
                            } />
                        </Col>
                    </Row>
                </li>
            ))
        }
        </ul>
    )
}
    
export const DistributionInput: React.FC<{
    distribution: Slice[],
    setDistribution: (arg0: Slice[]) => void
}> = ({ distribution, setDistribution }) => {
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
                <DistributionSlices distribution={distribution} setDistribution={setDistribution} />
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