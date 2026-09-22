import React from 'react';
import { Shield, Sparkles, ArrowRight, Lock, Eye, EyeOff, CheckCircle2, XCircle, Cpu, KeyRound } from 'lucide-react';
import { useMidnight } from '../context/MidnightContext';

interface LandingHeroProps {
  onLaunchGovernance: () => void;
  onExplorePrivacy: () => void;
  onConnectWallet: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onLaunchGovernance, onExplorePrivacy, onConnectWallet }) => {
  const { wallet } = useMidnight();

  return (
    <div className="relative overflow-hidden py-12 md:py-16">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[250px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Header */}
      <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold shadow-lg shadow-purple-500/10">
          <Sparkles size={14} className="text-cyan-400" />
          <span>RiseIn Moonshots Submission • Midnight Network</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.1]">
          Privacy-Preserving <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
            Governance on Midnight
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          StellarRise enables organizations and DAOs to make publicly verifiable governance decisions while keeping individual voter choices completely private.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onLaunchGovernance}
            className="btn btn-primary text-sm sm:text-base py-3 px-6 font-bold shadow-xl shadow-purple-500/25 flex items-center gap-2"
          >
            Launch Governance <ArrowRight size={16} />
          </button>

          {!wallet.isConnected ? (
            <button
              onClick={onConnectWallet}
              className="btn btn-secondary text-sm sm:text-base py-3 px-5 font-semibold"
            >
              Connect Wallet
            </button>
          ) : (
            <button
              onClick={onExplorePrivacy}
              className="btn btn-teal text-sm sm:text-base py-3 px-5 font-semibold"
            >
              Observe Privacy Model
            </button>
          )}
        </div>

      </div>

      {/* Visual Privacy Proof Pillar Grid */}
      <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        
        {/* Card 1: What Public Verifies */}
        <div className="glass-card p-6 sm:p-7 border-emerald-500/30 bg-gradient-to-b from-emerald-950/15 to-transparent">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-emerald-500/20">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Eye size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300 font-display">
                What the Public Can Verify
              </h3>
              <span className="text-[11px] text-slate-400">Verifiable on Midnight Ledger</span>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Proposal Authenticity:</strong> Proposal metadata and cryptographic hashes are anchored on-chain.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Eligibility Proof:</strong> The zero-knowledge circuit proves voter membership in the authorized root.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Double-Voting Prevention:</strong> Deterministic nullifiers guarantee strictly one vote per voter.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Verifiable Final Tally:</strong> Aggregate outcomes are mathematically incremented and settle transparently.</span>
            </li>
          </ul>
        </div>

        {/* Card 2: What Remains 100% Private */}
        <div className="glass-card p-6 sm:p-7 border-purple-500/30 bg-gradient-to-b from-purple-950/15 to-transparent">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-purple-500/20">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 font-display">
                What Remains Strictly Private
              </h3>
              <span className="text-[11px] text-slate-400">Shielded inside Client Witness Enclave</span>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <Lock size={15} className="text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Individual Ballot Choice:</strong> Whether you voted Yes, No, or Abstain is never revealed to anyone.</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock size={15} className="text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Voter Secret Key:</strong> Private keys remain exclusively inside your browser and are never broadcasted.</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock size={15} className="text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Cross-Proposal Unlinkability:</strong> Nullifiers for different proposals cannot be correlated to the same user.</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock size={15} className="text-purple-400 shrink-0 mt-0.5" />
              <span><strong>Anti-Coercion Immunity:</strong> Because no receipt shows your individual choice, bribery and voter intimidation are impossible.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
