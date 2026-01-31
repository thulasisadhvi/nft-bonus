"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import MyNFTABI from "@/contracts/MyNFT.json";
import MyNFTAddress from "@/contracts/MyNFT-address.json";

export default function SupplyTracker({ setSaleState }) {
  const [data, setData] = useState({ current: 0, total: 10000, status: "Loading..." });

  const fetchContractData = async () => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.JsonRpcProvider("http://localhost:8545");
      const contract = new ethers.Contract(MyNFTAddress.address, MyNFTABI.abi, provider);

      const [supply, state] = await Promise.all([
        contract.totalSupply(),
        contract.saleState()
      ]);

      const states = ["Paused", "Allowlist", "Public"];
      setData({
        current: Number(supply),
        total: 10000,
        status: states[Number(state)]
      });
      setSaleState(Number(state));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchContractData();
    const interval = setInterval(fetchContractData, 5000); // Update every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mb-8">
      <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
        <p className="text-gray-400 text-xs uppercase">Minted</p>
        <p data-testid="mint-count" className="text-2xl font-bold text-white">{data.current}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
        <p className="text-gray-400 text-xs uppercase">Max Supply</p>
        <p data-testid="total-supply" className="text-2xl font-bold text-white">{data.total}</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700">
        <p className="text-gray-400 text-xs uppercase">Status</p>
        <p data-testid="sale-status" className={`text-xl font-bold ${data.status === 'Paused' ? 'text-red-400' : 'text-green-400'}`}>
          {data.status}
        </p>
      </div>
    </div>
  );
}