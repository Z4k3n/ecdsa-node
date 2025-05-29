import { useState } from "react";
import server from "./server";

function Wallet({ address, setAddress, balance, setBalance, setPrivateKey }) {
  const [localPrivateKey, setLocalPrivateKey] = useState("");

  async function handleAccessWallet() {
    try {
      const cleanKey = localPrivateKey.trim().toLowerCase().replace(/^0x/, "");

      if (cleanKey.length !== 64) {
        throw new Error("Private key must be 64 hex characters");
      }

      // 🔁 Usar el endpoint del servidor para obtener address y balance
      const {
        data: { address: derivedAddress, balance },
      } = await server.post("/wallet-info", {
        privateKey: cleanKey,
      });

      console.log("🧾 Server-derived address:", derivedAddress);
      console.log("💰 Server-derived balance:", balance);

      setAddress(derivedAddress);
      setBalance(balance);
      setPrivateKey(cleanKey);  // Actualizamos privateKey en el padre
    } catch (e) {
      console.error("❌ Error during wallet access:", e.message);
      setAddress("");
      setBalance(0);
      setPrivateKey("");
      alert("Invalid private key or server error.");
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Enter your private key (hex format, 64 chars)"
          value={localPrivateKey}
          onChange={(e) => setLocalPrivateKey(e.target.value)}
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