import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({ address, setAddress, balance, setBalance }) {
  const [privateKey, setPrivateKey] = useState("");

  async function handleAccessWallet() {
    try {
      // Clean input: remove 0x prefix if exists, trim spaces, lowercase
      const cleanKey = privateKey.trim().toLowerCase().replace(/^0x/, "");

      if (cleanKey.length !== 64) {
        throw new Error("Private key must be 64 hex characters");
      }

      // Convert private key from hex string to Uint8Array
      const privateKeyBytes = hexToBytes(cleanKey);

      // Derive the public key from the private key
      const publicKey = secp.getPublicKey(privateKeyBytes);

      // Derive the address by hashing the public key (drop format byte)
      const hash = keccak256(publicKey.slice(1));
      const derivedAddress = "0x" + toHex(hash.slice(-20));

      setAddress(derivedAddress);

      // Fetch balance from server (make sure address is lowercase)
      const {
        data: { balance },
      } = await server.get(`balance/${derivedAddress.toLowerCase()}`);

      setBalance(balance);
    } catch (e) {
      alert("Invalid private key or address derivation failed.");
      setBalance(0);
      setAddress("");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Enter your private key (hex format, 64 chars)"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
        />
      </label>

      <button onClick={handleAccessWallet}>Access Wallet</button>

      <label>
        Wallet Address
        <input value={address} disabled />
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;