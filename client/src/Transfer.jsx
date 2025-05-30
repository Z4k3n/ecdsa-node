import { useState } from "react";
import server from "./server";

function Transfer({ setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const amount = parseInt(sendAmount);
      if (!amount || amount <= 0) throw new Error("Invalid amount");
      if (!recipient) throw new Error("Recipient required");
      if (!privateKey) throw new Error("Private key missing");

      // Envía privateKey, recipient y amount para que el servidor valide
      const {
        data: { balance },
      } = await server.post(`send`, {
        privateKey,
        recipient,
        amount,
      });

      setBalance(balance);
      alert("Transferencia exitosa!");
    } catch (ex) {
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