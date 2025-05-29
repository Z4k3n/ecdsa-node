import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({ address, setAddress, balance, setBalance }) {
  const [privateKey, setPrivateKey] = useState("");

  // Triggered when the user clicks the "Access Wallet" button
  async function handleAccessWallet() {
    try {
      // 1. Derive the public key from the given private key
      const publicKey = secp.getPublicKey(privateKey);

      // 2. Simulate an Ethereum-style address by hashing the public key
      const hash = keccak256(publicKey.slice(1)); // remove format byte
      const derivedAddress = "0x" + toHex(hash.slice(-20));

      setAddress(derivedAddress);

      // 3. Fetch balance from the server using the derived address
      const {
        data: { balance },
      } = await server.get(`balance/${derivedAddress}`);
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
          placeholder="Enter your private key (hex format)"
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