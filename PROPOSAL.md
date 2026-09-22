# 🌌 StellarRise — Official RiseIn Moonshots Project Proposal

## 📌 Executive Summary

**Project Name:** StellarRise  
**Category:** Privacy-Preserving Governance & Decentralized Autonomous Organizations (DAOs)  
**Target Ecosystem:** Midnight Network (Primary ZK Smart Contract Layer) + Stellar / Cardano Interoperability  
**Language & Toolchain:** Compact Language v0.19.0, Midnight Compact Runtime, TypeScript SDK, React 18  

StellarRise solves the fundamental privacy dilemma in decentralized governance: **how to ensure individual ballot secrecy while maintaining mathematically verifiable and transparent aggregate tallies**.

---

## 🎯 Problem Statement

On existing transparent blockchains (Ethereum, Solana, Polygon), all governance voting is completely public. Every vote cast reveals:
1. **The voter's wallet address and token holdings** (exposing high-net-worth whales to targeted attacks and extortion).
2. **The exact timestamp and direction of vote** (leading to social coercion, bribery, retribution, and herd behavior).
3. **Real-time unsealed tally accumulation** (enabling last-block MEV swing voting and validator manipulation).

Current off-chain signaling solutions (like Snapshot) compromise on true decentralization, requiring trusted centralized relayer signatures and offering zero cryptographic guarantees on-chain.

---

## 💡 The StellarRise Solution

StellarRise leverages Midnight Network's **Dual-State Zero-Knowledge Architecture** to provide:
- **Shielded Voter Registration:** Voters commit to their identity using one-way cryptographic commitments `Hash(secret, salt)` without exposing wallet addresses.
- **Client-Side ZK Circuit Execution:** Vote choices and private witnesses are proven inside the user's browser/wallet using Midnight's Compact circuits.
- **Single-Use Nullifiers:** Unlinkable deterministic nullifiers `Hash(secret, proposalId)` prevent double voting on-chain while keeping voter identity anonymous.
- **Verifiable Public Tallies:** The Midnight public ledger increments aggregate counts (`yesCount`, `noCount`, `abstainCount`) with absolute mathematical verifiability and zero individual leakages.

---

## 🏗️ Technical Architecture

### 1. Dual-State Architecture
```
┌────────────────────────────────────────────────────────────────────────┐
│               CLIENT-SIDE PRIVATE STATE (User's Wallet)                 │
│                                                                        │
│   • Voter Secret Key: sk_voter (held locally)                          │
│   • Voter Random Salt: r_voter                                         │
│   • Ballot Choice: { Yes | No | Abstain }                              │
│   • In-Enclave ZK Prover (Compact BLS12-381 PLONK Proving Engine)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Generates ZK Proof + Nullifier
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 MIDNIGHT NETWORK (Public Ledger State)                 │
│                                                                        │
│   • proposals: Map<ProposalId, ProposalMeta>                           │
│   • registeredVoters: Map<ProposalId, Map<Commitment, Boolean>>        │
│   • usedNullifiers: Map<ProposalId, Map<Nullifier, Boolean>>           │
│   • Public Tallies: yesCount, noCount, abstainCount (Verifiable)      │
└────────────────────────────────────────────────────────────────────────┘
```

### 2. Smart Contract Circuits (`contract/governance.compact`)
1. `createProposal(titleHash, descriptionHash, creator, regDeadline, voteDeadline, eligibilityRoot, currentTime)`
2. `registerEligibleVoter(proposalId, voterCommitment, currentTime)`
3. `castPrivateVote(proposalId, nullifier, voteChoice, currentTime)`
4. `closeProposal(proposalId, currentTime)`

---

## 🌐 Multi-Wallet Integration Matrix

| Wallet Provider | Target Network | Integration Method | Capability |
|:---|:---|:---|:---|
| **Lace Midnight Wallet** | Midnight Preprod | Standard DApp Connector (`window.midnight.lace`) | Native ZK Proving & Transaction Submission |
| **Stellar Freighter** | Stellar Network | Real `@stellar/freighter-api` v6.0.1 Extension | Cross-chain governance verification & key delegation |
| **Instant Demo Wallet** | Midnight Sandbox | Client-Side Cryptographic Witness Engine | Instant testing with live state transitions |

---

## 🚀 RiseIn Moonshots Progression Roadmap

- **Level 1 (New Moon):** Compact v0.19 Smart Contract, TypeScript Test Simulator, Client-Side Witness Provider.
- **Level 2 (Waxing Crescent):** Multi-Wallet Connection (Lace + Freighter + Demo), Zero-Knowledge Circuit Invocation.
- **Level 3 (First Quarter):** Full Governance dApp, Observable Dual-State Privacy Panel, CI/CD Pipeline.
- **Level 4 (Waxing Gibbous):** Anonymous Delegation & Shielded Quadratic Voting.
- **Level 5 (Full Moon):** Cross-Chain Bridge & Multi-Ecosystem Asset-Weighted Voting.
- **Level 6 (Supermoon):** Full Security Audit, Formal Threat Model & Mainnet Ready Config.
