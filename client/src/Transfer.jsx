import { useState } from "react";
import server from "./server";
import * as secp from "@noble/secp256k1";
import { toHex, utf8ToBytes, hexToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

// Función para serializar con claves ordenadas (igual que en backend)
function sortedJSONStringify(obj) {
  return JSON.stringify(Object.fromEntries(Object.entries(obj).sort()));
}

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      console.log("🔐 Starting transfer...");
      const amount = parseInt(sendAmount);
      if (!amount || amount <= 0) throw new Error("Invalid amount");
      if (!recipient) throw new Error("Recipient required");
      if (!privateKey) throw new Error("Private key missing");

      const message = { amount, recipient };
      const messageString = sortedJSONStringify(message);
      const messageHash = keccak256(utf8ToBytes(messageString));

      console.log("🧾 Message:", message);
      console.log("🧾 Message string:", messageString);
      console.log("🔑 Private key (hex):", privateKey);

      const privateKeyBytes = hexToBytes(privateKey.replace(/^0x/, ""));

      // Firmar mensaje
      const signatureObj = await secp.sign(messageHash, privateKeyBytes, {
        recovered: true,
        der: false,
      });

      const signature = signatureObj[0];
      const recoveryBit = signatureObj[1];

      console.log("🖋 Signature:", toHex(signature));
      console.log("📍 Recovery bit:", recoveryBit);

      // Enviar al backend
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: toHex(signature),
        recoveryBit,
        message,
      });

      console.log("✅ Transfer success. New balance:", balance);
      setBalance(balance);
    } catch (ex) {
      console.error("❌ Transfer error:", ex);
      alert(ex.response?.data?.message || ex.message || "Transfer failed");
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        />
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        />
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;