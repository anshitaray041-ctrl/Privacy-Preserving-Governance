import { sha256Hex, generateRandomHex } from '../../src/services/crypto';
import { ProposalMeta, ProposalStatus, VoteOption, ZkProofReceipt } from './types';
import { VoterWitness } from './witness';

/**
 * MidnightGovernanceSimulator
 * Emulates the Midnight Network virtual machine and zero-knowledge circuit
 * execution environment for the StellarRise Governance Compact contract.
 *
 * Implements exact ledger constraints:
 * - Public state transparency for aggregated counts and nullifiers
 * - Strict zero-knowledge isolation for voter private keys and individual vote choices
 * - Replay / double-voting prevention via cryptographic nullifier registry
 */
export class MidnightGovernanceSimulator {
  private proposalCounter: number = 0;
  private proposals: Map<string, ProposalMeta> = new Map();
  private registeredVoters: Map<string, Set<string>> = new Map(); // proposalId -> Set of commitments
  private usedNullifiers: Map<string, Set<string>> = new Map();   // proposalId -> Set of nullifiers
  private proofAuditLog: ZkProofReceipt[] = [];

  constructor(initialProposals?: ProposalMeta[]) {
    if (initialProposals && initialProposals.length > 0) {
      for (const p of initialProposals) {
        this.proposals.set(p.id, { ...p });
        this.registeredVoters.set(p.id, new Set());
        this.usedNullifiers.set(p.id, new Set());
        this.proposalCounter = Math.max(this.proposalCounter, parseInt(p.id, 10) || 0);
      }
    }
  }

  /**
   * Circuit: createProposal
   */
  public createProposal(
    title: string,
    description: string,
    creator: string,
    registrationDurationMs: number = 24 * 60 * 60 * 1000,
    votingDurationMs: number = 7 * 24 * 60 * 60 * 1000,
    currentTime: number = Date.now(),
    category: string = 'Treasury'
  ): { proposalId: string; proposal: ProposalMeta; receipt: ZkProofReceipt } {
    this.proposalCounter += 1;
    const proposalId = this.proposalCounter.toString();
    const titleHash = sha256Hex(title);
    const descriptionHash = sha256Hex(description);
    const eligibilityRoot = sha256Hex(`STELLARRISE_ROOT_${proposalId}_${currentTime}`);

    const registrationDeadline = currentTime + registrationDurationMs;
    const votingDeadline = currentTime + votingDurationMs;

    if (votingDeadline <= registrationDeadline) {
      throw new Error('Voting deadline must be after registration deadline');
    }

    const proposal: ProposalMeta = {
      id: proposalId,
      title,
      description,
      titleHash,
      descriptionHash,
      creator,
      registrationDeadline,
      votingDeadline,
      voterEligibilityRoot: eligibilityRoot,
      status: ProposalStatus.Active,
      yesCount: 0,
      noCount: 0,
      abstainCount: 0,
      totalVotesCast: 0,
      createdAt: currentTime,
      category,
    };

    this.proposals.set(proposalId, proposal);
    this.registeredVoters.set(proposalId, new Set());
    this.usedNullifiers.set(proposalId, new Set());

    const receipt: ZkProofReceipt = {
      proofId: `zkp_${generateRandomHex(8)}`,
      circuitName: 'createProposal',
      publicInputs: {
        proposalId,
        nullifier: 'N/A',
        voteOption: 'N/A',
        timestamp: currentTime,
      },
      zkProofHex: `0x${generateRandomHex(64)}`,
      verifiedOnLedger: true,
      blockHeight: 104200 + this.proposalCounter,
      txHash: `0x${generateRandomHex(32)}`,
    };
    this.proofAuditLog.push(receipt);

    return { proposalId, proposal, receipt };
  }

  /**
   * Circuit: registerEligibleVoter
   */
  public registerEligibleVoter(
    proposalId: string,
    voterCommitment: string,
    currentTime: number = Date.now()
  ): { success: boolean; receipt: ZkProofReceipt } {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }
    if (proposal.status !== ProposalStatus.Active) {
      throw new Error('Proposal is not active');
    }
    if (currentTime > proposal.registrationDeadline) {
      throw new Error('Voter registration period has ended');
    }

    const voterSet = this.registeredVoters.get(proposalId)!;
    voterSet.add(voterCommitment);

    const receipt: ZkProofReceipt = {
      proofId: `zkp_${generateRandomHex(8)}`,
      circuitName: 'registerEligibleVoter',
      publicInputs: {
        proposalId,
        nullifier: 'N/A',
        voteOption: 'N/A',
        timestamp: currentTime,
      },
      zkProofHex: `0x${generateRandomHex(64)}`,
      verifiedOnLedger: true,
      blockHeight: 104250,
      txHash: `0x${generateRandomHex(32)}`,
    };
    this.proofAuditLog.push(receipt);

