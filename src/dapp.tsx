import React from 'react'
import * as TruffleContract from '@truffle/contract'
import CID from 'cids'
import { useWeb3 } from './ethereum'
import LaBoiteADons_Schema from './contracts/LaBoiteADons.json'
import Organ_Schema from './contracts/Organ.json'
import { Donation, Cause, Slice } from './types'

export const DONATION_CONFIRMED = "confirmed"

export const DAppContext = React.createContext<{
    donations: Donation[],
    causes: Cause[],
    causesOrgan: any, // No type definition for a loaded Truffle contract.
    dAppContract: any,
    dAppIpfsCid: { v0: string, v1: string },
    ipfsNode: any,
    loading: boolean,
    availableNetworkIds: string[],
    donate: (distribution: Slice[], weiValue: number) => Promise<Donation>
}>({
    donations: [],
    causes: [],
    causesOrgan: null,
    dAppContract: null,
    dAppIpfsCid: {v0:"", v1: ""},
    ipfsNode: null,
    loading: false,
    availableNetworkIds: [], 
    donate: (_distribution: Slice[], _weiValue: number) => Promise.reject(new Error("Not available."))
})

export const DAppProvider = (props: any) => {
    const { network, networkId, selectedAccount, loading: web3Loading } = useWeb3()
    const [donations, setDonations] = React.useState<Donation[]>([])
    const [causes, setCauses] = React.useState<Cause[]>([])
    const [dAppContract, setDAppContract] = React.useState<any>(null)
    const [dAppIpfsCid, setDAppIpfsCid] = React.useState<{v0: string, v1: string}>({v0:"", v1: ""})
    const [causesOrgan, setCausesOrgan] = React.useState<any>(null)
    const [availableNetworkIds, setAvailableNetworkIds] = React.useState<string[]>([])
    const [loading, setLoading] = React.useState<boolean>(true)
    const mounted = React.useRef<boolean|null>(null)
    
    React.useEffect(() => {
        // Load donations history from localStorage.
        var history = window.localStorage.getItem('laboiteadons-history')
        setDonations(history ? JSON.parse(history) : [])

        // Don't load contract and causes on redraw.
        if (!web3Loading && mounted.current === null) {
            mounted.current = true

            // Async load causes and donation contract.
            const initCauses = async () => {
                // Load contract from Truffle migration artifacts.
                if (typeof window.web3 === "undefined")
                    throw new Error("Not connected to Ethereum. You need an Ethereum provider like the Brave Browser (brave.com) or the Metamask Browser Extension for Chrome and Firefox (metamask.io) to access this website.")
                // @ts-ignore
                var DAppContract = TruffleContract(LaBoiteADons_Schema)
                setAvailableNetworkIds(DAppContract.networks ? Object.keys(DAppContract.networks) : [])
                await DAppContract.setProvider(window.web3.currentProvider)
                await DAppContract.setNetwork(networkId)
                var _dAppContract = await DAppContract.deployed()
                if (!_dAppContract.address)
                    throw new Error("LaBoiteADons contract not found on this network.")

                setDAppContract(_dAppContract)

                var _dAppIpfsCid = await _dAppContract.getWebsite()
                .then((data: any) => {
                    if (data.ipfsHash === "0x0000000000000000000000000000000000000000000000000000000000000000")
                        return ""
                    var multihash = Buffer.from(
                        data.hashFunction.toString(16,2) +
                        data.hashSize.toString(16, 2) +
                        data.ipfsHash.slice(2),
                        'hex'
                    )
                    // Compute IPFS address from hash data.
                    // var cidv0 = bs58.encode(multihash)
                    var cid = new CID(multihash)
                    return {
                        v0: cid.toV0().toString(),
                        v1: cid.toV1().toString()
                    }
                })
                setDAppIpfsCid(_dAppIpfsCid)


                // Load causes from Organigram's Organ contract.
                var causesOrganAddress = await _dAppContract.causesOrganAddress()
                // @ts-ignore
                var Organ = TruffleContract(Organ_Schema)
                await Organ.setProvider(window.web3.currentProvider)
                await Organ.setNetwork(networkId)
                var _causesOrgan = await Organ.at(causesOrganAddress)
                if (!_causesOrgan)
                    throw new Error('Causes Organ not found.')

                setCausesOrgan(_causesOrgan)

                // Loop through Causes organ's entries.
                const length = (await _causesOrgan.getEntriesLength()).toString()
                var promises = []
                // Load all causes at once.
                for (var i = 1; String(i) !== length ; ++i) {
                    promises.push(
                        _causesOrgan.getEntry(i)
                        .catch((e:Error) => console.error(e.message))
                        .then(async (data: any) => {
                            var multihash = Buffer.from(
                                data.hashFunction.toString(16,2) +
                                data.hashSize.toString(16, 2) +
                                data.ipfsHash.slice(2),
                                'hex'
                            )
                            // Compute IPFS address from hash data.
                            var ipfsCid = new CID(multihash).toV1().toString()
                            var metadataUrl = "https://ipfs.io/ipfs/" + ipfsCid
                            var metadata = await fetch(metadataUrl).then(r => r.json())
                            // Create our Cause object.
                            return metadata.name && {
                                addr: data.addr,
                                ipfsHash: data.ipfsHash,
                                hashFunction: data.hashFunction,
                                hashSize: data.hashSize,
                                ipfsCid,
                                metadataUrl,
                                name: metadata.name,
                                description: metadata.description,
                                website: metadata.website,
                                wikipedia: metadata.wikipedia,
                                twitter: metadata.twitter,
                                logo: metadata.logo,
                                translations: metadata.translations || {}
                            }
                        })
                    )
                }
                const _causes: Cause[] = await Promise.all<Cause>(promises).catch(e => []).then(_causes => _causes.filter(c => !!c))
                setCauses(_causes)
            }

            initCauses()
            .catch((e: Error) => console.error(e.message))
            .then(() => setLoading(false))
        }

        return () => {
            if (!web3Loading)
                mounted.current = false
        }
    }, [networkId, web3Loading])

    /**
     * Donate function verifies inputs and triggers an Ethereum transaction.
     */
    const donate = React.useCallback(async (distribution: Slice[], weiValue: number) => {
        if (!selectedAccount || !network)
            throw new Error("No valid Ethereum connexion.")
        if (!dAppContract || !dAppContract.address)
            throw new Error("LaBoiteADons contract not found.")

        // Check distribution is legit.
        var totalShares = 0
        distribution.forEach((slice: Slice, i: number) => {
            if (slice.shares <= 0)
                throw new Error("Distribution error: Missing cause ratio.")
            var cause = causes.find(c => c.addr === slice.addr)
            if (!cause)
                throw new Error("Distribution error: Missing cause address.")
            distribution[i].causeCid = cause.ipfsCid
            distribution[i].name = cause.name
            totalShares += slice.shares
        })
        
        const result = await dAppContract.distribute.sendTransaction(
            distribution.map((s: Slice) => s.addr),
            distribution.map((s: Slice) => s.shares.toString()),
            totalShares.toString(),
            {
                value: weiValue.toString(),
                from: selectedAccount, gas: "1200000"
            }
        )

        var donation: Donation = {
            distribution,
            weiValue,
            timestamp: Date.now(),
            transaction_hash: result.tx,
            networkId,
            status: DONATION_CONFIRMED,
            resultData: JSON.stringify(result)
        }

        // Save in history on success.
        var _donations: Donation[] = donations
        _donations.push(donation)
        window.localStorage.setItem("laboiteadons-history", JSON.stringify(_donations))
        setDonations(_donations)

        return donation
    }, [network, causes, networkId, selectedAccount, dAppContract, donations])
    
    return (
        <DAppContext.Provider value={{
            donations,
            causes,
            causesOrgan,
            dAppContract,
            dAppIpfsCid,
            ipfsNode: null,
            loading,
            availableNetworkIds,
            donate
        }}>
        {props.children}
        </DAppContext.Provider>
    )
}

export const useDApp = () => React.useContext(DAppContext)

export const withDApp = (ComposedComponent: React.ComponentClass) =>
    (props: any) => <ComposedComponent dapp={useDApp()} {...props} />

export const translateCauseField: (cause: Cause, field: "name"|"description"|"website"|"wikipedia"|"twitter"|"logo", langCode: string) => string = (cause, field, langCode) => (
    cause.translations && cause.translations[langCode] && cause.translations[langCode][field] ?
        cause.translations[langCode][field] : cause[field]
) || ""