// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0 <0.9.0;

import "./Artwork.sol";

contract ArtFlake {
    mapping(address => Artwork[]) holds;
    
    modifier hashUnique(string memory artworkHash) {
        Artwork[] memory artworkArr = holds[tx.origin];
        for (uint i = 0; i < artworkArr.length; i++) {
            require(!Boost.streql(artworkArr[i].hash(), artworkHash), "The hash to be inserted already exists");
        }
        _;
    }
    
    function findHashIndex(string memory artworkHash) internal view returns(uint) {
        Artwork[] memory artworkArr = holds[tx.origin];
        for (uint i = 0; i < artworkArr.length; i++) {
            if (Boost.streql(artworkArr[i].hash(), artworkHash)) {
                return i;
            }
        }
        revert("Hash index not found");
    }
    
    function post(string memory artworkHash) external hashUnique(artworkHash) {
        holds[tx.origin].push(new Artwork(artworkHash, tx.origin));
    }
    
    
    function startAuction(string memory artworkHash, uint256 auctionStartTime, uint256 auctionEndTime) external {
        uint index = findHashIndex(artworkHash);
        holds[tx.origin][index].startAuction(auctionStartTime, auctionEndTime);
    }
    
    function bid(string memory artworkHash, uint256 _bid) external {
        uint index = findHashIndex(artworkHash);
        holds[tx.origin][index].bid(_bid);
    }
    
    function collectBid(string memory artworkHash) external payable {
        uint index = findHashIndex(artworkHash);
        holds[tx.origin][index].collectBid();
    }
}
