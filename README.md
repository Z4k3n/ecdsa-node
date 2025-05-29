# 🔐 ECDSA Wallet Transfer App – Secured Edition

This project is a secure and minimalistic implementation of wallet-based transactions using **Elliptic Curve Digital Signature Algorithm (ECDSA)**. It includes a React-based client and an Express.js server designed to simulate Ethereum-like behavior for educational purposes.

## 🌟 Key Features

* Generate private/public key pairs using the `secp256k1` elliptic curve.
* Automatically derive Ethereum-style wallet addresses (via Keccak-256 hashing).
* Secure fund transfers with signed messages.
* Server-side verification of digital signatures (no private key exposure).
* Real-time balance updates after transactions.
* Easy-to-follow, modular React components and clear backend structure.

## ✨ What This Fork Adds

This fork expands on the original educational repo by:

* Implementing **full ECDSA-based transaction verification**.
* Replacing hardcoded dummy addresses (`0x1`, `0x2`, etc.) with **actual public keys**.
* Enabling users to **generate and use private keys securely** (client-side).
* Refactoring components for better UX (manual confirmation instead of auto-updates on input).
* Adding **Ethereum-style address derivation** from public keys (with `keccak256`).
* Designing a **testable app structure** with real use cases and dummy data.

## 🔧 Getting Started

### Prerequisites

Make sure you have:

* Node.js v16+ installed
* `npm` installed globally

### 1. Clone Your Fork

```bash
git clone https://github.com/your-username/ecdsa-wallet-app.git
cd ecdsa-wallet-app
```

### 2. Install Dependencies

From the root:

```bash
cd client
npm install
cd ../server
npm install
```

### 3. Run the App

#### Server

```bash
cd server
node index.js
# Or if you have nodemon:
# nodemon index.js
```

#### Client

```bash
cd client
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to use the app.

---

## 🧲 Example Wallets

These wallets were generated using `secp256k1`:

```js
// Example private key:
0x8f2a... // Keep this secret!

// Derived public key:
0x045f9c... (compressed format used for balance lookup)

// Derived address (Ethereum-style):
0x3f4eF9A628E49272B891fEb1738EcA47Bc3e3d0F
```

## ✅ Use Cases & Testing

| Sender Address | Private Key | Recipient Address | Amount | Expected Result        |
| -------------- | ----------- | ----------------- | ------ | ---------------------- |
| `0x3f4e...`    | valid key   | `0x4b12...`       | 25     | Balance deducted/added |
| Invalid key    | wrong key   | `0x4b12...`       | 25     | ❌ Signature rejected   |
| Unknown wallet | n/a         | `0x4b12...`       | 10     | ❌ Rejected, no balance |

---

## 📁 Project Structure

```
client/
├— Wallet.jsx     # Handle wallet inputs and balance display
├— Transfer.jsx   # Transfer form and signature logic
├— server.js      # Axios instance
server/
├— index.js       # Express server with signature validation
```

---

## 📦 Libraries Used

* [`ethereum-cryptography`](https://www.npmjs.com/package/ethereum-cryptography) – cryptographic primitives (secp256k1, keccak256)
* `express`, `cors`, `nodemon` – server setup
* `vite`, `react`, `useState` – frontend app

---

## 🚀 Future Improvements

* Add nonce or replay protection
* Wallet generation with QR codes
* Store balances persistently (e.g., in a file or DB)
* Deploy to a cloud platform

