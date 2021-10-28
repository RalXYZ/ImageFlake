// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Artwork.sol";

struct ArtworkBrief {
    string hash;
    string name;
    string description;
    bool isInAuction;
    uint256 auctionEndTime;
}

struct ArtworkDetail {
    string hash;
    string name;
    string description;
    bool isInAuction;
    uint256 auctionEndTime;
    address[] historyHolder;
    address currentBidder;
    uint256 currentBid;
}

contract ArtFlake {

    // We need this mapping because we need to show all the
    // artworks a person holds. This data structure itself
    // does not ensres the Artwork cannot be own by two 
    // different people at the same time. It is the logic
    // in the member functions that ensures this.
    mapping(address => Artwork[]) holds;

    // The key of this mapping is an artwork's hash.
    // This is important, because almost every business 
    // logic starts with an artwork hash, and the artwrok
    // hash is the unique ID of an art work.
    // Since we have already defined 'address => Artwork[]',
    // we only need to construct 'hash => address', so that
    // we can locate a specific artwork.
    mapping(string => address) artworkHashToUser;
    
    Artwork[] allArtworks;
    
    // FIXME: maybe we do not need this
    modifier hashUnique(string memory artworkHash) {
        for (uint i = 0; i < allArtworks.length; i++) {
            require(!Boost.streql(allArtworks[i].hash(), artworkHash), "The hash to be inserted already exists");
        }
        _;
    }
    
    // We have defined mapping 'address => Artwork[]' above.
    // This function tries to find the index of an artwork
    // in artwork array by matching the artwork hash. The
    // artwork array is get by holder's address.
    function findHashIndex(string memory artworkHash, address holder) internal view returns(uint) {
        Artwork[] memory artworkArr = holds[holder];
        for (uint i = 0; i < artworkArr.length; i++) {
            if (Boost.streql(artworkArr[i].hash(), artworkHash)) {
                return i;
            }
        }
        revert("Hash index not found");
    }
    
    // Show a list which contains brief information of
    // all owned artwork of a user.
    function listOwned() external view returns(ArtworkBrief[] memory) {
        ArtworkBrief[] memory ret = new ArtworkBrief[](holds[tx.origin].length);
        for (uint i = 0; i < holds[tx.origin].length; i++) {
            ret[i] = ArtworkBrief(
                holds[tx.origin][i].hash(),
                holds[tx.origin][i].name(),
                holds[tx.origin][i].description(),
                holds[tx.origin][i].isInAuction(),
                holds[tx.origin][i].auctionEndTime()
            );
        }
        return ret;
    }
    
    function get(string memory hash) external view returns(ArtworkDetail memory) {
        for (uint i = 0; i < allArtworks.length; i++) {
            if (!Boost.streql(hash, allArtworks[i].hash())) {
                continue;
            }
            return ArtworkDetail(
                allArtworks[i].hash(),
                allArtworks[i].name(),
                allArtworks[i].description(),
                allArtworks[i].isInAuction(),
                allArtworks[i].auctionEndTime(),
                allArtworks[i].getHistoryHolder(),
                allArtworks[i].currentBidder(),
                allArtworks[i].currentBid()
            );
        }
        revert("Hash index not found");
    }
    
    function getAuction() external view returns(ArtworkBrief[] memory) {
        uint count = 0;
        for (uint i = 0; i < allArtworks.length; i++) {
            if (allArtworks[i].isInAuction()) {
                count++;
            }
        }
        ArtworkBrief[] memory ret = new ArtworkBrief[](count);
        count = 0;
        for (uint i = 0; i < allArtworks.length; i++) {
            if (allArtworks[i].isInAuction()) {
                ret[count] = ArtworkBrief(
                    allArtworks[i].hash(),
                    allArtworks[i].name(),
                    allArtworks[i].description(),
                    allArtworks[i].isInAuction(),
                    allArtworks[i].auctionEndTime()
                );
                count++;
            }
        }
        return ret;
    }
    
    // Create a new artwork
    function post(string memory artworkHash, string memory _name, string memory _description) external hashUnique(artworkHash) {
        Artwork newArtwork = new Artwork(artworkHash, tx.origin, _name, _description);
        holds[tx.origin].push(newArtwork);
        allArtworks.push(newArtwork);
        artworkHashToUser[artworkHash] = tx.origin;
    }
    
    // Start an auction. This operation can only be done by
    // the owner of the artwork.
    function startAuction(string memory artworkHash, uint256 auctionEndTime, uint256 startingPrice) external {
        uint index = findHashIndex(artworkHash, tx.origin);
        holds[tx.origin][index].startAuction(auctionEndTime, startingPrice);
    }
    
    // Bid a auction. This operation can be done by everyone.
    function bid(string memory artworkHash, uint256 _bid) external {
        address currentOwner = artworkHashToUser[artworkHash];
        uint index = findHashIndex(artworkHash, currentOwner);
        holds[currentOwner][index].bid(_bid);
    }
    

    // Collect the bidded artwork. This operation can be done
    // by the highest bidder.
    function collectBid(string memory artworkHash) external payable {
        // Store the information about the last holder.
        address lastHolder = artworkHashToUser[artworkHash];
        uint lastHolderIndex = findHashIndex(artworkHash, lastHolder);

        // Update the ownership of an artwork hash.
        artworkHashToUser[artworkHash] = tx.origin;
        
        // Move this artical from the last holder's array to
        // the new holder's array.
        holds[lastHolder][lastHolderIndex].collectBid{value: msg.value}();
        for (uint i = lastHolderIndex + 1; i < holds[lastHolder].length; i++) {
            holds[lastHolder][i - 1] = holds[lastHolder][i];
        }
        Artwork art = holds[lastHolder][lastHolderIndex];
        holds[lastHolder].pop();
        holds[tx.origin].push(art);
    }
}
