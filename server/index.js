const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex, hexToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

// Pre-generated wallets with matching private keys and addresses
const wallets = [
  {
    privateKey: "4f3edf983ac636a65a842ce7c78d9aa706d3b113b37c15a68d41f4a94e8e2726",
    address: "0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1",
    balance: 100,
  },
  {
    privateKey: "6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1",
    address: "0xffcf8fdee72ac11b5c542428b35eef5769c409f0",
    balance: 50,
  },
  {
    privateKey: "c88b703fb08cbea894b6aeff0a88f5d88e0d978a8035f70b0bb7d4e4d5f0a392",
    address: "0x627306090abab3a6e1400e9345bc60c78a8bef57",
    balance: 75,
  },
];

// Normalize balances
const balances = {};
wallets.forEach(({ address, balance }) => {
  balances[address.toLowerCase()] = balance;
});

// Helper to sort object keys for consistent message hashing
function sortedJSONStringify(obj) {
  return JSON.stringify(Object.fromEntries(Object.entries(obj).sort()));
}

// Endpoint: Get balance
app.get("/balance/:address", (req, res) => {
  const address = req.params.address.toLowerCase();
  const balance = balances[address] || 0;
  console.log(`Balance check for ${address}: ${balance}`);
  res.send({ balance });
});

// Endpoint: Send tokens
app.post("/send", async (req, res) => {
  const { recipient, amount, signature, recoveryBit, message } = req.body;

  console.log("Incoming transaction request:", { recipient, amount, message });

  try {
    const messageHash = keccak256(utf8ToBytes(sortedJSONStringify(message)));

    const publicKey = secp.recoverPublicKey(messageHash, signature, recoveryBit);
    const senderAddress = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));
    const sender = senderAddress.toLowerCase();
    const receiver = recipient.toLowerCase();

    console.log("Recovered sender address:", sender);

    setInitialBalance(sender);
    setInitialBalance(receiver);

    if (balances[sender] < amount) {
      console.log("Transaction failed: insufficient funds");
      return res.status(400).send({ message: "Not enough funds!" });
    }

    balances[sender] -= amount;
    balances[receiver] += amount;

    console.log(`Transaction successful: ${sender} sent ${amount} to ${receiver}`);
    res.send({ balance: balances[sender] });
  } catch (err) {
    console.error("Transaction failed:", err.message);
    res.status(400).send({ message: "Invalid signature or request." });
  }
});

// Endpoint: Get wallet address and balance from private key
app.post("/wallet-info", (req, res) => {
  let { privateKey } = req.body;

  try {
    if (typeof privateKey !== "string") {
      throw new Error("Private key must be a string");
    }

    const cleanKey = privateKey.trim().toLowerCase().replace(/^0x/, "");
    if (cleanKey.length !== 64) {
      throw new Error("Private key must be 64 hex characters");
    }

    console.log("Received private key:", cleanKey);

    const privateKeyBytes = hexToBytes(cleanKey);
    const publicKey = secp.getPublicKey(privateKeyBytes);
    const address = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));
    const balance = balances[address.toLowerCase()] || 0;

    console.log(`Derived address: ${address}, Balance: ${balance}`);
    res.send({ address, balance });
  } catch (err) {
    console.error("Wallet info error:", err.message);
    res.status(400).send({ message: "Invalid private key." });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Initialize balances for unknown addresses
function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}