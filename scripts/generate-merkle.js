import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import fs from 'fs';

async function main() {
  const rawData = fs.readFileSync('allowlist.json');
  const addresses = JSON.parse(rawData);

  const leaves = addresses.map(addr => keccak256(addr));
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = tree.getHexRoot();

  console.log('--- Merkle Tree Generated ---');
  console.log('Root Hash:', root);
  console.log('-----------------------------');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});