var contract = require('@truffle/contract')
var ipfsClient = require('ipfs-http-client')
var ipfsNode = require('ipfs')
var bs58 = require('bs58')
var all = require('it-all')

var LaBoiteADons = artifacts.require("LaBoiteADons")
var OrganLibrary = require("@organigram/contracts/build/contracts/OrganLibrary.json")
var ProcedureLibrary = require("@organigram/contracts/build/contracts/ProcedureLibrary.json")
var Organ = require("@organigram/contracts/build/contracts/Organ.json")
var NominationProcedure = require("@organigram/contracts/build/contracts/SimpleNominationProcedure.json")
var organLibrary = contract(OrganLibrary)
var procedureLibrary = contract(ProcedureLibrary)
var organ = contract(Organ)
var nominationProcedure = contract(NominationProcedure)

const EMPTY_BYTES_32 = "0x00000000000000000000000000000000"
const PROJECT_METADATA = {
  name: "La Boîte à Dons",
  url: "https://laboiteadons.org",
  repository: "https://github.com/laboiteadons/laboiteadons",
  organigram: "https://organigr.am/org/laboiteadons",
  license: "MIT"
}

module.exports = async function(deployer, network, accounts) {
  const from = accounts[0]
  console.log("Current account", from)

  var ipfs = null
  
  var laboiteadons = await LaBoiteADons.deployed()
  if (!laboiteadons.address)
    throw new Error("LaBoiteADons contract has not been deployed on this network. Run all migrations.")
  console.log("laboiteadons", laboiteadons.address)

  organLibrary.setProvider(deployer.provider)
  procedureLibrary.setProvider(deployer.provider)
  organ.setProvider(deployer.provider)
  organ.setNetwork(network)
  nominationProcedure.setProvider(deployer.provider)
  nominationProcedure.setNetwork(network)

  // Deploy libraries.
  const _orgLib = await deployer.deploy(organLibrary, { from: accounts[0] })
  const _procLib = await deployer.deploy(procedureLibrary, { from: accounts[0] })
  await organ.link("OrganLibrary", _orgLib.address)
  await nominationProcedure.link("ProcedureLibrary", _procLib.address)

  /**
   * When deploying on a local network, organigram contracts libraries are not deployed yet.
   */
  if (network === "develop") {
    // Connect to IPFS Daemon API Server running locally.
    ipfs = ipfsClient('http://localhost:5002')
    if (!ipfs)
      throw new Error("Run `yarn ipfs` to start an IPFS node locally.")
  }
  else {
    ipfs = await ipfsNode.create()
    if (!ipfs)
      throw new Error("No IPFS node running.")
    if (!_orgLib.address)
      throw new Error("OrganLibrary has not been deployed on this network.")
    if (!_procLib.address)
      throw new Error("ProcedureLibrary has not been deployed on this network.")
  }

  const ipfsVersion = await ipfs.version()
  console.log("ipfsVersion", ipfsVersion)

  // Add Metadata to IPFS
  const [
    adminsMetadataPin,
    moderatorsMetadataPin,
    causesMetadataPin,
    nominateModeratorsMetadataPin,
    nominateCausesMetadataPin,
    nominateAdminsMetadataPin,
    updateAdminsMetadataPin
  ] = await all(ipfs.add([
    JSON.stringify({
      title: "Administrators",
      type: "organ",
      entriesTypes: ["accounts"],
      description: "Administrators can upgrade contracts and governance, and shutdown the project.",
      project: PROJECT_METADATA,
      contract: {
        abi: Organ.abi
      }
    }),
    JSON.stringify({
      title: "Moderators",
      type: "organ",
      entriesTypes: ["accounts"],
      description: "Moderators manage the causes available on the platform.",
      project: PROJECT_METADATA,
      contract: {
        abi: Organ.abi
      }
    }),
    JSON.stringify({
      title: "Causes",
      type: "organ",
      entriesTypes: ["accounts", "documents"],
      description: "Causes are wallet addresses and their associated metadata as a JSON document.",
      project: PROJECT_METADATA,
      contract: {
        abi: Organ.abi
      }
    }),
    JSON.stringify({
      title: "Moderators Nomination",
      type: "procedure",
      procedureType: "SimpleNomination",
      description: "Moderators are nominated by Administrators.",
      project: PROJECT_METADATA,
      contract: {
        abi: nominationProcedure.abi
      }
    }),
    JSON.stringify({
      title: "Causes Nomination",
      type: "procedure",
      procedureType: "SimpleNomination",
      description: "Causes are nominated by Moderators.",
      project: PROJECT_METADATA,
      contract: {
        abi: nominationProcedure.abi
      }
    }),
    JSON.stringify({
      title: "Admins Nomination",
      type: "procedure",
      procedureType: "SimpleNomination",
      description: "Administrators are nominated by Administrators.",
      project: PROJECT_METADATA,
      contract: {
        abi: nominationProcedure.abi
      }
    }),
    JSON.stringify({
      title: "Upgrade",
      type: "procedure",
      procedureType: "SimpleNomination",
      description: "Procedures are nominated by Administrators.",
      project: PROJECT_METADATA,
      contract: {
        abi: nominationProcedure.abi
      }
    })
  ]))
  console.log("Added Organs and Procedures metadata to IPFS.")

  // Admins have full authority to update the system.
  const adminsMetadataPinMultihash = cidToMultihash(adminsMetadataPin.cid.toString())
  const admins = await organ.new(
    accounts[0],
    adminsMetadataPinMultihash.hash,
    adminsMetadataPinMultihash.function,
    adminsMetadataPinMultihash.size,
    { from }
  )
  console.log("Organ Admins deployed.")

  // Moderators can update Causes list.
  const moderatorsMetadataPinMultihash = cidToMultihash(moderatorsMetadataPin.cid.toString())
  const moderators = await organ.new(
    accounts[0],
    moderatorsMetadataPinMultihash.hash,
    moderatorsMetadataPinMultihash.function,
    moderatorsMetadataPinMultihash.size,
    { from }
  )
  console.log("Organ Moderators deployed.")

  // Causes listed as Organ entries.
  const causesMetadataPinMultihash = cidToMultihash(causesMetadataPin.cid.toString())
  const causes = await organ.new(
    accounts[0],
    causesMetadataPinMultihash.hash,
    causesMetadataPinMultihash.function,
    causesMetadataPinMultihash.size,
    { from }
  )
  console.log("Organ Causes deployed.")

  // Admins nominate Moderators.
  const nominateModeratorsMetadataPinMultihash = cidToMultihash(nominateModeratorsMetadataPin.cid.toString())
  const nominateModerators = await nominationProcedure.new(
    nominateModeratorsMetadataPinMultihash.hash,
    nominateModeratorsMetadataPinMultihash.function,
    nominateModeratorsMetadataPinMultihash.size,
    admins.address,
    { from }
  )
  console.log("Procedure Moderators Nomination deployed.")

  // Moderators nominate Causes.
  const nominateCausesMetadataPinMultihash = cidToMultihash(nominateCausesMetadataPin.cid.toString())
  const nominateCauses = await nominationProcedure.new(
    nominateCausesMetadataPinMultihash.hash,
    nominateCausesMetadataPinMultihash.function,
    nominateCausesMetadataPinMultihash.size,
    moderators.address,
    { from }
  )
  console.log("Procedure Causes Nomination deployed.")

  // Admins can nominate Admins.
  const nominateAdminsMetadataPinMultihash = cidToMultihash(nominateAdminsMetadataPin.cid.toString())
  const nominateAdmins = await nominationProcedure.new(
    nominateAdminsMetadataPinMultihash.hash,
    nominateAdminsMetadataPinMultihash.function,
    nominateAdminsMetadataPinMultihash.size,
    admins.address,
    { from }
  )
  console.log("Procedure Admins Nomination deployed.")

  // Admins can update all Organs.
  const updateAdminsMetadataPinMultihash = cidToMultihash(updateAdminsMetadataPin.cid.toString())
  const updateAdmins = await nominationProcedure.new(
    updateAdminsMetadataPinMultihash.hash,
    updateAdminsMetadataPinMultihash.function,
    updateAdminsMetadataPinMultihash.size,
    admins.address,
    { from }
  )
  console.log("Procedure System Update deployed.")

  // In Organigr.am Contracts, permissions are set as 8 bits like so :
  // {canAddProcedure}{canRemoveProcedure}00{canAddEntry}{canRemoveEntry}{canWithdraw}{canDeposit}
  // For example, full permissions would give 11001111 or 0xCF (in hexadecimal) or 207 in decimal.
  // 0x0C = can add and remove entries.
  // 0xC0 = can add and remove procedures.
  // 0xCC = can add and remove entries and procedures.
  // By default, the owner (deployer) has permissions 0xC0.

  // Add procedure with entries permissions on Causes.
  await causes.addProcedure(nominateCauses.address, 0x0C, { from })
  console.log("causes.addProcedure(nominateCauses.address, 0x0C)")

  // Add user to Admins.
  // Change permissions to update entries from current user.
  await admins.replaceProcedure(accounts[0], accounts[0], 0xCC, { from })
  console.log("admins.replaceProcedure(accounts[0], accounts[0], 0xCC)")
  await admins.addEntry(accounts[0], EMPTY_BYTES_32, 0, 0, { from })
  console.log("admins.addEntry(accounts[0])")
  // Update procedures on Admins.
  await admins.addProcedure(nominateAdmins.address, 0x0C, { from })
  console.log("admins.addProcedure(nominateAdmins.address, 0x0C)")
  // We always need at least one procedure with 11****** rights.
  await admins.replaceProcedure(accounts[0], updateAdmins.address, 0xC0, { from })
  console.log("admins.replaceProcedure(accounts[0], updateAdmins.address, 0xC0)")

  // Add user to Moderators.
  // Change permissions to update entries from current user.
  await moderators.replaceProcedure(accounts[0], accounts[0], 0xCC, { from })
  console.log("moderators.replaceProcedure(accounts[0], accounts[0], 0xCC)")
  await moderators.addEntry(accounts[0], EMPTY_BYTES_32, 0, 0, { from })
  console.log("moderators.addEntry(accounts[0])")
  // Update procedures on Moderators.
  await moderators.addProcedure(nominateModerators.address, 0x0C, { from })
  console.log("moderators.addProcedure(nominateModerators.address, 0x0C)")
  await moderators.replaceProcedure(accounts[0], updateAdmins.address, 0xC0, { from })
  console.log("moderators.replaceProcedure(accounts[0], updateAdmins.address, 0xC0)")

  // Update admins of remaining organs.
  if (network === "develop" || network === "rinkeby") {
    await causes.replaceProcedure(accounts[0], accounts[0], 0xCC, { from })
    console.log("causes.replaceProcedure(accounts[0], accounts[0], 0xCC)")
    // Add some demo Causes.
    const causesDemosPins = await all(ipfs.add([
      JSON.stringify({
        name: "(Demo) Médecins sans Frontières (MSF)",
        wallet: accounts[1],
        proof: true,
        description: "Doctors Without Borders or Médecins Sans Frontières (MSF) is a non profitable international medical humanitarian organization created by doctors and journalists in France in 1971. MSF gives emergency aid to people affected by wars, epidemics, famine, natural disasters and man-made disasters, or areas where there is no health care available. It provides this help to all people, regardless of their race, religion or political beliefs.",
        website: "https://www.msf.org/",
        wikipedia: "https://en.wikipedia.org/wiki/M%C3%A9decins_Sans_Fronti%C3%A8res",
        twitter: "https://twitter.com/msf",
        logo: "https://upload.wikimedia.org/wikipedia/en/b/bd/Msf_logo.svg"
      }),
      JSON.stringify({
        name: "(Demo) World Wildlife Fund for Nature (WWF)",
        wallet: accounts[2],
        proof: true,
        description: "The World Wide Fund for Nature (WWF) is an international environmental organization. The group says its mission is \"to halt and reverse the destruction of our natural environment\”. Much of its work focuses on the conservation of three biomes that contain most of the world's biodiversity: forests, freshwater ecosystems, and oceans and coasts.",
        website: "https://www.worldwildlife.org/",
        wikipedia: "https://en.wikipedia.org/wiki/World_Wide_Fund_for_Nature",
        twitter: "https://twitter.com/WWF",
        logo: "https://upload.wikimedia.org/wikipedia/en/2/24/WWF_logo.svg"
      }),
      JSON.stringify({
        name: "(Demo) Amnesty International (AI)",
        wallet: accounts[3],
        proof: true,
        description: "Amnesty International (also called AI or Amnesty) is an international organization founded in London in 1961. They promote human rights. This organization was the recipient of the Nobel Peace Prize in 1977 and is one of the most widely-known human rights groups in the world. The six key areas that Amnesty International focuses on are refugee rights, the rights of women, children, and of minorities, ending torture, stopping the death penalty, the rights of people imprisoned because of what they believe, and protection of human dignity.",
        website: "https://www.amnesty.org/",
        wikipedia: "https://en.wikipedia.org/wiki/Amnesty_International",
        twitter: "https://twitter.com/amnesty",
        logo: "https://upload.wikimedia.org/wikipedia/en/e/ee/Amnesty_International_logo.svg"
      }),
      JSON.stringify({
        name: "(Demo) Humanity & Inclusion (HI)",
        wallet: accounts[4],
        proof: true,
        description: "Humanity & Inclusion (formerly Handicap International) is an international non-governmental organization. It was founded in 1982 to provide help in refugee camps in Cambodia and Thailand. Headquartered in France and Belgium, it aims to help disabled and vulnerable people in situations of poverty and exclusion, conflict and disaster. More than 3,500 field staff are currently located in more than 60 countries worldwide.",
        website: "https://hi.org/",
        wikipedia: "https://en.wikipedia.org/wiki/Humanity_&_Inclusion",
        twitter: "https://twitter.com/HI_is_hiring",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/53/Handicap_International_Logo_2018.png"
      }),
      JSON.stringify({
        name: "(Demo) Electronic Frontier Foundation (EFF)",
        wallet: accounts[5],
        proof: true,
        description: "The Electronic Frontier Foundation (EFF) is an international non-profit based in San Francisco, United States. It was started in July 1990 by John Gilmore, John Perry Barlow and Mitch Kapor to promote Internet freedoms. The EFF sponsors legal defense, defends individuals and new technology from unfair legal threats. It also monitors proposals that may weaken internet freedoms and liberties. It also monitors for possible weakening of fair use.",
        website: "https://www.eff.org/",
        wikipedia: "https://en.wikipedia.org/wiki/Electronic_Frontier_Foundation",
        twitter: "https://twitter.com/eff",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/9b/EFF_Logo_2018.svg"
      }),
      JSON.stringify({
        name: "(Demo) Bill & Melinda Gates Foundation (BMGF)",
        wallet: accounts[6],
        proof: true,
        description: "The Bill & Melinda Gates Foundation (BMGF) is a non-profit organisation that donates money to fight diseases. It was founded by Bill Gates of Microsoft and his wife Melinda Gates. The money comes from the billions of dollars Bill Gates earned from his software business.",
        website: "https://www.gatesfoundation.org/",
        wikipedia: "https://en.wikipedia.org/wiki/Bill_%26_Melinda_Gates_Foundation",
        twitter: "https://twitter.com/gatesfoundation",
        logo: "https://upload.wikimedia.org/wikipedia/commons/6/66/Bill_%26_Melinda_Gates_Foundation_logo.svg"
      }),
      JSON.stringify({
        name: "(Demo) United Nations Children's Fund (UNICEF)",
        wallet: accounts[7],
        proof: true,
        description: "UNICEF is an international organization established by the United Nations in 1946. UNICEF has decided the following 5 areas as priority or main areas: Young Child Survival and Development, Primary Education and Gender Equality, Child protection, HIV/AIDS, Early childhood.",
        website: "https://www.unicef.org/",
        wikipedia: "https://en.wikipedia.org/wiki/UNICEF",
        twitter: "https://twitter.com/UNICEF",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/1f/UNICEF_Logo.svg"
      })
    ]))
    await Promise.all(
      causesDemosPins.map((pin, i) => {
        const multihash = cidToMultihash(pin.cid.toString())
        return causes.addEntry(accounts[i+1], multihash.hash, multihash.function, multihash.size, { from })
      })
    )
    console.log("Added Causes metadata to IPFS.")
  // end of develop network only block.
  }
  await causes.replaceProcedure(accounts[0], updateAdmins.address, 0xC0, { from })
  console.log("causes.replaceProcedure(accounts[0], updateAdmins.address, 0xC0)")

  // Governance is deployed.
  console.log("Governance deployed.")
  console.log({
    "Admins": {
      "address": admins.address,
      "procedures": await getProcedures(admins),
      "entries": await getEntries(admins),
      "organData": await admins.organData().then(result => prettyOrganData(result)),
      "metadata": adminsMetadataPin.cid.toString()
    },
    "Moderators": {
      "address": moderators.address,
      "procedures": await getProcedures(moderators),
      "entries": await getEntries(moderators),
      "organData": await moderators.organData().then(result => prettyOrganData(result)),
      "metadata": moderatorsMetadataPin.cid.toString()
    },
    "Causes": {
      "address": causes.address,
      "procedures": await getProcedures(causes),
      "entries": await getEntries(causes),
      "organData": await causes.organData().then(result => prettyOrganData(result)),
      "metadata": causesMetadataPin.cid.toString()
    },
    "CausesNomination": {
      "address": nominateCauses.address,
      "metadata": nominateCausesMetadataPin.cid.toString(),
      "authorizedNominatersOrgan": await nominateCauses.authorizedNominatersOrgan()
    },
    "ModeratorsNomination": {
      "address": nominateModerators.address,
      "metadata": nominateModeratorsMetadataPin.cid.toString(),
      "authorizedNominatersOrgan": await nominateModerators.authorizedNominatersOrgan()
    },
    "AdminsNomination": {
      "address": nominateAdmins.address,
      "metadata": nominateAdminsMetadataPin.cid.toString(),
      "authorizedNominatersOrgan": await nominateAdmins.authorizedNominatersOrgan()
    },
    "Upgrade": {
      "address": updateAdmins.address,
      "metadata": updateAdminsMetadataPin.cid.toString(),
      "authorizedNominatersOrgan": await updateAdmins.authorizedNominatersOrgan()
    }
  })

  // Storing causes organ address in LaBoiteADons.
  await laboiteadons.setCausesOrgan(causes.address)
  console.log("laboiteadons.setCausesOrgan(causes.address)")
  console.log("")
  console.log("LaBoiteADons deployed at", laboiteadons.address)
}

