// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./lib/Boost.sol";

contract Artwork {
    string public hash;
    string public name;
    string public description;
    address[] public historyHolder;
    bool public isInAuction = false;
    uint256 public auctionEndTime;
    address public currentBidder;
    uint256 public currentBid;
    
    modifier inAuction() {
        require(isInAuction, "Auction of this artwork hasn't been stated");
        _;
    }
    
    event holder(address addr);
    event getTime(uint256 time);
    
    constructor(string memory artworkHash, address initHolder, string memory _name, string memory _description) payable {
        name = _name;
        description = _description;
        hash = artworkHash;
        historyHolder.push(initHolder);
        emit holder(initHolder);
    }
    
    function getHistoryHolder() external view returns(address[] memory) {
        address[] memory ret = new address[](historyHolder.length);
        for (uint i = 0; i < historyHolder.length; i++) {
            ret[i] = historyHolder[i];
        }
        return ret;
    }
    
    function startAuction(uint256 _auctionEndTime, uint256 _startingPrice) external {
        require(!isInAuction, "There exists an on-going auction");
        require(historyHolder[historyHolder.length - 1] == tx.origin, "You are not the current owner");
        isInAuction = true;
        auctionEndTime = _auctionEndTime;

        // Set owner as the first bidder, so that the artwork can be
        // re-claimed by the owner if no one bidds it. 
        currentBidder = tx.origin;
        currentBid = _startingPrice;
    }
    
    function bid(uint256 _bid) external inAuction {
        emit getTime(block.timestamp);
        require(block.timestamp < auctionEndTime, "The auction has ended");
        require(_bid > currentBid, "Your bid is lower than the current bidder");
        currentBid = _bid;
        currentBidder = tx.origin;
    }
    
    function collectBid() external payable inAuction returns(address) {
        require(block.timestamp >= auctionEndTime, "Auction isn't ended");
        require(currentBidder == tx.origin, "Transaction origin is not the final bidder");
        payable(historyHolder[historyHolder.length - 1]).transfer(currentBid);
        address lastHolder = historyHolder[historyHolder.length - 1];
        historyHolder.push(tx.origin);
        isInAuction = false;
        return lastHolder;
    }
}
