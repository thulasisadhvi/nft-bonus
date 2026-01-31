import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Helper for ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  console.log("Deploying MyNFT...");

  // 1. Deploy the contract
  const MyNFT = await hre.ethers.deployContract("MyNFT", ["My Generative Collection", "MNFT", 500]);
  await MyNFT.waitForDeployment();

  const address = await MyNFT.getAddress();
  console.log(`MyNFT deployed to: ${address}`);

  // 2. SET THE MERKLE ROOT (Requirement #5)
  // Replace the string below with the actual Root Hash you just generated
  const rootHash = "0x267368f2a3f275bb26d63993381b9dbe2365c5dd8a3b4c7eb2559bf33132b18e"; 
  const setRootTx = await MyNFT.setMerkleRoot(rootHash);
  await setRootTx.wait();
  console.log("Merkle Root successfully set on-chain.");

  // 3. OPEN THE SALE (Optional but helpful)
  // Sets state to 1 (Allowlist) so you can test immediately
  const setStateTx = await MyNFT.setSaleState(1);
  await setStateTx.wait();
  console.log("Sale state updated to: Allowlist (1)");

  // 4. Save artifacts for the Frontend
  const contractsDir = path.join(__dirname, "..", "frontend", "contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, "MyNFT-address.json"),
    JSON.stringify({ address: address }, undefined, 2)
  );

  const MyNFTArtifact = hre.artifacts.readArtifactSync("MyNFT");
  fs.writeFileSync(
    path.join(contractsDir, "MyNFT.json"),
    JSON.stringify(MyNFTArtifact, undefined, 2)
  );

  console.log("Contract ABI and Address saved to frontend folder.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});