const cidToMultihash = cid => {
  const decoded = bs58.decode(cid).toString('hex')
  return {
    hash: `0x${decoded.slice(4)}`,
    function: `0x${decoded[0]}${decoded[1]}`,
    size: `0x${decoded[2]}${decoded[3]}`
  }
}

const prettyOrganData = result => result && ({
  owner: result.owner,
  metadataIpfsHash: result.metadataIpfsHash,
  metadataIpfsFunction: result.metadataHashFunction && result.metadataHashFunction.toString(),
  metadataIpfsSize: result.metadataHashSize && result.metadataHashSize.toString(),
  entriesCount: result.entriesCount && result.entriesCount.toString(),
  proceduresCount: result.proceduresCount && result.proceduresCount.toString()
})

const getProcedures = async organ => {
  const length = (await organ.getProceduresLength()).toString()
  var i = 1
  var proceduresPromises = []
  for (i ; String(i) !== length ; i++) {
    proceduresPromises.push(
      organ.getProcedure(i)
      .then(async procedure => {
        const { permissions } = await organ.getPermissions(procedure)
        return {
          procedure,
          permissions: permissions.toString()
        }
      })
      .catch(e => console.error("Error", e.message))
    )
  }
  const _procedures = await Promise.all(proceduresPromises)
  var procedures = {}
  _procedures.filter(p => !!p).forEach(({ procedure, permissions }) => {
    procedures[procedure] = permissions
  })
  return procedures
}

const getEntries = async organ => {
  const length = (await organ.getEntriesLength()).toString()
  if (length === "0")
    return []

  var i = 1
  var promises = []
  for (i ; String(i) != length ; i++) {
    promises.push(
      organ.getEntry(i).then(entry => entry.addr)
      .catch(e => console.error("Error", e.message))
    )
  }
  return Promise.all(promises)
}