# 🏗️ StellarRise — Architecture & Dual-State System Specification

## 1. Midnight Dual-State Paradigm

Midnight introduces a novel dual-state computational model separating **Public Ledger State** from **Private Client Witness State**.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PUBLIC LEDGER STATE                             │
│                  (Verified by all Midnight Nodes)                      │
│                                                                        │
│   • proposalCount: Counter                                             │
│   • proposals: Map<ProposalId, ProposalMeta>                           │
│   • registeredVoters: Map<ProposalId, Map<Commitment, Boolean>>        │
│   • usedNullifiers: Map<ProposalId, Map<Nullifier, Boolean>>           │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │
                         Proof Verification & State Commit
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                    CLIENT-SIDE PRIVATE WITNESS STATE                   │
│               (Never leaves the voter's local device)                  │
│                                                                        │
│   • voterSecretKey: sk_voter                                           │
│   • voterSalt: r_voter                                                 │
│   • voterEligibilityProof: MerklePath / Registration Witness           │
│   • Local Compact Runtime Prover (PLONK BLS12-381)                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. In-Circuit Verification Pipeline

When a user submits a vote:
1. **Witness Generation:** Browser fetches voter's private key `sk` and salt `r`.
2. **Commitment Check:** Circuit verifies that `Hash(sk || r)` exists in `registeredVoters`.
3. **Nullifier Construction:** Circuit derives `nullifier = Hash(sk || proposalId)`.
4. **Replay Check:** Contract asserts `usedNullifiers[proposalId][nullifier] == false`.
5. **State Update:** Contract records `usedNullifiers[proposalId][nullifier] = true` and updates aggregate tallies.
