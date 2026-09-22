import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ProposalMeta, ProposalStatus, VoteOption, ZkProofReceipt } from '../../contract/src/types';
import { MidnightGovernanceSimulator } from '../../contract/src/simulator';
import { INITIAL_PROPOSALS } from '../services/mockData';
import { useMidnight } from './MidnightContext';

export interface VotingProgressState {
  isVoting: boolean;
  step: 'idle' | 'witness_extraction' | 'zk_proving' | 'nullifier_check' | 'ledger_submission' | 'success' | 'error';
  stepMessage: string;
  errorMessage?: string;
  currentReceipt?: ZkProofReceipt;
}

interface GovernanceContextType {
  proposals: ProposalMeta[];
  activeProposal: ProposalMeta | null;
  filter: 'all' | 'active' | 'closed';
  searchQuery: string;
  proofLogs: ZkProofReceipt[];
  votingProgress: VotingProgressState;
  isRegisteredForProposal: (proposalId: string) => boolean;
  hasVotedOnProposal: (proposalId: string) => boolean;
  setFilter: (filter: 'all' | 'active' | 'closed') => void;
  setSearchQuery: (query: string) => void;
  setActiveProposal: (proposal: ProposalMeta | null) => void;
  registerAsEligibleVoter: (proposalId: string) => Promise<boolean>;
  castVote: (proposalId: string, choice: VoteOption) => Promise<boolean>;
  createNewProposal: (
    title: string,
    description: string,
    registrationDurationHours: number,
    votingDurationDays: number,
    category: string
  ) => Promise<string>;
  closeProposal: (proposalId: string) => Promise<void>;
  resetVotingState: () => void;
}

const GovernanceContext = createContext<GovernanceContextType | undefined>(undefined);

export const GovernanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { wallet, voterWitness } = useMidnight();
  const simulator = useMemo(() => new MidnightGovernanceSimulator(INITIAL_PROPOSALS), []);

  const [proposals, setProposals] = useState<ProposalMeta[]>(() => simulator.getAllProposals());
  const [activeProposal, setActiveProposal] = useState<ProposalMeta | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [proofLogs, setProofLogs] = useState<ZkProofReceipt[]>(() => simulator.getProofAuditLog());

  const [registeredProposals, setRegisteredProposals] = useState<Set<string>>(new Set(['1', '2']));
  const [votedProposals, setVotedProposals] = useState<Set<string>>(new Set());

  const [votingProgress, setVotingProgress] = useState<VotingProgressState>({
    isVoting: false,
    step: 'idle',
    stepMessage: '',
  });

  // Pre-register the active user witness for proposals 1 & 2 for demo ease
  useEffect(() => {
    try {
      simulator.registerEligibleVoter('1', voterWitness.getCommitment());
      simulator.registerEligibleVoter('2', voterWitness.getCommitment());
    } catch {
      // Ignore if already registered
    }
  }, [voterWitness, simulator]);

  const refreshState = () => {
    const updated = simulator.getAllProposals();
    setProposals(updated);
    setProofLogs(simulator.getProofAuditLog());
    if (activeProposal) {
      const refreshed = updated.find(p => p.id === activeProposal.id);
      if (refreshed) setActiveProposal(refreshed);
    }
  };

  const isRegisteredForProposal = (proposalId: string): boolean => {
    return registeredProposals.has(proposalId);
  };

  const hasVotedOnProposal = (proposalId: string): boolean => {
    const nullifier = voterWitness.generateNullifier(proposalId);
    return simulator.isNullifierUsed(proposalId, nullifier) || votedProposals.has(proposalId);
  };

  const registerAsEligibleVoter = async (proposalId: string): Promise<boolean> => {
    try {
      simulator.registerEligibleVoter(proposalId, voterWitness.getCommitment());
      setRegisteredProposals(prev => new Set([...prev, proposalId]));
      refreshState();
      return true;
    } catch (err: any) {
      console.error('Registration error:', err);
      return false;
    }
  };

  const castVote = async (proposalId: string, choice: VoteOption): Promise<boolean> => {
    setVotingProgress({
      isVoting: true,
      step: 'witness_extraction',
      stepMessage: 'Extracting private witness credentials from local secure enclave...',
    });

    await new Promise(resolve => setTimeout(resolve, 600));

    setVotingProgress({
      isVoting: true,
      step: 'zk_proving',
      stepMessage: 'Synthesizing BLS12-381 Zero-Knowledge SNARK Proof in-browser...',
    });

    await new Promise(resolve => setTimeout(resolve, 900));

    setVotingProgress({
      isVoting: true,
      step: 'nullifier_check',
      stepMessage: 'Generating unlinkable nullifier H(sk, proposalId) to guarantee 1-person-1-vote...',
    });

    await new Promise(resolve => setTimeout(resolve, 600));

    setVotingProgress({
      isVoting: true,
      step: 'ledger_submission',
      stepMessage: 'Broadcasting zero-knowledge proof to Midnight Preprod consensus layer...',
    });

    await new Promise(resolve => setTimeout(resolve, 700));

    try {
      const result = simulator.castPrivateVote(proposalId, voterWitness, choice);
      setVotedProposals(prev => new Set([...prev, proposalId]));
      refreshState();

      setVotingProgress({
        isVoting: false,
        step: 'success',
        stepMessage: 'Private Vote Verified and Successfully Recorded on Midnight Ledger!',
        currentReceipt: result.receipt,
      });

      return true;
    } catch (err: any) {
      setVotingProgress({
        isVoting: false,
        step: 'error',
        stepMessage: 'Vote submission failed',
        errorMessage: err.message || 'An error occurred during ZK verification.',
      });
      return false;
    }
  };

  const createNewProposal = async (
    title: string,
    description: string,
    registrationDurationHours: number,
    votingDurationDays: number,
    category: string
  ): Promise<string> => {
    const regMs = registrationDurationHours * 60 * 60 * 1000;
    const voteMs = votingDurationDays * 24 * 60 * 60 * 1000;

    const result = simulator.createProposal(
      title,
      description,
      wallet.address || 'mn_preprod_creator',
      regMs,
      voteMs,
      Date.now(),
      category
    );

    // Auto register creator
    simulator.registerEligibleVoter(result.proposalId, voterWitness.getCommitment());
    setRegisteredProposals(prev => new Set([...prev, result.proposalId]));

    refreshState();
    return result.proposalId;
  };

  const closeProposal = async (proposalId: string) => {
    simulator.closeProposal(proposalId);
    refreshState();
  };

  const resetVotingState = () => {
    setVotingProgress({
      isVoting: false,
      step: 'idle',
      stepMessage: '',
    });
  };

  return (
    <GovernanceContext.Provider
      value={{
        proposals,
        activeProposal,
        filter,
        searchQuery,
        proofLogs,
        votingProgress,
        isRegisteredForProposal,
        hasVotedOnProposal,
        setFilter,
        setSearchQuery,
        setActiveProposal,
        registerAsEligibleVoter,
        castVote,
        createNewProposal,
        closeProposal,
        resetVotingState,
      }}
    >
      {children}
    </GovernanceContext.Provider>
  );
};

export const useGovernance = () => {
  const context = useContext(GovernanceContext);
  if (!context) {
    throw new Error('useGovernance must be used within a GovernanceProvider');
  }
  return context;
};
