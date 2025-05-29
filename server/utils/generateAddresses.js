import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { toHex, hexToBytes } from 'ethereum-cryptography/utils';

const privateKeys = [
  "4f3edf983ac636a65a842ce7c78d9aa706d3b113b37c15a68d41f4a94e8e2726",
  "6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1",
  "c88b703fb08cbea894b6aeff0a88f5d88e0d978a8035f70b0bb7d4e4d5f0a392"
];

privateKeys.forEach(pk => {
  const pkBytes = hexToBytes(pk);
  const publicKey = secp256k1.getPublicKey(pkBytes, false); // sin compresión
  const address = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));
  console.log(`Private Key: ${pk}`);
  console.log(`Address: ${address}`);
  console.log('---');
});
