import React from 'react';
import { Vote, ShieldCheck, Cpu, KeyRound } from 'lucide-react';
import { useGovernance } from '../context/GovernanceContext';
import { useMidnight } from '../context/MidnightContext';

export const StatsOverview: React.FC = () => {
  const { proposals, proofLogs } = useGovernance();
  const { wallet } = useMidnight();

  const totalProposals = proposals.length;
  const activeProposals = proposals.filter(p => p.status === 1).length;
  const totalVotesCast = proposals.reduce((acc, p) => acc + p.totalVotesCast, 0);
  const totalProofsVerified = proofLogs.length + totalVotesCast;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
      
      {/* Metric 1 */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Governance Proposals
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Vote size={17} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-white">{totalProposals}</span>
          <span className="text-xs font-medium text-emerald-400">{activeProposals} Active</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
          <span>Midnight Compact Smart Contract</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Private Votes Cast
          </span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ShieldCheck size={17} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-white">{totalVotesCast}</span>
          <span className="text-xs font-medium text-cyan-300">100% Shielded</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>Zero plaintext vote leakage</span>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            ZK Proofs Verified
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cpu size={17} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-white">{totalProofsVerified}</span>
          <span className="text-xs font-medium text-purple-300">BLS12-381</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          <span>In-browser Compact proving</span>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Active Nullifiers
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <KeyRound size={17} />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-display text-white">{totalVotesCast}</span>
          <span className="text-xs font-medium text-emerald-400">Unlinkable</span>
        </div>
        <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Sybil & Replay Proof</span>
        </div>
      </div>

    </div>
  );
};
