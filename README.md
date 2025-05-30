# 🔐 ECDSA Wallet Transfer App – Simulated Ethereum Edition

This project is a secure, minimalistic simulation of Ethereum-style wallet transactions using **Elliptic Curve Digital Signature Algorithm (ECDSA)**. Built with a **React frontend** and an **Express backend**, it offers a practical and educational environment to understand how wallets, signatures, and transfers work—**without connecting to a real blockchain**.

---

## 🌟 Key Features

- 🔑 **Generate valid Ethereum-style wallet addresses** from private/public key pairs (`secp256k1` + `keccak256`).
- 🧾 **Sign transactions client-side** with a private key (never sent to the server).
- ✅ **Verify digital signatures server-side**, ensuring only valid transfers are accepted.
- 💸 **Real-time balance tracking**: balances are updated based on successful signed transfers.
- 🧪 **Fully interactive simulation** of value transfer using real cryptographic primitives.
- 🧼 Clean UX: no automatic triggers—transactions require manual confirmation.

---

## 🛠️ How It Works

1. **Users input their private key** to derive their Ethereum-style address.
2. **Transaction data (recipient + amount)** is signed on the client using ECDSA.
3. The **server receives the signed payload**, verifies the signature, and processes the transaction if valid.
4. **Balances are updated** in memory based on sender and recipient addresses.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16+  
- npm

### Clone and Install

```bash
git clone https://github.com/Z4k3n/ecdsa-node.git
cd ecdsa-node
```

```bash
cd client
npm install
cd ../server
npm install
```

### Run the App

**Start the server:**

```bash
cd server
node index.js
# or
nodemon index.js
```

**Start the client:**

```bash
cd client
npm run dev
```

Visit 👉 [http://localhost:5173](http://localhost:5173)

---

## 🔍 Example Wallets (Simulation Only)

```js
// Example Private Key (DO NOT use on mainnet)
0x8f2a...

// Derived Public Key (used internally)
0x045f9c...

// Ethereum-style Address:
0x3f4eF9A628E49272B891fEb1738EcA47Bc3e3d0F
```

---

## ✅ Sample Scenarios

| Scenario                  | Result                    |
|--------------------------|---------------------------|
| Valid private key + sig  | ✅ Transfer succeeds       |
| Invalid signature         | ❌ Transfer rejected       |
| Unknown address           | ❌ No balance to send      |
| Wrong private key         | ❌ Signature not verified  |

---

## 🧩 Project Structure

```
client/
├── App.jsx           # Root component
├── Wallet.jsx        # Wallet UI + address derivation
├── Transfer.jsx      # Transfer form and signing
└── server.js         # Axios API config

server/
├── index.js          # Express app with ECDSA signature validation
└── utils/            # Signature & hash helpers
```

---

## 📦 Dependencies

- [`ethereum-cryptography`](https://www.npmjs.com/package/ethereum-cryptography) – cryptography (ECDSA, keccak256, secp256k1)
- `express`, `cors`, `nodemon` – backend server
- `vite`, `react`, `axios` – frontend stack

---

## 🎓 Purpose

This project is designed for **educational purposes**—to provide hands-on understanding of how Ethereum wallets and digital signatures work under the hood, without dealing with the cost or complexity of mainnet or testnets.

---
