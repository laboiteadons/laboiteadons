# La Boîte à Dons
https://laboiteadons.org  
Track, distribute and repeat donations.

## Disclaimer
The App and Governance Contracts are not deployed on the Ethereum Main Network and we recommend not doing so until all contracts have been validated by the community and Causes who wish to join the platform have distributed their wallet addresses in a safe and verifiable way.  
Until such time, there will be no transaction of real currency.  
When creating a Donation, you are sending Test Ether to several wallets. These wallets are not associated with real active Causes and, even though the Test Ether has no value, you do not need to send a lot of it to test the App and its Governance.

The App is deployed on Rinkeby Ethereum Test Network, you can get Test Ether in the [Rinkeby Authenticated Faucet](https://faucet.rinkeby.io/). We recommend creating an Etherum Wallet dedicated to the purpose of testing this app, to keep your online identities separated. (Never store real Ether in a test Wallet!)  
Learn more about Ethereum Wallets and how to get one on [Ethereum's official page](https://ethereum.org/wallets/), or get the [Metamask Browser Extension](https://metamask.io/) now.


## Concept
Instead of donating once to one Cause (for example "Doctors without Borders" or a specific project of theirs), we give the ability to distribute donations safely across several Causes, and reducing the fees associated with that management. Using the Ethereum public blockchain, transactions are transparent and traceable, giving donators a better overview on how the Causes are empowered by their donations.  
Because most Causes do not currently accept cryptocurrencies donations, the app is a proof-of-concept of a fully decentralized autonomous donations platform.
It is built with React, Bootstrap, Typescript, Web3js, IPFS, Organigr.am and Textile.

## Architecture
The app is designed to be fully decentralised, and encrypted. It will run as long as the files necessary to run it are shared on the IPFS network.  

Data on the Causes (wallet addresses, tracking information, project and metadata) is stored on IPFS manually, referenced in a smart-contract and updated through a [transparent decentralized governance](https://organigr.am/org/laboiteadons). The app itself is currently hosted automatically on IPFS from Github in a [Textile Bucket](https://blog.textile.io/tag/buckets/). Users data is stored locally in the browser, but will be synced later-on using [Textile Threads](https://blog.textile.io/tag/threads/). For now, no personal data ever leaves the device of the user. When moving to Textile Threads, data will be end-to-end encrypted with OpenPGP.js.  
There is, by design, no central authority.

### Notifications
The app is unable to process payments for the user without his direct consent as an Ethereum transaction signature. In order to donate every month, users need to open the app and create new transactions themselves.  
To make transactions cyclical, we implement a basic (although secure) email notifications server (centralized) on the side. You can register your email to receive our newsletter on https://laboiteadons.org. It will be sent once every month, act as a reminder, and share with you updates on the service and features.  
Your email address or any other data you share with us are never used or shared outside of this newsletter. This service is not mandatory and, of course, you can create reminders any way you like.

## Governance
For now, adding entries is done by the maintainer of the project on github. Later, a community might decide on a more appropriate model for governance, from the Executive decisions about the project's future, to the ability to control and fix the selection of organisations and their informations.

Current governance organigram is available at
https://organigr.am/org/laboiteadons.

## Contributions
Github contributions are welcome from everyone as Pull Requests. Feature requests can be sent as tickets on Github.

### TODO
- Check if MIT license is compatible with all dependencies' licenses...
- Fix UI.
- Encrypt and sync users' donations history.
- Validate smart contracts.
- Make donations cyclical (or decentralize the notifications).

----------------------------

## Requirements
- [Yarn](https://yarnpkg.com/)

## Quick start (Ethereum Test Network)
```bash
yarn install
yarn start

# Set your Ethereum client (Metamask for example)
# to the Rinkeby Ethereum Test Network.
```

## Quick start (local)
```bash
# You will need 3 terminal windows to keep services running.

# Install dependencies.
yarn install

# Start an IPFS node locally.
yarn ipfs

# In another terminal
# Start truffle console with local blockchain.
yarn ethereum
# Here you can take note of the generated private keys and
# add the first private key to Metamask or your Ethereum client.
# Never store any real (mainnet) Ether in a development wallet!
# In truffle console:
# Compile and migrate contracts.
migrate --reset

# In another terminal:
# Starts React development server.
yarn start

# Ctrl+C will exit truffle console and the React server.
```

## Installation
```bash
yarn install
```
Installs development tools.

```bash
yarn start
```
Runs a local install of the app you can access at http://localhost:3000/.

```bash
yarn ipfs
```
Runs an IPFS node locally.  
IPFS will store and make available our files for as long as they are pinned on a reachable node.  
To keep your files available and close to your clients, consider using pinning services like [Pinata](https://pinata.cloud/), [Temporal](https://temporal.cloud/), [Eternum](https://www.eternum.io/), [Constellation FS](https://constellation-fs.org/) or [Textile](https://textile.io/).  
You can also look at the upcoming [Filecoin](https://filecoin.io/) and [Textile Powergate](https://blog.textile.io/tag/powergate) projects as decentralized on-demand storage.

```bash
yarn truffle develop
```
Runs a local Ethereum network with Ganache, so you can try the app by connecting Metamask to http://localhost:9545 (with Network ID: 5777).
The command will generate private keys you can add to Metamask to test your account.

Use these keys for development. Never store any mainnet Ether for shared private keys!

In the Truffle Development Console, you can run these commands:

```bash
compile
```
Compiles contracts.

```bash
migrate
```
Migrates organisation on the selected (local by default) ethereum blockchain.

```bash
migrate --reset
```
Migrates organisation on the selected (local by default) ethereum blockchain, overwriting previous migrations data.

```
CTRL+C
```
Exits Truffle console.

----------------------------

## License
Code is available as is, under the very permissive MIT license. You can copy, modify, use and distribute this software without limitations.
[Read the full License here](./LICENSE.md)

Authored and maintained by [alxmhe](https://github.com/alxmhe)

https://github.com/laboiteadons/laboiteadons