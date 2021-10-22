// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library Boost {
    function streql(string memory s1, string memory s2) public pure returns(bool) {
        return keccak256(abi.encodePacked(s1)) == keccak256(abi.encodePacked(s2));
    }
}
