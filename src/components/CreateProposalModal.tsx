import React, { useState } from 'react';
import { X, Vote, PlusCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useGovernance } from '../context/GovernanceContext';
import { useMidnight } from '../context/MidnightContext';

interface CreateProposalModalProps {
  onClose: () => void;
  onCreated: (proposalId: string) => void;
}

export const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ onClose, onCreated }) => {
  const { createNewProposal } = useGovernance();
  const { wallet } = useMidnight();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Treasury & Grants');
  const [regHours, setRegHours] = useState(24);
  const [voteDays, setVoteDays] = useState(7);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a proposal title and description');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newId = await createNewProposal(
        title.trim(),
        description.trim(),
        regHours,
        voteDays,
        category
      );
      setIsSubmitting(false);
      onCreated(newId);
    } catch (err: any) {
      setError(err.message || 'Failed to submit proposal');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 sm:p-8 relative max-w-xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <PlusCircle size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Create Governance Proposal
            </h2>
            <p className="text-xs text-slate-400">
              Deploy a new privacy-preserving proposal to the Midnight Smart Contract
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Category */}
          <div>
            <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#070913] border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="Treasury & Grants">Treasury & Grants</option>
              <option value="Core Protocol">Core Protocol Upgrade</option>
              <option value="Security & Privacy">Security & Privacy Parameters</option>
              <option value="Community Initiative">Community Initiative</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Proposal Title:
            </label>
            <input
              type="text"
              placeholder="e.g. SIP-04: Implement Zero-Knowledge Shielded Delegation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#070913] border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
              Detailed Description:
            </label>
            <textarea
              rows={4}
              placeholder="Explain the background, objective, and privacy governance impact..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#070913] border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>

          {/* Time Windows */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Voter Reg. Window:
              </label>
              <select
                value={regHours}
                onChange={(e) => setRegHours(Number(e.target.value))}
                className="w-full bg-[#070913] border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value={12}>12 Hours</option>
                <option value={24}>24 Hours (Standard)</option>
                <option value={48}>48 Hours</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Voting Window:
              </label>
              <select
                value={voteDays}
                onChange={(e) => setVoteDays(Number(e.target.value))}
                className="w-full bg-[#070913] border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value={3}>3 Days</option>
                <option value={7}>7 Days (Recommended)</option>
                <option value={14}>14 Days</option>
              </select>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-slate-400">
            <span className="font-semibold text-purple-300">Midnight Privacy Auto-Config:</span> Title & description hashes will be computed locally in-browser and anchored into the Compact ledger state.
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary text-xs py-2.5 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary text-xs py-2.5 px-5 font-bold shadow-lg shadow-purple-500/20"
            >
              {isSubmitting ? 'Deploying Proposal...' : 'Create Proposal'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
