import React from 'react'
import { Switch, Route, Redirect, NavLink, useRouteMatch, Link } from 'react-router-dom'
import { NavItem, Container, Nav } from 'reactstrap'

export const AboutPage = () => {
  const { path } = useRouteMatch()
  return (
    <Container>
      <Nav tabs>
        <NavItem><NavLink to={`${path}/us`} className="nav-link">Us</NavLink></NavItem>
        <NavItem><NavLink to={`${path}/blockchain`} className="nav-link">Ethereum Blockchain</NavLink></NavItem>
        <NavItem><NavLink to={`${path}/hosting`} className="nav-link">IPFS Hosting</NavLink></NavItem>
        <NavItem><NavLink to={`${path}/governance`} className="nav-link">Organigr.am Governance</NavLink></NavItem>
        <NavItem><NavLink to={`${path}/wallet`} className="nav-link">Getting a Wallet</NavLink></NavItem>
      </Nav>
      <div className="mt-5">
        <Switch>
          <Route exact path={`${path}/us`} component={AboutUsPage} />
          <Route exact path={`${path}/blockchain`} component={AboutEthereumPage} />
          <Route exact path={`${path}/hosting`} component={AboutIPFSPage} />
          <Route exact path={`${path}/governance`} component={AboutOrganigramPage} />
          <Route exact path={`${path}/wallet`} component={AboutWalletPage} />
          <Route><Redirect to={`${path}/us`} /></Route>
        </Switch>
      </div>
    </Container>
  )
}

export const AboutUsPage = React.memo(() => (
  <>
    <h2>About La Boîte à Dons</h2>
    <p className="lead">Track, distribute and repeat donations.</p>
    <p>
      Instead of donating once to one Cause (for example "Doctors without Borders" or a specific project of theirs), La Boîte à Dons gives the ability to distribute donations safely across several Causes, and reducing the fees associated with that management. Using the Ethereum public blockchain, transactions are transparent and traceable, giving donators a better overview on how the Causes are empowered by their donations.
    </p>
    <p>
      Because most Causes do not currently accept cryptocurrencies donations, the app is a <em>proof-of-concept</em> of a fully decentralized autonomous donations platform. It is built with React, Bootstrap, Typescript, Web3js, IPFS, Organigr.am and Textile.<br/>
      You can browse the full source code on its <a href="https://github.com/laboiteadons/laboiteadons" target="_blank" rel="noopener noreferrer">Github repository</a> and contribute to its development.
    </p>

    <h3>Disclaimer</h3>
    <p>
      The App and Governance Contracts are not deployed on the Ethereum Main Network and we recommend not doing so until all contracts have been validated by the community and Causes who wish to join the platform have distributed their wallet addresses in a safe and verifiable way.<br/>
      Until such time, there will be no transaction of real currency.<br/>
      When creating a Donation, you are sending Test Ether to several wallets. These wallets are not associated with real active Causes and, even though the Test Ether has no value, you do not need to send a lot of it to test the App and its Governance.
    </p>
    <p>
      The App is deployed on Rinkeby Ethereum Test Network, you can get Test Ether in the <a href="https://faucet.rinkeby.io/" target="_blank" rel="noopener noreferrer">Rinkeby Authenticated Faucet</a>. We recommend creating an Etherum Wallet dedicated to the purpose of testing this app, to keep your online identities separated. (Never store real Ether in a test Wallet!)<br/>
      Learn more about Ethereum Wallets and how to get one on <a href="https://ethereum.org/wallets/" target="_blank" rel="noopener noreferrer">Ethereum's official page</a>, or get the <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">Metamask Browser Extension</a> now.
    </p>

    <h3>Decentralization</h3>
    <p>
      The app is fully decentralized, in the sense that no individual or corporation can control, censor or track users or their datas. You don't even need an account to use the app!<br/>
      An underlying organisation has the authority to add and remove causes, and update contracts. Anyone can join the organisation and adapt it from the democratic framework already chosen by the community.
    </p>

    <h3>Notifications</h3>
    <p>
      The app is unable to process payments for the user without his direct consent as an Ethereum transaction signature. In order to donate every month, users need to open the app and create new transactions themselves.
    </p>
    <p>
      To make transactions cyclical, we implement a basic (although secure) email notifications server (centralized) on the side. You can register your email to receive our newsletter on https://laboiteadons.org. It will be sent once every month, act as a reminder, and share with you updates on the service and features.
    </p>
    <p>
      Your email address or any other data you share with us are never used or shared outside of this newsletter. This service is not mandatory and, of course, you can create reminders any way you like.
    </p>
  </>
))

