// SPDX-License-Identifier: MIT

contract Artwork {
    string hash;
    address[] historyHolder;
    bool isInAuction = false;
    uint256 auctionStartTime;
    uint256 auctionEndTime;
    address currentBidder;
    uint256 currentBid;
    
    modifier inAuction() {
        require(isInAuction, "Auction of this artwork hasn't been stated");
        _;
    }
    
    constructor(string memory artworkHash, address initHolder) {
        hash = artworkHash;
        historyHolder.push(initHolder);
    }
    
    function startAuction(uint256 _auctionStartTime, uint256 _auctionEndTime) external {
        require(!isInAuction, "There exists an on-going auction");
        require(historyHolder[historyHolder.length - 1] == tx.origin, "You are not the current owner");
        isInAuction = true;
        auctionStartTime = _auctionStartTime;
        auctionEndTime = _auctionEndTime;
    }
    
    function bid(uint256 _bid) external inAuction {
        require(block.timestamp < auctionEndTime, "Auction is ended");
        require(_bid > currentBid, "Your bid is lower than the current bidder");
        currentBid = _bid;
        currentBidder = tx.origin;
    }
    
    function collectBid() external payable inAuction {
        require(block.timestamp >= auctionEndTime, "Auction isn't ended");
        payable(historyHolder[historyHolder.length - 1]).transfer(currentBid);
        historyHolder.push(tx.origin);
        isInAuction = false;
    }
}

contract ArtFlake {
    mapping(address => Artwork) public holds;
}
