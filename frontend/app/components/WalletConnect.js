"use client";
import { useState } from "react";
import { ethers } from "ethers";

export default function WalletConnect({ onConnected }) {
  const [address, setAddress] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAddress(accounts[0]);
        onConnected(accounts[0]);
      } catch (error) {
        console.error("Connection failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {!address ? (
        <button
          data-testid="connect-wallet-button"
          onClick={connectWallet}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-sm">Connected Address</p>
          <p data-testid="connected-address" className="text-green-400 font-mono">
            {address}
          </p>
        </div>
      )}
    </div>
  );
}