export const AboutEthereumPage = React.memo(() => (
  <>
    <h2>About Ethereum</h2>
    <p className="lead">
      Ethereum is a public globally distributed and decentralized blockchain protocol.
    </p>
    <p>
      An Ethereum network is comprised of computer nodes processing the exact same ledger of instructions in real time. It acts like a "World-Computer" capable of executing programmed "smart" contracts that cannot be tempered, cheated or destroyed.<br/>
      Consensus about the "Truth" is reached through complex mathematics guaranteeing the immutability of the chain. Transactions are processed in blocks mined every 13 seconds (current average when writing this) by nodes. Miners are then rewarded by transactions fees. The currency for the fees is called Ether.
    </p>
    <p>
      Ethereum is the most advanced and usable blockchain in the world.
    </p>
    <p>
      <a href="https://ethereum.org" target="_blank" rel="noopener noreferrer">Learn more about blockchains and Ethereum</a>
    </p>

    <h3>Why a Blockchain?</h3>
    <p>
      Ethereum brings by design many useful properties to a Donations platform.
    </p>
    <p>
      <em>Decentralization</em> means that the hashing power responsible for securing the "Truth", the ledger of everything that is or has been recorded the chain, is sufficiently distributed so that no individual nor organisation can take control of the history of the blockchain. The more decentralized the blockchain is, the more secure it gets.
    </p>
    <p>
      <em>Immutability</em> means that a transaction that has been recorded cannot be removed, guaranteeing the actual transfers of values and securing votes and instructions.<br/>
      When opensourcing the smart contract, anyone can verify that the app is using the actual code, that its instructions are safe, and that no "dirty business" happens any time during usage. Because of that, there is no need to trust foreign actors in a transaction, as long as you trust the blockchain and the contract.<br/>
      When you get a receipt for your transaction, it will always be valid and cannot be fake.
    </p>
    <p>
      <em>Transparency</em> means that any transaction can be verified freely by anyone browsing the ledger, with the value transfered and instructions data. Encrypted data never appears as clear on the chain.<br/>
      When donating, you are sending funds to the app's smart contract. When browsing the blockchain, you can see that the smart contract redistributes the funds to the registered causes wallets. Then, you can continue to trace the funds until they reach a project's wallet or a contributor. You can control that the funds are moving correctly and are not diverted.
    </p>
    <p>
      <em>High block frequency</em> means that, when transactions happening in real time are processed and recorded to the chain in blocks, it happens fast enough so that it doesn't block real-life processes.<br/>
      Sending funds to several wallets around the World is nearly instantenous. You will usually get the confirmation in a few seconds.
    </p>
    <p>
      <em>Universality</em> means that the Ethereum blockchain can be directly accessed by any application connected to the Internet, on any device, in many different programming languages, without censorship or network control. At its most basic, you only need to write down ten words on a piece of paper to have a wallet on the Ethereum blockchain.
    </p>

    <h3>LaBoîteÀDons smart contract</h3>
    <p>
      The contract validates the distribution against a list of causes elected by the community (<Link to="/about/governance">read more in the Governance section</Link>).<br/>
      Then, if everything is valid, it processes every outgoing transactions one by one. The contract never stores funds itself.<br/>
      On failure, funds are transferred back to the sender's wallet.
    </p>
  </>
))

