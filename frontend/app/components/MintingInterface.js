"use client";
import { useState } from "react";
import { ethers } from "ethers";
import MyNFTABI from "@/contracts/MyNFT.json";
import MyNFTAddress from "@/contracts/MyNFT-address.json";

export default function MintingInterface({ userAddress, saleState }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const mint = async () => {
    if (!window.ethereum) return;
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(MyNFTAddress.address, MyNFTABI.abi, signer);

      const price = await contract.price();
      const totalCost = price * BigInt(quantity);

      let tx;
      if (saleState === 1) { // Allowlist
        // Note: You will need to fetch the proof from your Merkle script later
        const proof = []; // Placeholder for Step 9
        tx = await contract.allowlistMint(proof, quantity, { value: totalCost });
      } else { // Public
        tx = await contract.publicMint(quantity, { value: totalCost });
      }

      await tx.wait();
      alert("Mint Successful!");
    } catch (error) {
      console.error("Minting failed", error);
      alert(error.reason || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-white">Mint Your NFT</h2>
      
      <div className="flex items-center gap-4 mb-6">
        <label className="text-gray-400">Quantity:</label>
        <input
          data-testid="quantity-input"
          type="number"
          min="1"
          max="5"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-20 p-2 rounded bg-gray-800 text-white border border-gray-700 text-center"
        />
      </div>

      <button
        data-testid="mint-button"
        onClick={mint}
        disabled={loading || saleState === 0}
        className={`w-full py-3 rounded-lg font-bold transition ${
          loading || saleState === 0 
            ? "bg-gray-600 cursor-not-allowed" 
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {loading ? "Processing..." : saleState === 0 ? "Sale Paused" : "Mint Now"}
      </button>
    </div>
  );
}