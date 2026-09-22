// StellarRise: Core TypeScript definitions for Midnight Privacy-Preserving Governance

export enum ProposalStatus {
  Pending = 0,
  Active = 1,
  Closed = 2,
}

export enum VoteOption {
  No = 0,
  Yes = 1,
  Abstain = 2,
}

export interface ProposalMeta {
  id: string;
  title: string;
  description: string;
  titleHash: string;
  descriptionHash: string;
  creator: string;
  registrationDeadline: number; // Unix timestamp ms
  votingDeadline: number;       // Unix timestamp ms
  voterEligibilityRoot: string;
  status: ProposalStatus;
  yesCount: number;
  noCount: number;
  abstainCount: number;
  totalVotesCast: number;
  createdAt: number;
  category?: string;
}

export interface VoterPrivateState {
  secretKey: string;      // 32-byte hex private key (NEVER shared with ledger)
  salt: string;           // 32-byte hex entropy
  commitment: string;     // H(secretKey, salt)
  voterAddress: string;   // Midnight shielded/unshielded address
}

export interface CastVoteProofInput {
  proposalId: string;
  nullifier: string;
  voteChoice: VoteOption;
  currentTime: number;
}

export interface ZkProofReceipt {
  proofId: string;
  circuitName: string;
  publicInputs: {
    proposalId: string;
    nullifier: string;
    voteOption: string;
    timestamp: number;
  };
  zkProofHex: string;
  verifiedOnLedger: boolean;
  blockHeight?: number;
  txHash: string;
}

export interface GovernanceWitnessProvider {
  getSecretKey(): Promise<string> | string;
  getSalt(): Promise<string> | string;
  getEligibilityProof(proposalId: string): Promise<string> | string;
}
