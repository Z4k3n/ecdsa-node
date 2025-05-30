import express from "express";
import cors from "cors";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, hexToBytes } from "ethereum-cryptography/utils";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

// Pre-generated wallets
const wallets = [
  {
    privateKey: "4f3edf983ac636a65a842ce7c78d9aa706d3b113b37c15a68d41f4a94e8e2726",
    address: "0x62994a5c8a10748092189f60504e9f449ebee58d",
    balance: 100,
  },
  {
    privateKey: "6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1",
    address: "0xffcf8fdee72ac11b5c542428b35eef5769c409f0",
    balance: 50,
  },
  {
    privateKey: "c88b703fb08cbea894b6aeff0a88f5d88e0d978a8035f70b0bb7d4e4d5f0a392",
    address: "0x3509230efa1e9c68509986ab37dc691c3f91cc80",
    balance: 75,
  },
];

// Normalize balances
const balances = {};
wallets.forEach(({ address, balance }) => {
  balances[address.toLowerCase()] = balance;
});

// GET balance
app.get("/balance/:address", (req, res) => {
  const address = req.params.address.toLowerCase();
  const balance = balances[address] || 0;
  console.log(`Balance check for ${address}: ${balance}`);
  res.send({ balance });
});

// POST send - nueva lógica: validar privateKey para autorizar transferencia
app.post("/send", (req, res) => {
  try {
    let { privateKey, recipient, amount } = req.body;

    if (
      !privateKey ||
      typeof privateKey !== "string" ||
      (privateKey.trim().length !== 64 && privateKey.trim().length !== 66)
    ) {
      return res.status(400).send({ message: "Invalid private key format." });
    }

    privateKey = privateKey.toLowerCase().replace(/^0x/, "");
    const privateKeyBytes = hexToBytes(privateKey);

    // Derivar address desde la private key
    const publicKey = secp256k1.getPublicKey(privateKeyBytes, false);
    const senderAddress = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));

    const sender = senderAddress.toLowerCase();
    const receiver = recipient.toLowerCase();

    if (!(sender in balances)) {
      return res.status(401).send({ message: "Private key does not correspond to any wallet." });
    }

    if (typeof amount !== "number") amount = Number(amount);
    if (!amount || amount <= 0) {
      return res.status(400).send({ message: "Invalid amount." });
    }

    setInitialBalance(sender);
    setInitialBalance(receiver);

    if (balances[sender] < amount) {
      return res.status(400).send({ message: "Insufficient funds." });
    }

    balances[sender] -= amount;
    balances[receiver] += amount;

    console.log(`Transaction successful: ${sender} sent ${amount} to ${receiver}`);
    res.send({ balance: balances[sender] });
  } catch (err) {
    console.error("Transaction failed:", err);
    res.status(500).send({ message: "Server error." });
  }
});

// POST wallet-info
app.post("/wallet-info", (req, res) => {
  console.log("Body recibido:", req.body);

  let { privateKey } = req.body;

  try {
    if (typeof privateKey !== "string") {
      throw new Error("Private key must be a string");
    }

    const cleanKey = privateKey.trim().toLowerCase().replace(/^0x/, "");
    if (cleanKey.length !== 64) {
      throw new Error("Private key must be 64 hex characters");
    }

    console.log("🔑 Received private key:", cleanKey);

    const privateKeyBytes = hexToBytes(cleanKey);
    const publicKey = secp256k1.getPublicKey(privateKeyBytes, false);
    const address = "0x" + toHex(keccak256(publicKey.slice(1)).slice(-20));
    const balance = balances[address.toLowerCase()] || 0;

    console.log("📬 Derived address:", address);
    console.log("💰 Wallet balance:", balance);

    res.send({ address, balance });
  } catch (err) {
    console.error("❌ Wallet info error:", err.message);
    res.status(400).send({ message: "Invalid private key.", detail: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}