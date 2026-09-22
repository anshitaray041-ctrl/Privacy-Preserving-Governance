# 🔒 StellarRise — Formal Zero-Knowledge Privacy Model & Observable State Breakdown

## 1. Core Threat Model

The StellarRise privacy model protects against four primary adversarial entities:
1. **Public Blockchain Observers:** Entities analyzing transactions, mempools, and ledger state transitions.
2. **Malicious DAO Administrators:** Proposal creators attempting to deanonymize voter selections or bribe participants.
3. **Colluding Voters & Sybil Attackers:** Actors attempting to cast multiple ballots or claim fraudulent eligibility.
4. **Network Validators / Sequencers:** Block producers who might attempt to front-run or reorder votes based on ballot content.

---

## 2. Observable Privacy Matrix (What is Visible vs What is Hidden)

| Information Element | Public Blockchain Ledger | Client-Side Private Witness | Cryptographic Guarantee |
|:---|:---:|:---:|:---|
| **Voter Wallet Address** | ❌ **Hidden** | ✅ Known locally | Preimage resistance of voter commitment |
| **Individual Ballot Direction** | ❌ **Hidden** | ✅ Known locally | Zero-Knowledge PLONK argument |
| **Voter Secret Key (`sk_voter`)** | ❌ **Hidden** | ✅ Known locally | Kept in local secure storage / enclave |
| **Shielded Commitment (`Hash(sk, salt)`)** | ✅ **Public** | ✅ Generated | One-way hashing (SHA-256 / Poseidon) |
| **Vote Nullifier (`Hash(sk, proposalId)`)** | ✅ **Public** | ✅ Generated | Pseudo-random & Unlinkable per proposal |
| **Aggregate Tally (`yes`/`no`/`abstain`)** | ✅ **Public** | ✅ Read-only | In-circuit homomorphic incrementation |
| **Proposal Metadata & Deadlines** | ✅ **Public** | ✅ Read-only | Immutable on-chain state |
| **ZK Circuit Proof ($\pi$)** | ✅ **Public** | ✅ Proved | Zero-Knowledge Succinct Non-Interactive Proof |

---

## 3. Cryptographic Primitives & Derivations

### A. Shielded Voter Commitment
$$\text{Commitment} = \text{Hash}(\text{sk}_{\text{voter}} \parallel \text{salt}_{\text{voter}})$$
Where:
- $\text{sk}_{\text{voter}} \in \mathbb{F}_p$ is the voter's private signing key.
- $\text{salt}_{\text{voter}} \in \{0, 1\}^{256}$ is cryptographically secure uniform randomness.

### B. Single-Use Nullifier
$$\text{Nullifier} = \text{Hash}(\text{sk}_{\text{voter}} \parallel \text{ProposalID})$$
Properties:
- **Deterministic:** The same voter casting on the same proposal always produces the same nullifier.
- **Unlinkable:** The nullifiers for Proposal $A$ and Proposal $B$ cannot be correlated to the same voter without knowing $\text{sk}_{\text{voter}}$.
- **Double-Vote Resistance:** The public contract maintains `usedNullifiers[proposalId][nullifier]`. If already present, transaction reverts in ZK verification.

---

## 4. Dual-State Execution Flow

1. **Local Enclave:** Voter computes witness $(\text{sk}, \text{salt})$, generates PLONK proof $\pi$ that commitment is in whitelist and nullifier is validly derived.
2. **Transmission:** Client sends $(\text{nullifier}, \text{voteChoice}, \pi)$ to Midnight Network.
3. **Midnight Public VM:** Verifies proof $\pi$, asserts `usedNullifiers[proposalId][nullifier] == false`, flags nullifier as used, and updates aggregate counts.
