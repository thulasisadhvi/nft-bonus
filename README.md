

## NFT Launchpad: Containerized Generative Collection

This project is a full-stack, production-ready NFT minting platform. It features a gas-optimized smart contract using **ERC721A**, a secure **Merkle Tree allowlist**, and a high-performance frontend.

### 🚀 Key Features

* **Containerized Architecture**: The entire stack (Hardhat node and Next.js frontend) is managed via **Docker**, ensuring consistency across different development environments.
* **React Compiler (Next.js 15+)**: The frontend is optimized using the latest React Compiler to manage Web3 state changes with zero unnecessary re-renders.
* **Gas-Optimized Smart Contract**: Implements `ERC721A` for low-cost batch minting and **ERC-2981** for on-chain royalty support.
* **Cryptographic Allowlist**: Secure, off-chain allowlist management using **Merkle Proofs** to minimize gas fees for the contract owner.

### 🛠️ Tech Stack

* **Smart Contracts**: Solidity, Hardhat, OpenZeppelin.
* **Frontend**: Next.js (App Router), Ethers.js, Tailwind CSS.
* **DevOps**: Docker, Docker Compose.
* **Optimization**: React Compiler.

### 📦 Quick Start

1. **Clone the repository**:
```bash
git clone https://github.com/thulasisadhvi/nft-bonus
cd nft-launchpad

```


2. **Start the environment**:
```bash
docker-compose up --build

```


3. **Deploy the contract**:
In a new terminal:
```bash
npx hardhat run scripts/deploy.js --network localhost

```


4. **Connect & Mint**:
Visit `http://localhost:3000` and connect your MetaMask to the Hardhat Local network (Chain ID 31337).

