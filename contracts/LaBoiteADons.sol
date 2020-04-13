pragma solidity >=0.4.22 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@organigram/contracts/contracts/Organ.sol";

contract LaBoiteADons {
  using SafeMath for uint256;

  event donated(address cause, uint256 payment);

  address public owner;
  address public causesOrganAddress;
  bytes32 websiteIpfsHash;
  uint8 websiteHashFunction;
  uint8 websiteHashSize;

  constructor(address _causesOrganAddress) public {
    owner = msg.sender;
    causesOrganAddress = _causesOrganAddress;
    websiteIpfsHash = 0x0;
    websiteHashFunction = 0;
    websiteHashSize = 0;
  }

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function distribute(address payable[] calldata causes, uint256[] calldata shares, uint256 totalShares)
    external payable
  {
    require(causes.length == shares.length, "LaBoiteADons: causes and shares length mismatch.");
    require(causes.length > 0, "LaBoiteADons: no causes.");
    require(totalShares > 0, "LaBoiteADons: no shares.");
    require(msg.value > 0, "LaBoiteADons: no funds received.");

    uint256 _receivedTotalShares = 0;
    require(causesOrganAddress != address(0), "LaBoiteADons: causes organ not set.");
    Organ causesOrgan = Organ(causesOrganAddress);
    require(causesOrgan.isOrgan(), "LaBoiteADons: causes organ not set.");
    for (uint256 i = 0 ; i < causes.length ; ++i) {
      // Check if causes are all registered in organ.
      require(
        causesOrgan.getEntryIndexForAddress(causes[i]) != 0,
        "LaBoiteADons: cause is not registered."
      );
      _receivedTotalShares += shares[i];
    }
    require(_receivedTotalShares == totalShares, "LaBoiteADons: shares and total shares mismatch.");

    uint256 totalReceived = msg.value;
    for (uint256 i = 0 ; i < causes.length ; ++i) {
      require(shares[i] > 0, "LaBoiteADons: cause has no shares");
      uint256 payment = totalReceived.mul(shares[i]).div(totalShares);
      require(payment != 0, "LaBoiteADons: cause is not due payment");

      causes[i].transfer(payment);
      emit donated(causes[i], payment);
    }
  }

  function getWebsite()
    public view returns (bytes32 ipfsHash, uint8 hashFunction, uint8 hashSize)
  {
    return (websiteIpfsHash, websiteHashFunction, websiteHashSize);
  }

  function setWebsite(bytes32 _ipfsHash, uint8 _hashFunction, uint8 _hashSize)
    external restricted
  {
    websiteIpfsHash = _ipfsHash;
    websiteHashFunction = _hashFunction;
    websiteHashSize = _hashSize;
  }

  function setCausesOrgan(address _causesOrganAddress)
    external restricted
  {
    causesOrganAddress = _causesOrganAddress;
  }
}