    return { success: true, receipt };
  }

  /**
   * Circuit: castPrivateVote
   * Evaluates the in-circuit zero knowledge constraints:
   * 1. Extracts witness secretKey & salt
   * 2. Checks commitment membership in registeredVoters (eligibility)
   * 3. Calculates deterministic nullifier in-circuit
   * 4. Validates nullifier has not been used (double-vote prevention)
   * 5. Atomically increments aggregate public tally without revealing voter identity or individual vote
   */
  public castPrivateVote(
    proposalId: string,
    voterWitness: VoterWitness,
    voteChoice: VoteOption,
    currentTime: number = Date.now()
  ): { success: boolean; nullifier: string; receipt: ZkProofReceipt; proposal: ProposalMeta } {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }
    if (proposal.status !== ProposalStatus.Active) {
      throw new Error('Proposal is not active');
    }
    if (currentTime > proposal.votingDeadline) {
      throw new Error('Voting period has ended for this proposal');
    }

    // 1. In-circuit commitment verification
    const commitment = voterWitness.getCommitment();
    const registeredSet = this.registeredVoters.get(proposalId);
    if (!registeredSet || !registeredSet.has(commitment)) {
      throw new Error('Unauthorized voter: Voter commitment is not registered or eligible for this proposal');
    }

    // 2. Derive zero-knowledge nullifier
    const nullifier = voterWitness.generateNullifier(proposalId);

    // 3. Double voting check in ledger state
    const nullifierSet = this.usedNullifiers.get(proposalId)!;
    if (nullifierSet.has(nullifier)) {
      throw new Error('Double voting detected: This voter has already cast a ballot for this proposal');
    }

    // 4. Mark nullifier as spent on public ledger
    nullifierSet.add(nullifier);

    // 5. Update public aggregate tallies
    if (voteChoice === VoteOption.Yes) {
      proposal.yesCount += 1;
    } else if (voteChoice === VoteOption.No) {
      proposal.noCount += 1;
    } else if (voteChoice === VoteOption.Abstain) {
      proposal.abstainCount += 1;
    }
    proposal.totalVotesCast += 1;

    // 6. Generate cryptographic proof receipt
    const optionName = voteChoice === VoteOption.Yes ? 'Yes' : voteChoice === VoteOption.No ? 'No' : 'Abstain';
    const receipt: ZkProofReceipt = {
      proofId: `zkp_${generateRandomHex(8)}`,
      circuitName: 'castPrivateVote',
      publicInputs: {
        proposalId,
        nullifier: `0x${nullifier.slice(0, 16)}...${nullifier.slice(-8)}`,
        voteOption: 'SHIELDED (Aggregated in Ledger State)',
        timestamp: currentTime,
      },
      zkProofHex: `0x${generateRandomHex(128)}`,
      verifiedOnLedger: true,
      blockHeight: 104300 + proposal.totalVotesCast,
      txHash: `0x${generateRandomHex(32)}`,
    };
    this.proofAuditLog.push(receipt);

    return { success: true, nullifier, receipt, proposal: { ...proposal } };
  }

  /**
   * Circuit: closeProposal
   */
  public closeProposal(
    proposalId: string,
    currentTime: number = Date.now()
  ): { proposal: ProposalMeta; receipt: ZkProofReceipt } {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }
    if (proposal.status !== ProposalStatus.Active) {
      throw new Error('Proposal is already closed or not active');
    }

    proposal.status = ProposalStatus.Closed;

    const receipt: ZkProofReceipt = {
      proofId: `zkp_${generateRandomHex(8)}`,
      circuitName: 'closeProposal',
      publicInputs: {
        proposalId,
        nullifier: 'N/A',
        voteOption: 'N/A',
        timestamp: currentTime,
      },
      zkProofHex: `0x${generateRandomHex(64)}`,
      verifiedOnLedger: true,
      blockHeight: 104500,
      txHash: `0x${generateRandomHex(32)}`,
    };
    this.proofAuditLog.push(receipt);

    return { proposal: { ...proposal }, receipt };
  }

  public getProposal(proposalId: string): ProposalMeta | undefined {
    const p = this.proposals.get(proposalId);
    return p ? { ...p } : undefined;
  }

  public getAllProposals(): ProposalMeta[] {
    return Array.from(this.proposals.values()).map(p => ({ ...p }));
  }

  public getProofAuditLog(): ZkProofReceipt[] {
    return [...this.proofAuditLog];
  }

  public getNullifierCount(proposalId: string): number {
    return this.usedNullifiers.get(proposalId)?.size || 0;
  }

  public isNullifierUsed(proposalId: string, nullifier: string): boolean {
    return this.usedNullifiers.get(proposalId)?.has(nullifier) || false;
  }
}
