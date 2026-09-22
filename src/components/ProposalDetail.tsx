import React from 'react';
import { ProposalMeta } from '../../contract/src/types';
import { 
  ArrowLeft, Shield, Clock, Key, CheckCircle, Vote, 
  ExternalLink, Hash, Copy, Cpu, Lock, CheckCircle2 
} from 'lucide-react';
import { useGovernance } from '../context/GovernanceContext';
import { useMidnight } from '../context/MidnightContext';

interface ProposalDetailProps {
  proposal: ProposalMeta;
  onBack: () => void;
  onOpenVoting: (proposal: ProposalMeta) => void;
}

export const ProposalDetail: React.FC<ProposalDetailProps> = ({
  proposal,
  onBack,
  onOpenVoting,
}) => {
  const { isRegisteredForProposal, hasVotedOnProposal, closeProposal } = useGovernance();
  const { wallet } = useMidnight();

  const isRegistered = isRegisteredForProposal(proposal.id);
  const hasVoted = hasVotedOnProposal(proposal.id);
  const isActive = proposal.status === 1;

  const totalVotes = proposal.totalVotesCast || 0;
  const yesPct = totalVotes > 0 ? ((proposal.yesCount / totalVotes) * 100).toFixed(1) : '0';
  const noPct = totalVotes > 0 ? ((proposal.noCount / totalVotes) * 100).toFixed(1) : '0';
  const abstainPct = totalVotes > 0 ? ((proposal.abstainCount / totalVotes) * 100).toFixed(1) : '0';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Proposals
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Proposal Content & Privacy Guarantees */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="badge badge-purple">{proposal.category || 'Core Governance'}</span>
                <span className="font-mono text-xs text-slate-400">Proposal ID: SIP-0{proposal.id}</span>
              </div>
              <span className={`badge ${isActive ? 'badge-green' : 'badge-amber'}`}>
                {isActive ? 'Active Voting' : 'Proposal Concluded'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mb-4">
              {proposal.title}
            </h1>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 border-b border-white/10 pb-6 mb-6">
              <p>{proposal.description}</p>
            </div>

            {/* Cryptographic Ledger Metadata */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Hash size={14} /> Midnight On-Chain Cryptographic Commitments
              </h4>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Title Commitment:</span>
                  <span className="text-purple-300 flex items-center gap-1.5">
                    {proposal.titleHash}
                    <button 
                      onClick={() => copyToClipboard(proposal.titleHash)}
                      className="hover:text-white" title="Copy Hash"
                    >
                      <Copy size={12} />
                    </button>
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Eligibility Merkle Root:</span>
                  <span className="text-cyan-300 flex items-center gap-1.5">
                    {proposal.voterEligibilityRoot}
                    <button 
                      onClick={() => copyToClipboard(proposal.voterEligibilityRoot)}
                      className="hover:text-white" title="Copy Root"
                    >
                      <Copy size={12} />
                    </button>
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between">
                  <span className="text-slate-400">Midnight Preprod Contract:</span>
                  <span className="text-emerald-300 flex items-center gap-1.5">
                    mn_contract_preprod_8b5cf6e92...
                    <button 
                      onClick={() => copyToClipboard('mn_contract_preprod_8b5cf6e9238410293')}
                      className="hover:text-white" title="Copy Address"
                    >
                      <Copy size={12} />
                    </button>
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Privacy Model Card */}
          <div className="glass-card p-6 border-purple-500/20 bg-gradient-to-r from-purple-950/20 via-transparent to-cyan-950/20">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2 mb-3">
              <Shield className="text-purple-400 w-5 h-5" />
              Midnight Zero-Knowledge Privacy Architecture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                <div className="font-bold text-purple-300 mb-1 flex items-center gap-1">
                  <Lock size={12} /> Shielded Ballot
                </div>
                <p className="text-slate-400">
                  Your individual vote choice is computed in a zero-knowledge circuit. Only aggregate tallies are revealed.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1">
                  <Key size={12} /> Unlinkable Nullifiers
                </div>
                <p className="text-slate-400">
                  A deterministic nullifier prevents double-voting without revealing your identity across proposals.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/30 border border-white/5">
                <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1">
                  <Cpu size={12} /> In-Browser Prover
                </div>
                <p className="text-slate-400">
                  Compact circuits execute locally on your machine. Private keys never leave your browser enclave.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Voting Panel & Public Results */}
        <div className="space-y-6">
          
          {/* Action Card */}
          <div className="glass-card p-6 border-purple-500/30">
            <h3 className="text-lg font-bold font-display text-white mb-4 flex items-center gap-2">
              <Vote size={18} className="text-purple-400" />
              Private Voting Terminal
            </h3>

            {isActive ? (
              hasVoted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <CheckCircle2 size={32} className="text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-emerald-300">Ballot Shielded & Recorded</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Your zero-knowledge proof was verified on Midnight Preprod. Your nullifier is active.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-slate-300 bg-purple-950/40 border border-purple-500/20 p-3 rounded-xl">
                    <p className="font-semibold text-purple-200">Eligible Voter Status:</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isRegistered
                        ? '✅ Your cryptographic commitment is registered in the eligibility Merkle tree.'
                        : '⚠️ Unregistered commitment. You can still initialize a local witness proof.'}
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenVoting(proposal)}
                    className="btn btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-purple-500/25"
                  >
                    Open Private Voting Terminal
                  </button>
                </div>
              )
            ) : (
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700 text-center">
                <Clock size={28} className="text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-200">Voting Period Concluded</h4>
                <p className="text-xs text-slate-400 mt-1">
                  The final tally has been settled and verified on the public ledger.
                </p>
              </div>
            )}
          </div>

          {/* Real-time Tally Card */}
          <div className="glass-card p-6">
            <h3 className="text-base font-bold font-display text-white mb-4 flex items-center justify-between">
              <span>Public Verifiable Tally</span>
              <span className="badge badge-cyan text-[10px]">Real-Time Sync</span>
            </h3>

            <div className="space-y-4">
              
              {/* Option Yes */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Yes
                  </span>
                  <span className="font-mono text-white">{proposal.yesCount} ({yesPct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div style={{ width: `${yesPct}%` }} className="h-full bg-emerald-500 transition-all duration-500" />
                </div>
              </div>

              {/* Option No */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-rose-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> No
                  </span>
                  <span className="font-mono text-white">{proposal.noCount} ({noPct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div style={{ width: `${noPct}%` }} className="h-full bg-rose-500 transition-all duration-500" />
                </div>
              </div>

              {/* Option Abstain */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Abstain
                  </span>
                  <span className="font-mono text-white">{proposal.abstainCount} ({abstainPct}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div style={{ width: `${abstainPct}%` }} className="h-full bg-slate-500 transition-all duration-500" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Total Ballots Cast:</span>
                <span className="text-white font-bold">{totalVotes}</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
