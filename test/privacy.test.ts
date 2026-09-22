import { describe, it, expect } from 'vitest';
import { MidnightGovernanceSimulator } from '../contract/src/simulator';
import { VoterWitness } from '../contract/src/witness';
import { VoteOption } from '../contract/src/types';

describe('StellarRise Zero-Knowledge Privacy Model Assertions', () => {
  it('Privacy Property 1: Voter secret key and salt are never leaked in public receipts or state', () => {
    const simulator = new MidnightGovernanceSimulator();
    const witness = new VoterWitness();
    const privateState = witness.getPrivateState();

    const { proposalId } = simulator.createProposal(
      'Privacy Audit Proposal',
      'Validating non-leakage of witness data in public transactions',
      'mn_deployer'
    );
    simulator.registerEligibleVoter(proposalId, witness.getCommitment());

    const result = simulator.castPrivateVote(proposalId, witness, VoteOption.Yes);

    const publicReceiptJson = JSON.stringify(result.receipt);
    const publicProposalJson = JSON.stringify(result.proposal);

    // Assert that voter secret key is NEVER in public ledger or receipt
    expect(publicReceiptJson.includes(privateState.secretKey)).toBe(false);
    expect(publicReceiptJson.includes(privateState.salt)).toBe(false);
    expect(publicProposalJson.includes(privateState.secretKey)).toBe(false);
    expect(publicProposalJson.includes(privateState.salt)).toBe(false);

    // Assert individual choice is shielded in receipt publicInputs
    expect(result.receipt.publicInputs.voteOption).toContain('SHIELDED');
  });

  it('Privacy Property 2: Nullifiers are unlinkable across different proposals for the same voter', () => {
    const witness = new VoterWitness();

    const nullifier1 = witness.generateNullifier('proposal_01');
    const nullifier2 = witness.generateNullifier('proposal_02');

    // Both nullifiers must be distinct so an observer cannot correlate votes by the same identity
    expect(nullifier1).not.toBe(nullifier2);
    expect(nullifier1.length).toBe(64);
    expect(nullifier2.length).toBe(64);
  });

  it('Privacy Property 3: Voter commitment hides voter identity (Pedersen/Hash hiding)', () => {
    const witness1 = new VoterWitness();
    const witness2 = new VoterWitness();

    expect(witness1.getCommitment()).not.toBe(witness2.getCommitment());
    expect(witness1.getCommitment().length).toBe(64);
  });
});
