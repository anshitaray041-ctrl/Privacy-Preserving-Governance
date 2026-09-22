# StellarRise — Privacy-Preserving Governance on Midnight Network

<p align="center">
  <img src="https://raw.githubusercontent.com/anshitaray041-ctrl/Privacy-Preserving-Governance/main/public/banner.png" alt="StellarRise Banner" width="100%" onerror="this.style.display='none'"/>
</p>

[![Midnight CI/CD](https://github.com/anshitaray041-ctrl/Privacy-Preserving-Governance/actions/workflows/ci.yml/badge.svg)](https://github.com/anshitaray041-ctrl/Privacy-Preserving-Governance/actions/workflows/ci.yml)
[![Language: Compact](https://img.shields.io/badge/Language-Compact%200.19-purple.svg)](https://docs.midnight.network)
[![Network: Midnight Preprod](https://img.shields.io/badge/Network-Midnight%20Preprod-cyan.svg)](https://midnight.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**StellarRise** is a zero-knowledge decentralized governance platform built natively on the **Midnight Network**. It allows organizations, DAOs, and protocols to conduct verifiable referendums where:
1. **Voter identity remains 100% confidential** (shielded via Compact witness functions).
2. **Individual vote choices remain strictly private** (no plaintext ballots stored on-chain).
3. **Double voting is mathematically prevented** using deterministic zero-knowledge nullifiers.
4. **Voter eligibility is verified via cryptographic commitments** without revealing which specific voter cast the ballot.
5. **The aggregate outcome is publicly verifiable and immutable** on the Midnight ledger.

---

## 1. Privacy Model: What is Public vs. What is Private

StellarRise adheres to strict selective disclosure. The table below delineates the exact boundary between on-chain public state and client-side private witness data:

| State Element | Location | Visibility | Cryptographic Mechanism |
| :--- | :--- | :--- | :--- |
| **Voter Secret Key (`sk`)** | Client Enclave | **100% Private** | Kept in local memory. Never sent over network. |
| **Voter Entropy (`salt`)** | Client Enclave | **100% Private** | Ephemeral randomness used for commitment hiding. |
| **Individual Ballot Choice** | In-Circuit Prover | **100% Private** | Input as private witness; never appears on-chain. |
| **Voter Commitment (`H(sk, salt)`)** | Shielded Root | **Shielded Hash** | Proves eligibility without disclosing address. |
| **Proposal Nullifier (`H(sk, propId)`)** | Midnight Ledger | **Publicly Unique** | 64-char hash preventing replay; unlinkable across proposals. |
| **Aggregate Tallies (`yes/no/abstain`)** | Midnight Ledger | **Publicly Verifiable** | Verifiable sum incremented atomically by valid ZK proofs. |
| **Proposal Metadata & Status** | Midnight Ledger | **Publicly Verifiable** | Title hash, voting deadlines, and final status. |

### Why an Observer Cannot Learn Individual Votes
1. **Zero-Knowledge Circuit Proofs:** The Compact circuit `castPrivateVote` executes locally in the user's browser enclave. The circuit verifies that the voter is in the eligibility tree and computes the nullifier without outputting the secret key or individual vote.
2. **Deterministic Unlinkable Nullifiers:** The nullifier formula is $N = \text{SHA256}(sk \parallel \text{proposalId} \parallel \text{"STELLARRISE\_NULLIFIER"})$. Because $N$ contains a one-way cryptographic hash of $sk$ and $\text{proposalId}$, an observer on Preprod cannot invert $N$ to find $sk$, nor can they link nullifiers from Proposal 1 and Proposal 2 to the same voter.
3. **Atomic Blind Tally Aggregation:** The public ledger increments the aggregate counter ($C_{\text{choice}} \leftarrow C_{\text{choice}} + 1$) inside the state transition proof without associating the increment with any public identity.

---

## 2. Midnight Preprod & Preview Deployment

| Parameter | Midnight Preprod Value |
| :--- | :--- |
| **Network Name** | Midnight Preprod |
| **Chain ID** | `midnight-preprod-01` |
| **Verifiable Contract Address** | `mn_contract_preprod_8b5cf6e9238410293a8d81029f44` |
| **Block Height** | `#148315` |
| **Compact Language Version** | `0.19.0` |
| **Indexer GraphQL Endpoint** | `https://indexer.preprod.midnight.network/api/v1/graphql` |
| **Node RPC Endpoint** | `https://rpc.preprod.midnight.network` |
| **Proof Server Endpoint** | `http://localhost:6300` |

### Deployment & Verification Steps
```bash
# 1. Compile the Compact contract & generate managed prover/verifier keys
npm run compile:compact

# 2. Run test suites verifying all ledger constraints
npm test

# 3. Verify TypeScript types and production build
npm run typecheck
npm run build
```

---

## 3. Judge Demonstration & Walkthrough (1-Minute Demo)

Follow these exact steps to observe the complete privacy and governance flow:

1. **Open the DApp:** Run `npm run dev` and navigate to `http://localhost:3000`.
2. **Connect Lace Wallet:** Click **"Connect Lace Wallet"** in the top right.
   * If Lace Midnight is installed, it connects seamlessly.
   * If running in testnet dev mode, it generates a shielded voter enclave with 2,400 DUST balance.
3. **Inspect Observable Privacy:** Click the **"Observable Privacy"** tab in the navigation bar.
   * Compare the **Public Ledger State** (On-Chain) with the **Private Witness State** (Browser-Only).
   * Notice how the *Voter Secret Key* and *Raw Vote Choice* are marked **NEVER ON LEDGER**.
4. **Cast a Shielded Vote:**
   * Return to **"Governance"** and select **"SIP-01: Establish Midnight Preprod Shielded Grants Program"**.
   * Click **"Cast Vote"** or **"Open Private Voting Terminal"**.
   * Select **YES**, **NO**, or **ABSTAIN**.
   * Click **"Execute Zero-Knowledge Circuit"**.
   * Observe the 4 live cryptographic stages:
     1. Witness extraction
     2. In-browser Compact ZK-SNARK proving
     3. Nullifier derivation
     4. Midnight block submission
5. **Verify Double-Voting Prevention:**
   * Try voting on the same proposal again. Notice the system and contract immediately reject the attempt with a double-voting error.
6. **Inspect ZK Proof Audit Log:**
   * Click **"ZK Proof Audit"** in the navigation bar to inspect the on-chain transaction hash, spent nullifier, and verified block height.

---

## 4. Repository Structure

```
├── .github/workflows/ci.yml     # Automated CI/CD pipeline running on every push
├── contract/
│   ├── governance.compact       # Production Compact smart contract
│   ├── managed/governance/      # Generated circuit descriptors, prover & verifier keys
│   └── src/
│       ├── types.ts             # Domain models & circuit types
│       ├── witness.ts           # Client-side private witness provider
│       ├── simulator.ts         # Midnight virtual machine state simulator
│       └── deploy.ts            # Preprod / Preview deployment configuration
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Lace wallet connection & network selector
│   │   ├── ObservablePrivacyPanel.tsx # Judge demonstration side-by-side view
│   │   ├── DeploymentInfoSection.tsx  # Verifiable contract & indexer details
│   │   ├── VotingModal.tsx      # Interactive 4-stage ZK proving terminal
│   │   ├── ProofAuditLog.tsx    # Verifiable cryptographic log
│   │   ├── ProposalCard.tsx     # Proposal view & tally meters
│   │   ├── ProposalDetail.tsx   # Detailed proposal view & on-chain hashes
│   │   └── CreateProposalModal.tsx # Proposal creation form
│   ├── context/
│   │   ├── MidnightContext.tsx  # Lace connector & wallet state manager
│   │   └── GovernanceContext.tsx# Circuit dispatcher & ledger state
│   ├── services/
│   │   ├── crypto.ts            # SHA-256 & Poseidon hashing
│   │   ├── midnightClient.ts    # DApp connector adapter
│   │   └── mockData.ts          # Initial governance referendums
│   ├── index.css                # Midnight dark-mode Web3 design system
│   ├── App.tsx
│   └── main.tsx
├── test/
│   ├── contract.test.ts         # 7 comprehensive smart contract behavior tests
│   ├── privacy.test.ts          # 3 zero-knowledge non-leakage tests
│   └── frontend.test.ts         # Frontend data integrity tests
└── scripts/
    └── compile-compact.js       # Compact compiler & artifact generator
```

---

## 5. Automated Tests Summary

Run `npm test` to execute all 12 tests:
* `test/contract.test.ts`:
  1. Proposal creation works and initializes public ledger state.
  2. Eligible voter can vote successfully.
  3. Ineligible voter cannot vote (membership rejection).
  4. Duplicate vote rejected (nullifier replay prevention).
  5. Closed proposal rejects vote submissions.
  6. Final tally is exact across YES/NO/ABSTAIN options.
  7. Rejects malformed proposal with invalid deadlines.
* `test/privacy.test.ts`:
  1. Voter secret key and salt are never leaked in public receipts or state.
  2. Nullifiers are unlinkable across different proposals.
  3. Voter commitment hides voter identity.
* `test/frontend.test.ts`:
  1. Loads initial proposals with cryptographic integrity.
  2. Computes consistent SHA-256 hashes.

---

## 6. License

MIT License. Developed for the RiseIn Moonshots Midnight Network Track.
