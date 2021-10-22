// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Artwork.sol";

contract ArtFlake {
    mapping(address => Artwork[]) holds;
    mapping(string => address) artworkHashToUser;
    
    modifier hashUnique(string memory artworkHash) {  // FIXME: maybe we do not need this
        Artwork[] memory artworkArr = holds[tx.origin];
        for (uint i = 0; i < artworkArr.length; i++) {
            require(!Boost.streql(artworkArr[i].hash(), artworkHash), "The hash to be inserted already exists");
        }
        _;
    }
    
    function findHashIndex(string memory artworkHash, address holder) internal view returns(uint) {
        Artwork[] memory artworkArr = holds[holder];
        for (uint i = 0; i < artworkArr.length; i++) {
            if (Boost.streql(artworkArr[i].hash(), artworkHash)) {
                return i;
            }
        }
        revert("Hash index not found");
    }
    
    function post(string memory artworkHash) public hashUnique(artworkHash) {
        holds[tx.origin].push(new Artwork(artworkHash, tx.origin));
        artworkHashToUser[artworkHash] = tx.origin; 
    }
    
    
    function startAuction(string memory artworkHash, uint256 auctionStartTime, uint256 auctionEndTime) external {
        uint index = findHashIndex(artworkHash, tx.origin);
        holds[tx.origin][index].startAuction(auctionStartTime, auctionEndTime);
    }
    
    function bid(string memory artworkHash, uint256 _bid) external {
        address currentOwner = artworkHashToUser[artworkHash];
        uint index = findHashIndex(artworkHash, currentOwner);
        holds[currentOwner][index].bid(_bid);
    }
    
    function collectBid(string memory artworkHash) external payable {
        address lastHolder = artworkHashToUser[artworkHash];
        uint lastHolderIndex = findHashIndex(artworkHash, lastHolder);
        artworkHashToUser[artworkHash] = tx.origin;
        
        holds[lastHolder][lastHolderIndex].collectBid{value: msg.value}();
        for (uint i = lastHolderIndex + 1; i < holds[lastHolder].length; i++) {
            holds[lastHolder][i - 1] = holds[lastHolder][i];
        }
        
        Artwork art = holds[lastHolder][lastHolderIndex];
        holds[lastHolder].pop();
        holds[tx.origin].push(art);
    }
}