export const AboutIPFSPage = React.memo(() => (
  <>
    <h2>About IPFS</h2>
    <p className="lead">
      The InterPlanetary File System (IPFS) is a globally distributed peer-to-peer file system.
    </p>
    <p>
      It works by referencing to files using unique identifiers, a hash computed from the content of the file, and not by names. If several computers around the World share the same file, they will be using the same hash, and the user requesting the file will be able to download it from the closest servers.
    </p>
    <p>
      <a href="https://ipfs.io" target="_blank" rel="noopener noreferrer">Learn more about IPFS</a>
    </p>

    <h3>Hosting of La Boîte à Dons</h3>
    <p>
      In the app, the metadata about the Causes (name, description, identity proof, wallet, website, wikipedia, social networks urls) are all stored in IPFS. The generated hash can only refer to this specific metadata and it is stored in the blockchain, to guarantee its immutability.<br/>
      We then consider that, as long as the file is available on the IPFS Network (as long as at least 1 computer is sharing this file), its integrity is proven.
    </p>
    <p>
      The frontend of La Boîte à Dons, which is the website you're currently browsing, is also stored on IPFS, making it faster to retrieve, resilient against censorship, and existing only because several people want it to exist.<br/>
      The domain name is pointing to Cloudflare free IPFS gateway, but the exact same website is available by visiting the IPFS hash with any IPFS gateway, even one hosted locally.<br/>
      The website is hosted on a <a href="https://blog.textile.io/tag/buckets/" target="_blank" rel="noopener noreferrer">Textile Bucket</a>, a service providing automatic IPFS hosting when pushing changes to the code repository.
    </p>

    <h3>(Coming soon) Backing up La Boîte à Dons</h3>
    <p>
      When you browser the website, you run your own IPFS node in the browser and automatically pin the metadata files and the website code, effectively making the service more resilient and the website faster to load for everybody.<br/>
      If you want to help other people access the website, simply keep it running, or pin the files in your own IPFS node.
    </p>
  </>
))

export const AboutOrganigramPage = React.memo(() => (
  <>
    <h2>About Organigr.am</h2>
    <p className="lead">
      Organigr.am provides Organisations-as-a-Service by letting users draw their organigrams and deploy their Organs and Procedures on a blockchain platform.
    </p>

    <p>
      Deploying your organisation on the blockchain brings its properties in your internal and external management : easy digital transformation and automation, transparency, security, low costs of operations, cheap audits, and universality of access.
    </p>
    <p>
      <a href="https://organigr.am" target="_blank" rel="noopener noreferrer">Learn more about Organigr.am</a>
    </p>

    <h3>Governance of La Boîte à Dons</h3>
    <p>
      With Organigr.am, the architecture of the organisation can evolve quickly to meet the needs of the community.<br/>
      The main Organ needed to operate the application represents the list of Causes available to the users. By using an Organigr.am Organ, we define one source of truth for this list, immutable and transparent, with a browsable history.
    </p>
    <p>
      Currently, the organisation has 2 other Organs : Moderators, who can add and remove causes, and Administrators, who can add and remove Moderators, and update the system.<br/>
      You can browse and interact with the Organs through their available procedures on any Organigr.am client, or <a href="https://ethereum.org" target="_blank" rel="noopener noreferrer">https://organigr.am/org/laboiteadons</a>.
    </p>
  </>
))

export const AboutWalletPage = React.memo(() => (
  <>
    <h2>Getting started with a Wallet</h2>
    <p>Whether you decide to go with <a href="https://www.brave.com" target="_blank" rel="noreferrer noopener">Brave Browser</a> (we &lt;3 Brave) or the <a href="https://www.metamask.io" target="_blank" rel="noreferrer noopener">Metamask Browser Extension</a> for Chrome and Firefox, the steps to get started are very similar.</p>
    <p>Once installed, go to the <strong>"Crypto Wallets" window</strong>  (by clicking on the metamask extension icon, or in your browser settings) and "create a new local wallet".</p>
    <p>You will be directed to create your seed words. Follow the steps and <strong>backup your seed words</strong> by writing them down in a safe place, like a piece of paper, a password manager, an external drive in a vault... You will need your seed words to generate your private keys in case you lose access to your wallets. With your private keys, you can prove your identity on the Ethereum blockchain and transfer your funds.</p>
    <p>You can then <strong>"create an account"</strong> or "import an account from a private key" to get an account dedicated to this application. We recommend creating an account for each service you use to avoid sharing your transactions history and making it easier for applications to create a profile of you.</p>
    <p>By clicking on the "Network" name, you can <strong>switch to the Rinkeby Ethereum Test Network</strong>. There, only Test Ether are transferred and never real currencies.</p>
    <p>You can get Test Ether in the <a href="https://faucet.rinkeby.io/" target="_blank" rel="noreferrer noopener">Rinkeby Authenticated Faucet</a>.</p>
    <p>Congratulations! You now have your own Ethereum wallet. Keep it secure by <strong>never sharing your keys</strong>. Your wallet has a public address you can share and track on <a href="https://www.etherscan.io" target="_blank" rel="noreferrer noopener">Etherscan</a>.</p>
    <p><a href="https://ethereum.org/wallets">Find out more about Ethereum wallets and how to use them.</a></p>
    <p>
      <Link to="/donate" className="btn btn-primary">Try the app</Link>
    </p>
  </>
))

export default AboutPage