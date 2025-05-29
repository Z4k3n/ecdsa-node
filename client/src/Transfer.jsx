import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const amount = parseInt(sendAmount);

      // Create a message hash
      const message = JSON.stringify({ amount, recipient });
      const messageHash = keccak256(utf8ToBytes(message));

      // Sign the message hash with the private key
      const [signature, recoveryBit] = await secp.sign(messageHash, privateKey, { recovered: true });

      // Send the transaction and signature to the server
      const {
        data: { balance },
      } = await server.post(`send`, {
        signature: toHex(signature),
        recoveryBit,
        message,
      });

      setBalance(balance);
    } catch (ex) {
      alert(ex.response?.data?.message || "Transfer failed");
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