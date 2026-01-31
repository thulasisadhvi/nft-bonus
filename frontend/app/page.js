"use client";
import { useState } from "react";
import WalletConnect from "./components/WalletConnect";
import MintingInterface from "./components/MintingInterface";
import SupplyTracker from "./components/SupplyTracker";

export default function Home() {
  const [userAddress, setUserAddress] = useState(null);
  const [saleState, setSaleState] = useState(0);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
        NFT Launchpad
      </h1>
      <p className="text-gray-500 mb-10">Production-Grade Generative Minting</p>

      <SupplyTracker setSaleState={setSaleState} />

      {!userAddress ? (
        <WalletConnect onConnected={setUserAddress} />
      ) : (
        <div className="w-full max-w-md space-y-6">
          <div className="text-center p-2 bg-gray-900 rounded border border-gray-800">
            <span className="text-gray-500 text-sm">Connected as: </span>
            <span className="text-blue-400 font-mono text-sm">{userAddress}</span>
          </div>
          <MintingInterface userAddress={userAddress} saleState={saleState} />
        </div>
      )}
    </main>
  );
}