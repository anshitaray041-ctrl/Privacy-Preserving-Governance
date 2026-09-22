# StellarRise Test Suite Results Evidence

## Test Execution Summary

* **Runner:** Vitest v3.2.7
* **Environment:** Node.js v24.19.0 LTS
* **Total Test Files:** 3
* **Total Tests:** 12 Passed (100% Success)
* **Execution Time:** ~700ms

```
 RUN  v3.2.7 PrivacyPreservingGovernance

 ✓ test/frontend.test.ts (2 tests)
   ✓ Loads initial governance proposals with cryptographic hashes
   ✓ Computes consistent SHA-256 hashes for proposal integrity

 ✓ test/privacy.test.ts (3 tests)
   ✓ Privacy Property 1: Voter secret key and salt are never leaked in public receipts or state
   ✓ Privacy Property 2: Nullifiers are unlinkable across different proposals for the same voter
   ✓ Privacy Property 3: Voter commitment hides voter identity (Pedersen/Hash hiding)

 ✓ test/contract.test.ts (7 tests)
   ✓ Test 1: Proposal creation works and initializes public ledger state
   ✓ Test 2: Eligible voter can vote successfully (Valid witness & proof verification)
   ✓ Test 3: Ineligible voter cannot vote (Membership assertion failure)
   ✓ Test 4: Duplicate vote rejected (Nullifier replay prevention)
   ✓ Test 5: Closed proposal rejects vote submissions
   ✓ Test 6: Final tally is exact and publicly verifiable across all vote options
   ✓ Test 7: Rejects malformed proposal with invalid voting deadlines

 Test Files  3 passed (3)
      Tests  12 passed (12)
```
