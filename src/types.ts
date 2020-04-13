export interface CauseTranslation {
    name: string|undefined,
    description: string|undefined,
    website: string|undefined,
    wikipedia: string|undefined,
    twitter: string|undefined,
    logo: string|undefined
}

export interface CauseTranslations {
    [L: string]: CauseTranslation
}

export interface Cause {
    addr: string,
    ipfsHash: string,
    hashFunction: number,
    hashSize: number,
    ipfsCid: string,
    name: string,
    description: string,
    website: string,
    wikipedia: string,
    twitter: string,
    logo: string,
    translations: CauseTranslations
}

export interface Slice {
    name: string,
    addr: string,
    shares: number,
    causeCid: string
}

export interface Donation {
    distribution: Slice[],
    weiValue: number,
    timestamp: number,
    transaction_hash: string,
    networkId: string,
    status: string,
    resultData: string|null|undefined
}