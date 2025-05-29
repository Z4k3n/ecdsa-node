const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0x91fE1f43B33cE1e957aAC16Af5E739b7E5A8a553": 100,
  "0x5Aaeb6053F3E94C9b9A09f33669435E7Ef1BeAed": 50,
  "0xde709f2102306220921060314715629080e2fb77": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { recipient, amount, signature, recoveryBit, message } = req.body;

  // Hash the message
  const messageHash = keccak256(utf8ToBytes(JSON.stringify(message)));

  try {
    // Recover the public key from signature
    const publicKey = secp.recoverPublicKey(messageHash, signature, recoveryBit);

    // Derive the address from the public key
    const address = "0x" + keccak256(publicKey.slice(1)).slice(-20).toString("hex");

    setInitialBalance(address);
    setInitialBalance(recipient);

    if (balances[address] < amount) {
      return res.status(400).send({ message: "Not enough funds!" });
    }

    balances[address] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[address] });
  } catch (err) {
    res.status(400).send({ message: "Invalid signature or request." });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}