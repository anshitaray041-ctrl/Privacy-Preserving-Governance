import { describe, it, expect, beforeEach } from 'vitest';
import { MidnightGovernanceSimulator } from '../contract/src/simulator';
import { VoterWitness } from '../contract/src/witness';
import { ProposalStatus, VoteOption } from '../contract/src/types';

describe('StellarRise Governance Compact Smart Contract Tests', () => {
  let simulator: MidnightGovernanceSimulator;
  let aliceWitness: VoterWitness;
  let bobWitness: VoterWitness;
  let charlieWitness: VoterWitness;
  let proposalId: string;

  beforeEach(() => {
    simulator = new MidnightGovernanceSimulator();

    // Setup 3 distinct voter private witnesses
    aliceWitness = new VoterWitness();
    bobWitness = new VoterWitness();
    charlieWitness = new VoterWitness(); // Charlie will NOT be registered (ineligible)

    // Create a proposal
    const result = simulator.createProposal(
      'SIP-01: Allocate 50,000 DUST for Privacy Governance Research',
      'Proposal to fund zero-knowledge nullifier optimization research on Midnight Preprod.',
      'mn_creator_alice_9824',
      24 * 60 * 60 * 1000, // 24h registration
      7 * 24 * 60 * 60 * 1000 // 7 days voting
    );
    proposalId = result.proposalId;

    // Register Alice and Bob as eligible voters
    simulator.registerEligibleVoter(proposalId, aliceWitness.getCommitment());
    simulator.registerEligibleVoter(proposalId, bobWitness.getCommitment());
  });

  it('Test 1: Eligible voter can cast private vote and update aggregate tally', () => {
    // Alice casts private YES vote
    const voteResult = simulator.castPrivateVote(
      proposalId,
      aliceWitness,
      VoteOption.Yes
    );

    expect(voteResult.success).toBe(true);
    expect(voteResult.proposal.yesCount).toBe(1);
    expect(voteResult.proposal.noCount).toBe(0);
    expect(voteResult.proposal.abstainCount).toBe(0);
    expect(voteResult.proposal.totalVotesCast).toBe(1);
    expect(voteResult.receipt.verifiedOnLedger).toBe(true);

    // Verify nullifier is recorded on ledger
    const nullifier = aliceWitness.generateNullifier(proposalId);
    expect(simulator.isNullifierUsed(proposalId, nullifier)).toBe(true);
  });

  it('Test 2: Ineligible voter cannot vote', () => {
    // Charlie is NOT registered in the proposal's eligibility list
    expect(() => {
      simulator.castPrivateVote(
        proposalId,
        charlieWitness,
        VoteOption.Yes
      );
    }).toThrow(/Unauthorized voter/);

    // Confirm tally did NOT change
    const proposal = simulator.getProposal(proposalId);
    expect(proposal?.totalVotesCast).toBe(0);
    expect(proposal?.yesCount).toBe(0);
  });

  it('Test 3: Same voter cannot vote twice (Double voting prevention via Nullifiers)', () => {
    // Alice votes once (VoteOption.Yes)
    simulator.castPrivateVote(proposalId, aliceWitness, VoteOption.Yes);

    // Alice attempts to vote a second time (e.g. VoteOption.No)
    expect(() => {
      simulator.castPrivateVote(proposalId, aliceWitness, VoteOption.No);
    }).toThrow(/Double voting detected/);

    // Verify aggregate tally strictly reflects exactly 1 vote
    const proposal = simulator.getProposal(proposalId);
    expect(proposal?.totalVotesCast).toBe(1);
    expect(proposal?.yesCount).toBe(1);
    expect(proposal?.noCount).toBe(0);
  });

  it('Test 4: Multiple eligible voters can cast conflicting private votes anonymously', () => {
    // Alice votes YES
    simulator.castPrivateVote(proposalId, aliceWitness, VoteOption.Yes);
    // Bob votes NO
    simulator.castPrivateVote(proposalId, bobWitness, VoteOption.No);

    const proposal = simulator.getProposal(proposalId);
    expect(proposal?.yesCount).toBe(1);
    expect(proposal?.noCount).toBe(1);
    expect(proposal?.totalVotesCast).toBe(2);
  });

  it('Test 5: Closes proposal and enforces voting deadline', () => {
    const proposal = simulator.getProposal(proposalId)!;
    const pastDeadline = proposal.votingDeadline + 1000;

    // Fast-forward past deadline and close proposal
    const closeResult = simulator.closeProposal(proposalId, pastDeadline);
    expect(closeResult.proposal.status).toBe(ProposalStatus.Closed);

    // Attempting to vote on closed proposal must fail
    expect(() => {
      simulator.castPrivateVote(proposalId, aliceWitness, VoteOption.Yes, pastDeadline);
    }).toThrow(/Proposal is not active/);
  });
});
