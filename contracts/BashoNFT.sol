// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//uint256 constant RESOLUTION = 1000000000000000;
struct Coordinate {
    int256 lat;
    int256 lng;
}

struct Certificate {
    uint256 id;
    address account;
    uint[] name;
    uint[] formattedAddress;
    Coordinate geometry;
    Coordinate location;
    string fileHash;
    uint256 issuedAt;
}

contract BashoNFT is Ownable, ERC721Enumerable {
    using Counters for Counters.Counter;

    string private _baseTokenURI;

    uint private issueFee = 10 ether;

    Counters.Counter private idTracker;
    mapping (uint256 => Certificate) certificates;

    event SetIssueFee(uint256 fee);
    event Mint(uint256 id, address account, uint[] name, uint[] formattedAddress, Coordinate geometry, Coordinate location, string fileHash);

    constructor() ERC721("BashoNFT","BNFT") {
        _baseTokenURI = "https://ipfs.io/ipfs/";
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        require(_exists(_tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = certificates[_tokenId].fileHash;

        // If there is no base URI, return the token URI.
        if (bytes(_baseTokenURI).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(_baseTokenURI, _tokenURI));
        }

        // TODO: If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return _baseTokenURI;
    }

    function setIssueFee(uint _fee) external onlyOwner {
        issueFee = _fee;
        emit SetIssueFee(_fee);
    }

    function enforceCheckIssueFee() internal view {
        require(msg.value >= issueFee, "Must be larger than issue fee");
    }

    function mint(uint[] memory _name, uint[] memory _formattedAddress, Coordinate memory _geometry, Coordinate memory _location, string memory _fileHash) external payable {
        enforceCheckIssueFee();
        payable(owner()).transfer(msg.value);

        uint256 _id = idTracker.current();
        Certificate memory _certificate = Certificate({
            id: _id,
            account: msg.sender,
            name: _name,
            formattedAddress: _formattedAddress,
            geometry: _geometry,
            location: _location,
            fileHash: _fileHash,
            issuedAt: block.timestamp
        });
        certificates[_id] = _certificate;

        _safeMint(msg.sender, _id);
        emit Mint(_id, msg.sender, _name, _formattedAddress, _geometry, _location, _fileHash);

        idTracker.increment();
    }

    function getCertificate(uint256 _id) external view returns (Certificate memory){
        return certificates[_id];
    }

    function getCertificates() external view returns (uint256[] memory, Certificate[] memory) {
        uint256[] memory _ids = new uint256[](balanceOf(msg.sender));
        Certificate[] memory _certificates = new Certificate[](balanceOf(msg.sender));
        for (uint i = 0; i < balanceOf(msg.sender); i++) {
            uint256 _id = tokenOfOwnerByIndex(msg.sender, i);
            _ids[i] = _id;
            _certificates[i] = certificates[_id];
        }
        return (_ids, _certificates);
    }
}
