# StellarRise: 60-Second Demo Video Script

[![Watch Demo on YouTube](https://img.shields.io/badge/🎬_Watch_Demo_Video-YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/xvvtQR7w9QA)

> **YouTube Video URL:** [https://youtu.be/xvvtQR7w9QA](https://youtu.be/xvvtQR7w9QA)  
> This script provides exact second-by-second timestamps and audio cues for the walkthrough demo video.

---

### [00:00 - 00:10] Problem + StellarRise Introduction
* **Visual:** Browser opens to StellarRise Landing Page (`https://privacypreservingmidnightmoonlight.netlify.app/`). Displaying glowing Midnight Dark Theme and headline: *"Privacy-Preserving Governance on Midnight"*.
* **Voiceover:**
  > *"Conventional DAO voting exposes every ballot on-chain, leading to voter coercion, bribery, and herd mentality. Introducing **StellarRise** — the first privacy-preserving governance platform built natively on the Midnight Network that enables anonymous ballots with publicly verifiable tallies."*

---

### [00:10 - 00:20] Connect Lace Wallet
* **Visual:** Click **"Connect Lace Wallet"** in the top-right navbar. The wallet status changes to **Connected (mn_preprod_... / 2,400 DUST)**. Click the wallet button to reveal the client witness inspector.
* **Voiceover:**
  > *"We connect our Lace Midnight wallet. StellarRise extracts the voter's private witness credentials locally in the browser enclave. Notice how our secret key is labeled 'NEVER ON LEDGER'."*

---

### [00:20 - 00:35] Open Proposal & Prove Eligibility
* **Visual:** Click on **"SIP-01: Establish Midnight Preprod Shielded Grants Program"**. The Proposal Detail page loads with on-chain title hashes and Merkle root. Click **"Open Private Voting Terminal"**.
* **Voiceover:**
  > *"We open Proposal 1. The DApp checks our commitment in the on-chain eligibility Merkle tree, confirming our voting rights without exposing our real identity."*

---

### [00:35 - 00:45] Cast Private Vote
* **Visual:** Select **"Vote YES"**. Click **"Execute Zero-Knowledge Circuit"**. The 4-stage ZK proving modal activates with animated progress (`1. Witness -> 2. Compact ZKP -> 3. Nullifier -> 4. Consensus`).
* **Voiceover:**
  > *"We select YES and execute the Compact circuit. Locally in our browser, a BLS12-381 zero-knowledge proof is synthesized and a unique, unlinkable nullifier is generated to prevent double-voting."*

---

### [00:45 - 00:55] Transaction Confirmation & Observable Privacy
* **Visual:** The modal shows **"Private Ballot Confirmed"** with the on-chain proof receipt. Navigate to the **"Observable Privacy"** tab to highlight the side-by-side comparison.
* **Voiceover:**
  > *"The transaction is finalized on Midnight Preprod Block #148315. In our Observable Privacy panel, judges can see that the public ledger records the spent nullifier, while the voter's identity and individual ballot choice remain 100% shielded."*

---

### [00:55 - 01:00] Publicly Verifiable Aggregate Result
* **Visual:** Return to Governance Dashboard. The YES tally on SIP-01 updates atomically from 14 to 15 without leaking who voted.
* **Voiceover:**
  > *"The final aggregate tally updates transparently for the entire DAO. StellarRise: True privacy, verifiable consensus, powered by Midnight."*
