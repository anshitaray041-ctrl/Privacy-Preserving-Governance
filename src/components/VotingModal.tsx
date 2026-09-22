import React, { useState } from 'react';
import { ProposalMeta, VoteOption } from '../../contract/src/types';
import { X, Shield, Key, Cpu, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { useGovernance } from '../context/GovernanceContext';
import { useMidnight } from '../context/MidnightContext';

interface VotingModalProps {
  proposal: ProposalMeta;
  onClose: () => void;
}

export const VotingModal: React.FC<VotingModalProps> = ({ proposal, onClose }) => {
  const { castVote, votingProgress, resetVotingState } = useGovernance();
  const { voterWitness, wallet } = useMidnight();
  const [selectedOption, setSelectedOption] = useState<VoteOption>(VoteOption.Yes);

  const isProving = votingProgress.isVoting;
  const isSuccess = votingProgress.step === 'success';
  const isError = votingProgress.step === 'error';

  const previewNullifier = voterWitness.generateNullifier(proposal.id);

  const handleSubmitVote = async () => {
    await castVote(proposal.id, selectedOption);
  };

  const handleClose = () => {
    resetVotingState();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8 relative">
        
        {/* Close Button */}
        {!isProving && (
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
          >
            <X size={20} />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Shield size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Private Voting Terminal
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              SIP-0{proposal.id}: {proposal.title.slice(0, 45)}...
            </p>
          </div>
        </div>

        {/* State 1: Choose Vote Option */}
        {!isProving && !isSuccess && !isError && (
          <div className="space-y-6">
            
            {/* Ballot Options */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">
                Select Your Confidential Vote:
              </label>

              <div className="grid grid-cols-3 gap-3">
                
                {/* Option Yes */}
                <button
                  onClick={() => setSelectedOption(VoteOption.Yes)}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                    selectedOption === VoteOption.Yes
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/10'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedOption === VoteOption.Yes ? 'border-emerald-400 bg-emerald-400' : 'border-slate-500'
                  }`}>
                    {selectedOption === VoteOption.Yes && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                  </div>
                  <span className="font-bold text-sm">Vote YES</span>
                </button>

                {/* Option No */}
                <button
                  onClick={() => setSelectedOption(VoteOption.No)}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                    selectedOption === VoteOption.No
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-lg shadow-rose-500/10'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedOption === VoteOption.No ? 'border-rose-400 bg-rose-400' : 'border-slate-500'
                  }`}>
                    {selectedOption === VoteOption.No && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                  </div>
                  <span className="font-bold text-sm">Vote NO</span>
                </button>

                {/* Option Abstain */}
                <button
                  onClick={() => setSelectedOption(VoteOption.Abstain)}
                  className={`p-4 rounded-xl border text-center transition-all flex flex-col items-center gap-2 ${
                    selectedOption === VoteOption.Abstain
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/10'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedOption === VoteOption.Abstain ? 'border-purple-400 bg-purple-400' : 'border-slate-500'
                  }`}>
                    {selectedOption === VoteOption.Abstain && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                  </div>
                  <span className="font-bold text-sm">ABSTAIN</span>
                </button>

              </div>
            </div>

            {/* Cryptographic Witness Inspection Panel */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-purple-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Key size={14} /> Client Witness Execution Context
                </span>
                <span className="text-[10px] bg-purple-500/20 px-2 py-0.5 rounded text-purple-300">
                  Local Enclave
                </span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Commitment:</span>
                  <span className="text-slate-300">{voterWitness.getCommitment().slice(0, 18)}...</span>
                </div>
                <div className="flex justify-between">
                  <span>Computed Nullifier:</span>
                  <span className="text-cyan-300">{previewNullifier.slice(0, 18)}...</span>
                </div>
                <div className="flex justify-between">
                  <span>Private Witness Key:</span>
                  <span className="text-amber-300/80">SHIELDED (Local Only)</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitVote}
              className="btn btn-primary w-full py-3.5 text-sm font-bold shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2"
            >
              <Cpu size={16} /> Execute Zero-Knowledge Circuit
            </button>

          </div>
        )}

        {/* State 2: Proving & Prover Progress Animation */}
        {isProving && (
          <div className="py-8 space-y-6 text-center zk-scan-effect rounded-2xl bg-black/40 border border-purple-500/30 p-6">
            <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
              <Cpu className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Synthesizing Zero-Knowledge Proof</h3>
              <p className="text-xs text-purple-300 font-mono">
                {votingProgress.stepMessage}
              </p>
            </div>

            {/* Stepper progress */}
            <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-400 pt-4 border-t border-white/10 font-mono">
              <div className={votingProgress.step === 'witness_extraction' ? 'text-purple-300 font-bold' : ''}>
                1. Witness
              </div>
              <div className={votingProgress.step === 'zk_proving' ? 'text-purple-300 font-bold' : ''}>
                2. Compact ZKP
              </div>
              <div className={votingProgress.step === 'nullifier_check' ? 'text-purple-300 font-bold' : ''}>
                3. Nullifier
              </div>
              <div className={votingProgress.step === 'ledger_submission' ? 'text-purple-300 font-bold' : ''}>
                4. Consensus
              </div>
            </div>
          </div>
        )}

        {/* State 3: Success Receipt */}
        {isSuccess && (
          <div className="space-y-5">
            <div className="text-center p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
              <CheckCircle2 size={42} className="text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-emerald-300">Private Ballot Confirmed</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your vote was cryptographically proven and aggregated into the public state.
              </p>
            </div>

            {votingProgress.currentReceipt && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs space-y-2">
                <div className="text-slate-400 text-[11px] font-bold uppercase border-b border-white/10 pb-1">
                  Midnight Proof Receipt
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Circuit:</span>
                  <span className="text-purple-300">{votingProgress.currentReceipt.circuitName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nullifier:</span>
                  <span className="text-cyan-300">{votingProgress.currentReceipt.publicInputs.nullifier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Choice:</span>
                  <span className="text-emerald-300">{votingProgress.currentReceipt.publicInputs.voteOption}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tx Hash:</span>
                  <span className="text-slate-300">{votingProgress.currentReceipt.txHash.slice(0, 18)}...</span>
                </div>
              </div>
            )}

            <button
              onClick={handleClose}
              className="btn btn-secondary w-full py-3 text-sm font-semibold"
            >
              Done
            </button>
          </div>
        )}

        {/* State 4: Error State */}
        {isError && (
          <div className="space-y-5">
            <div className="text-center p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30">
              <AlertTriangle size={42} className="text-rose-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-rose-300">Circuit Assertion Failed</h3>
              <p className="text-xs text-rose-200 mt-1">
                {votingProgress.errorMessage}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="btn btn-secondary w-full py-3 text-sm font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
