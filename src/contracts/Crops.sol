// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
contract Crops is ERC1155("https://ipfs.io/ipfs/bafybeicvfevtm5hi33guhypkfw4gv2upabhsltcfysvydbsbcgmruj2w5q") {
    uint256 public constant CARROT = 0;
    uint256 public constant POTATO = 1;
    uint256 public constant CORN = 2;
    uint256 public constant GOLDEN_CARROT = 3;
    uint256 public constant SPROUTING_POTATO = 4;
    uint256 public constant RAINBOW_CORN = 5;
    constructor() {
        _mint(msg.sender, CARROT, 1000, "");
        _mint(msg.sender, POTATO, 2000, "");
        _mint(msg.sender, CORN, 3000, "");
        _mint(msg.sender, GOLDEN_CARROT, 1, "");
        _mint(msg.sender, SPROUTING_POTATO, 2, "");
        _mint(msg.sender, RAINBOW_CORN, 3, "");
    }
}