/**
 * 
 *  Writes an IPFS CID as a multihash you can send in a Ethereum smart contract transaction.
 * 
 *  Usage :
 *  node scripts/ipfsToEthereum.js Qmc7zykqw1eSfxPowk6tARAJHm2BqCjDsziepFGFcWqYBi
 *  node scripts/ipfsToEthereum.js bafybeigmyx6fdgdd5nbewh6rrvro6na7gfuzryj763tedhxu6bkszrvf7e
 * 
 */

var CID = require('cids')

var cid = new CID(process.argv[2])
if (!cid) return;
var multihash = cid.multihash.toString('hex')

console.log("\n# CID v0")
console.log(cid.toV0().toString())

console.log("\n# CID v1")
console.log(cid.toV1().toString())

console.log("\n# Multihash")
console.log(JSON.stringify({
  hash: "0x" + multihash.slice(4),
  size: "0x" + multihash.slice(0, 2),
  function: "0x" + multihash.slice(2, 4)
}, null, 2))