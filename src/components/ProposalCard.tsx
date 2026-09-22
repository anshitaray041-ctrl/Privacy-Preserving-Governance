import React from 'react';
import { ProposalMeta } from '../../contract/src/types';
import { Clock, Shield, ArrowRight, UserCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { useGovernance } from '../context/GovernanceContext';
import { useMidnight } from '../context/MidnightContext';

interface ProposalCardProps {
  proposal: ProposalMeta;
  onOpenVoting: (proposal: ProposalMeta) => void;
  onViewDetails: (proposal: ProposalMeta) => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  onOpenVoting,
  onViewDetails,
}) => {
  const { isRegisteredForProposal, hasVotedOnProposal } = useGovernance();
  const { wallet } = useMidnight();

  const isRegistered = isRegisteredForProposal(proposal.id);
  const hasVoted = hasVotedOnProposal(proposal.id);
  const isActive = proposal.status === 1;

  const totalVotes = proposal.totalVotesCast || 0;
  const yesPct = totalVotes > 0 ? Math.round((proposal.yesCount / totalVotes) * 100) : 0;
  const noPct = totalVotes > 0 ? Math.round((proposal.noCount / totalVotes) * 100) : 0;
  const abstainPct = totalVotes > 0 ? Math.round((proposal.abstainCount / totalVotes) * 100) : 0;

  const formatTimeRemaining = (deadline: number) => {
    const diff = deadline - Date.now();
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div className="glass-card p-6 flex flex-col justify-between transition-all group border border-[var(--border-subtle)]">
      
      {/* Top Meta */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-purple text-[10px]">
              {proposal.category || 'Governance'}
            </span>
            <span className="font-mono text-xs text-slate-400">SIP-0{proposal.id}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {isActive ? (
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            ) : (
              <span className="text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-700">
                Closed
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onViewDetails(proposal)}
          className="text-lg font-bold font-display text-white group-hover:text-purple-300 transition-colors cursor-pointer line-clamp-2"
        >
          {proposal.title}
        </h3>

        {/* Description Snippet */}
        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {proposal.description}
        </p>
      </div>

      {/* Tally Progress Bar */}
      <div className="my-5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-300 flex items-center gap-1">
            <Shield size={12} className="text-purple-400" />
            Shielded Aggregate Tally
          </span>
          <span className="font-mono font-bold text-white">{totalVotes} Votes Cast</span>
        </div>

        {/* Triple-segment Progress Bar */}
        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden flex p-[1px] border border-white/5">
          {totalVotes === 0 ? (
            <div className="w-full h-full bg-slate-800 rounded-full" />
          ) : (
            <>
              <div 
                style={{ width: `${yesPct}%` }} 
                className="bg-emerald-500 transition-all duration-500" 
                title={`Yes: ${proposal.yesCount} (${yesPct}%)`}
              />
              <div 
                style={{ width: `${noPct}%` }} 
                className="bg-rose-500 transition-all duration-500" 
                title={`No: ${proposal.noCount} (${noPct}%)`}
              />
              <div 
                style={{ width: `${abstainPct}%` }} 
                className="bg-slate-500 transition-all duration-500" 
                title={`Abstain: ${proposal.abstainCount} (${abstainPct}%)`}
              />
            </>
          )}
        </div>

        {/* Percentage labels */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
          <span className="text-emerald-400 font-semibold">Yes {yesPct}% ({proposal.yesCount})</span>
          <span className="text-rose-400 font-semibold">No {noPct}% ({proposal.noCount})</span>
          <span className="text-slate-400">Abstain {proposal.abstainCount}</span>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock size={13} className="text-slate-500" />
          <span>{formatTimeRemaining(proposal.votingDeadline)}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(proposal)}
            className="btn btn-secondary text-xs py-1.5 px-3"
          >
            Details
          </button>

          {isActive && (
            hasVoted ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <CheckCircle size={13} /> Voted (Shielded)
              </span>
            ) : (
              <button
                onClick={() => onOpenVoting(proposal)}
                className="btn btn-primary text-xs py-1.5 px-3.5 shadow-md"
              >
                Cast Vote <ArrowRight size={13} />
              </button>
            )
          )}
        </div>

      </div>

    </div>
  );
};
