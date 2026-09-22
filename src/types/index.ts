import { ProposalMeta, ProposalStatus, VoteOption, ZkProofReceipt } from '../../contract/src/types';

export { ProposalStatus, VoteOption };
export type { ProposalMeta, ZkProofReceipt };

export type NetworkType = 'preprod' | 'preview' | 'local-standalone';

export type WalletConnectionStatus = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'unavailable'
  | 'wrong_network';

export type TxStatus = 
  | 'idle'
  | 'pending'
  | 'confirmed'
  | 'failed';

export interface WalletState {
  status: WalletConnectionStatus;
  isConnected: boolean;
  isConnecting: boolean;
  walletName: string;
  address: string;
  shieldedAddress: string;
  dustBalance: string;
  network: NetworkType;
  expectedNetwork: NetworkType;
  voterSecret: string;
  error?: string;
  currentTx?: {
    status: TxStatus;
    txHash?: string;
    errorMessage?: string;
  };
}

export interface GovernanceState {
  proposals: ProposalMeta[];
  activeProposal: ProposalMeta | null;
  isLoading: boolean;
  filter: 'all' | 'active' | 'closed';
  searchQuery: string;
  proofLogs: ZkProofReceipt[];
}
