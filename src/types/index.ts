import { ProposalMeta, ProposalStatus, VoteOption, ZkProofReceipt } from '../../contract/src/types';

export { ProposalStatus, VoteOption };
export type { ProposalMeta, ZkProofReceipt };

export type NetworkType = 'preprod' | 'preview' | 'local-standalone';

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  walletName: string;
  address: string;
  shieldedAddress: string;
  dustBalance: string;
  network: NetworkType;
  voterSecret: string;
}

export interface GovernanceState {
  proposals: ProposalMeta[];
  activeProposal: ProposalMeta | null;
  isLoading: boolean;
  filter: 'all' | 'active' | 'closed';
  searchQuery: string;
  proofLogs: ZkProofReceipt[];
}
