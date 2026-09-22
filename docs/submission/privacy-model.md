# StellarRise Privacy Model & Security Analysis

## 1. Public vs. Private Ledger State

| State Field | Public On-Chain Ledger | Client-Side Witness Enclave | Justification |
| :--- | :---: | :---: | :--- |
| **Voter Secret Key (`sk`)** | ❌ Never | ✅ Exclusively Local | Protects voter cryptographic identity from deanonymization. |
| **Entropy (`salt`)** | ❌ Never | ✅ Exclusively Local | Guarantees zero-knowledge commitment hiding. |
| **Individual Vote (`choice`)** | ❌ Never | ✅ Exclusively Local | Ingested solely as a witness input inside the Compact circuit. |
| **Voter Commitment (`H(sk, salt)`)** | ✅ Registered Root | ✅ Local Derivation | Proves eligibility without disclosing real address. |
| **Nullifier (`H(sk, propId)`)** | ✅ On-Chain Set | ✅ Local Derivation | Prevents double-voting; cannot be inverted to find $sk$. |
| **Aggregate Tallies (`yes/no/abstain`)** | ✅ Public Verifiable | ❌ Read-Only | Transparently verifiable summary of collective consensus. |
| **Proposal Metadata & Status** | ✅ Public Verifiable | ❌ Read-Only | Transparent governance terms and deadlines. |

---

## 2. Cryptographic Invariants Enforced by Compact Circuits

1. **Eligibility Invariant:** A ballot is accepted if and only if the prover demonstrates knowledge of $(sk, salt)$ such that $\text{Commitment} = \text{Hash}(sk, salt) \in \text{RegisteredVoters}$.
2. **Double-Voting Invariant:** For every vote, the nullifier $N = \text{Hash}(sk, \text{proposalId})$ must satisfy $N \notin \text{UsedNullifiers}$. Upon execution, $N$ is added to $\text{UsedNullifiers}$.
3. **Soundness Invariant:** An adversary without a registered secret key cannot generate a valid zero-knowledge proof for `castPrivateVote`.
4. **Zero-Knowledge Invariant:** The proof reveals zero computational information about $(sk, salt, \text{choice})$ beyond the fact that the arithmetic constraints are satisfied.

---

## 3. Privacy Boundaries & Honest Limitations

* **Small Anonymity Sets:** In proposals with very few voters (e.g. 2 or 3 voters), statistical elimination may allow an observer to infer choices if the aggregate tally is unanimous (e.g., 3 YES votes implies all voters voted YES). To mitigate this, organizations should enforce minimum quorum thresholds before revealing tallies.
* **Network-Level Metadata:** Users should use standard network privacy (e.g. Tor or VPN) to prevent IP correlation with transaction broadcast timestamps.
