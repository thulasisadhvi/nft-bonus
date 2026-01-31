// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MyNFT is ERC721, ERC2981, Ownable {
    using Strings for uint256;

    enum SaleState { Paused, Allowlist, Public }

    // --- State Variables ---
    uint256 public constant MAX_SUPPLY = 10000; // Requirement #2
    uint256 public totalSupply;
    uint256 public price = 0.05 ether;

    SaleState public saleState = SaleState.Paused; // Requirement #3
    bytes32 public merkleRoot;
    
    string public baseURI;
    string public revealedURI;
    bool public isRevealed = false;

    mapping(address => uint256) public amountMintedPerWallet;
    uint256 public constant MINT_LIMIT = 5; 

    // --- Constructor ---
    constructor(
        string memory _name,
        string memory _symbol,
        uint96 _royaltyFeesInBips // e.g., 500 for 5%
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        _setDefaultRoyalty(msg.sender, _royaltyFeesInBips); // Requirement #2
    }

    // --- Requirement #3: Owner-Only Functions ---
    function setPrice(uint256 _newPrice) external onlyOwner {
        price = _newPrice;
    }

    function setBaseURI(string calldata _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function setRevealedURI(string calldata _newRevealedURI) external onlyOwner {
        revealedURI = _newRevealedURI;
    }

    function setMerkleRoot(bytes32 _newMerkleRoot) external onlyOwner {
        merkleRoot = _newMerkleRoot;
    }

    function setSaleState(SaleState _newState) external onlyOwner {
        saleState = _newState;
    }

    // --- Requirement #7: Reveal Mechanism ---
    function reveal() external onlyOwner {
        isRevealed = true;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        
        string memory currentBaseURI = isRevealed ? revealedURI : baseURI;
        return bytes(currentBaseURI).length > 0 
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), ".json")) 
            : "";
    }

    // --- Requirement #8: Security & Withdrawal ---
    function withdraw() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    // --- Boilerplate for Interface Support ---
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    // --- Requirement #5: Allowlist Minting ---
    function allowlistMint(bytes32[] calldata merkleProof, uint256 quantity) external payable {
        require(saleState == SaleState.Allowlist, "Allowlist sale not active"); //
        require(totalSupply + quantity <= MAX_SUPPLY, "Would exceed max supply"); //
        require(amountMintedPerWallet[msg.sender] + quantity <= MINT_LIMIT, "Exceeds wallet limit"); //
        require(msg.value >= price * quantity, "Insufficient ETH sent"); //

        // Verify Merkle Proof
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(merkleProof, merkleRoot, leaf), "Invalid Merkle Proof"); //

        _internalMint(msg.sender, quantity);
    }

    // --- Requirement #6: Public Minting ---
    function publicMint(uint256 quantity) external payable {
        require(saleState == SaleState.Public, "Public sale not active"); //
        require(totalSupply + quantity <= MAX_SUPPLY, "Would exceed max supply"); //
        require(amountMintedPerWallet[msg.sender] + quantity <= MINT_LIMIT, "Exceeds wallet limit"); //
        require(msg.value >= price * quantity, "Insufficient ETH sent"); //

        _internalMint(msg.sender, quantity);
    }

    // Helper function to handle supply and state updates
    function _internalMint(address to, uint256 quantity) internal {
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = totalSupply + 1;
            totalSupply++;
            _safeMint(to, tokenId);
        }
        amountMintedPerWallet[to] += quantity;
    }
}