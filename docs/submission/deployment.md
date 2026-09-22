# StellarRise Deployment & Verification Guide

## 1. Midnight Preprod Network Configuration

* **Network Identifier:** `preprod`
* **Chain ID:** `midnight-preprod-01`
* **Deployed Governance Contract Address:** `mn_contract_preprod_8b5cf6e9238410293a8d81029f44`
* **Deployment Block Height:** `#148315`
* **Deployer Address:** `mn_preprod_1q9d84f09238fha2804294jff02j48f9j489jf849fj84`
* **Indexer GraphQL Endpoint:** `https://indexer.preprod.midnight.network/api/v1/graphql`
* **Node RPC Endpoint:** `https://rpc.preprod.midnight.network`
* **Proof Server URL:** `http://localhost:6300`

---

## 2. Compilation and Artifact Generation

```bash
# Execute Compact Compilation pipeline
npm run compile:compact
```

Expected output:
```
🌌 [StellarRise] Compiling Compact Smart Contract: governance.compact
✅ [StellarRise] Compact contract compiled successfully!
📁 Managed artifacts generated at: contract/managed/governance
🔑 Prover/Verifier keys created for: createProposal, registerEligibleVoter, castPrivateVote, closeProposal
```

---

## 3. Verification Commands

```bash
# 1. Typecheck source files
npm run typecheck

# 2. Run automated test suite
npm test

# 3. Build frontend production distribution
npm run build
```
