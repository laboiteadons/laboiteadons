import React, { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Pie } from 'react-chartjs-2'
import Autosuggest from 'react-autosuggest'
import { Slice, Donation, Cause } from '../types'
import { Alert, Col, Row } from 'reactstrap'
import { useDApp, translateCauseField } from '../dapp'
import './autosuggest.css'
import { Intro } from './dapp'
import { useWeb3 } from '../ethereum'

export const DonationInput: React.FC<{
    sum: string,
    setSum: (arg0: string) => void
}> = React.memo(({ sum, setSum }) => {
    const { t } = useTranslation()
    return (
        <div className="input-group w-100">
            <label className="w-100">
                {t('Amount to donate (ETH)')}
                <input name="sum" type="text" value={sum} onChange={e => setSum(e.target.value)} className="form-control" />
            </label>
        </div>
    )
})

export const DistributionPie: React.FC<{ distribution: Slice[] }> = React.memo(({ distribution }) => {
    if (distribution.length === 0)
        return (
            <Pie data={{ datasets: [{
                data: [100, 200, 300],
                backgroundColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)']
            }] }} legend={null} options={{
                animation: false,
                hover: false,
                responsiveAnimationDuration: 0,
                tooltips: { enabled: false }
            }} />
        )

    const chartData = {
        labels: distribution.map((s: Slice) => s.name),
        datasets: [{
            data: distribution.map((s: Slice) => s.shares),
            backgroundColor: distribution.map((s:Slice) => '#' + s.addr.substr(2, 6))
        }]
    }
    return <Pie data={chartData} legend={null} options={{ animation: { duration: 250 }, tooltips: { enabled: true } }} />
})

export const DistributionAutosuggest : React.FC<{
    onSelect: (c: Cause) => void,
    list: Cause[],
    placeholder?: string
}> = ({ onSelect, list, placeholder }) => {
    const { t, i18n: { language }} = useTranslation()
    const [searchValue, setSearchValue] = React.useState<string>("")
    const [suggestions, setSuggestions] = React.useState<Cause[]>([])
    
    const getSuggestions: (value: string) => Cause[] = (value: string) => {
        value = value.trim().toLowerCase()
        return value.length > 0 ?
            list.filter((c: Cause) => translateCauseField(c, "name", language).toLowerCase().search(value) >= 0)
            : []
    }

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={(p: {value: string}) => setSuggestions(getSuggestions(p.value))}
            onSuggestionsClearRequested={() => setSuggestions([])}
            getSuggestionValue={(s: Cause) => translateCauseField(s, "name", language)}
            renderSuggestion={(s: Cause) => <div>{translateCauseField(s, "name", language)}</div>}
            inputProps={{
                placeholder: placeholder || t("Add a cause"),
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
        <Row className="py-2" style={{ borderBottom: `2px solid #${slice.addr.substr(2, 6)}`}}>
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
    
export const DistributionInput: React.FC<{
    distribution: Slice[],
    setDistribution: (arg0: Slice[]) => void
    cloneLatestDistribution: (()=>void)|null|undefined
}> = ({ distribution, setDistribution, cloneLatestDistribution }) => {
    const { t, i18n: { language } } = useTranslation()
    const { connected } = useWeb3()
    const { causes } = useDApp()
    const onSelect = (c: Cause) => {
        setDistribution([...distribution, {
            addr: c.addr,
            name: translateCauseField(c, "name", language),
            shares: 100,
            causeCid: c.ipfsCid
        }])
    }
    const remaindingCauses: Cause[] = causes.filter(c => !distribution.find(s => s.addr === c.addr))
    const autosuggestPlaceholer = distribution.length === 0 ?
        t('Start by adding causes') : undefined
    return (
        <>
            <Row className="my-3">
                <Col className="col-12 col-md-5">
                    {
                        causes.length > 0 ?
                            <DistributionAutosuggest onSelect={onSelect} list={remaindingCauses} placeholder={autosuggestPlaceholer} />
                            : <input type="text" placeholder={connected ? t('Loading causes...') : t('Not connected.')} disabled className={`form-control ${!connected && "is-invalid"}`} style={{ height: "40px" }} />
                    }
                    {
                        distribution.length > 0 && (
                            <ul className="list-unstyled m-3">
                            {
                                distribution.map((slice: Slice, i: number) => {
                                    return (
                                        <li key={slice.addr} className="my-2">
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
                        )
                    }
                    { distribution.length === 0 && <div className="mt-3 mb-3"><Intro /></div> }
                    {
                        distribution.length === 0 && cloneLatestDistribution && (
                            <button className="btn btn-primary" onClick={cloneLatestDistribution}>
                                {t('Clone your latest donation')}
                            </button>
                        )
                    }
                </Col>
                <Col className="col-12 col-md-7 py-3 my-auto">
                    <DistributionPie distribution={distribution} />
                </Col>
            </Row>
        </>
    )
}
        
export const DonationSuccessBox: React.FC<{donation: Donation}> = React.memo(({ donation }) => {
    const { t } = useTranslation()
    return (
        <Alert className="alert-success">
            <h5>{t('Your donation has been processed!')}</h5>
            <a href={`https://rinkeby.etherscan.io/tx/${donation.transaction_hash}`} target="_blank" rel="noreferrer noopener" className="btn btn-primary">
                {t('Review your transaction on Etherscan')}
            </a>
        </Alert>
    )
})