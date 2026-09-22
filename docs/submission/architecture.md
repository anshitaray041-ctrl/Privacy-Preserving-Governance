# StellarRise System Architecture

## Architecture Overview

StellarRise separates governance operations across three coordinated tiers:
1. **Client Tier (Private Witness Enclave):** Local browser execution environment holding secret keys, generating commitments, computing nullifiers, and synthesizing zero-knowledge proofs.
2. **Midnight.js / DApp Connector Tier:** Bridge facilitating wallet connection, transaction signing, and network parameter verification via Lace Midnight.
3. **Midnight Consensus & Ledger Tier:** Public verifiable state machine storing proposal metadata, registered voter Merkle roots, spent nullifiers, and aggregate tallies.

```mermaid
sequenceDiagram
    autonumber
    actor Voter as Eligible Voter
    participant UI as StellarRise Frontend
    participant Enclave as Client Private Witness
    participant Prover as Compact ZK-SNARK Prover
    participant Lace as Lace Midnight Wallet
    participant Ledger as Midnight Preprod Ledger

    Voter->>UI: Selects Proposal & Clicks "Vote"
    UI->>Enclave: Requests Private Witness (sk, salt)
    Enclave-->>UI: Generates Commitment H(sk, salt)
    UI->>Ledger: Verifies Commitment in Registration Root
    Ledger-->>UI: Eligibility Verified

    Voter->>UI: Selects Confidential Choice (e.g., YES)
    UI->>Prover: Inputs (sk, salt, choice, proposalId)
    Note over Prover: Executes Compact Circuit: castPrivateVote<br/>- Checks eligibility membership<br/>- Computes Nullifier H(sk, propId)<br/>- Verifies Nullifier is unspent<br/>- Computes blind tally increment
    Prover-->>UI: Outputs (ZK Proof, Nullifier, Public Inputs)

    UI->>Lace: Requests Transaction Broadcast
    Lace->>Ledger: Submits ZK Proof + Nullifier
    Note over Ledger: Ledger verifies ZK Proof<br/>Records Nullifier in usedNullifiers<br/>Increments Yes Tally (+1)
    Ledger-->>Lace: Transaction Confirmed (Block #148315)
    Lace-->>UI: Tx Hash & Receipt
    UI-->>Voter: Displays Ballot Confirmed & Verifiable Proof
```

---

## Component Breakdown

### 1. Smart Contract (`contract/governance.compact`)
* **State Variables:**
  * `proposalCount`: Global proposal ID counter.
  * `proposals`: Map of proposal ID to `ProposalMeta`.
  * `registeredVoters`: Map of proposal ID to voter commitments.
  * `usedNullifiers`: Map of proposal ID to spent nullifiers.
* **Transitions:**
  * `createProposal(...)`: Public transition initializing proposal metadata.
  * `registerEligibleVoter(...)`: Registers shielded commitments prior to registration deadline.
  * `castPrivateVote(...)`: Private transition executing in-circuit membership proof, nullifier derivation, and blind tally increment.
  * `closeProposal(...)`: Finalizes voting after deadline elapsed.

### 2. Witness Provider (`contract/src/witness.ts`)
* Manages 32-byte secret keys ($sk$) and randomness ($salt$) purely in memory.
* Derives deterministic nullifiers $N = \text{SHA256}(sk \parallel \text{proposalId} \parallel \text{"STELLARRISE\_NULLIFIER"})$.

### 3. Simulation & Runtime Engine (`contract/src/simulator.ts`)
* Implements exact Midnight virtual machine execution rules for automated testing and client-side proof generation.
