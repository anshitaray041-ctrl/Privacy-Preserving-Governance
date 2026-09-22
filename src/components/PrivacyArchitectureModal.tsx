import React from 'react';
import { X, Shield, Lock, EyeOff, Key, Cpu, FileCode2, CheckCircle2 } from 'lucide-react';

interface PrivacyArchitectureModalProps {
  onClose?: () => void;
}

export const PrivacyArchitectureModal: React.FC<PrivacyArchitectureModalProps> = ({ onClose }) => {
  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <Shield className="text-purple-400" />
            Midnight Privacy Model & Compact Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Understanding Dual-State Ledgers, In-Browser Provers, and Nullifiers in StellarRise.
          </p>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1 */}
        <div className="glass-card p-6 border-purple-500/20 bg-gradient-to-b from-purple-950/20 to-transparent">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
            <Lock size={20} />
          </div>
          <h3 className="text-base font-bold text-white mb-2">1. Client-Side Witness</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The voter's private key, salt, and raw vote choice remain purely in the user's browser enclave as a <strong className="text-purple-300">witness</strong>. They are never broadcasted to the network or indexer.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="glass-card p-6 border-cyan-500/20 bg-gradient-to-b from-cyan-950/20 to-transparent">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
            <Cpu size={20} />
          </div>
          <h3 className="text-base font-bold text-white mb-2">2. Zero-Knowledge Prover</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The Compact circuit <code className="text-cyan-300">castPrivateVote</code> runs in-browser, generating a cryptographic proof that:
            <span className="block mt-1 text-slate-300">• The voter is registered in the eligibility tree</span>
            <span className="block text-slate-300">• The nullifier was correctly computed</span>
            <span className="block text-slate-300">• The tally increment is valid</span>
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="glass-card p-6 border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-transparent">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <Key size={20} />
          </div>
          <h3 className="text-base font-bold text-white mb-2">3. Unlinkable Nullifiers</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nullifiers are derived via <code className="text-emerald-300">H(secretKey, proposalId)</code>. This uniquely marks a ballot as spent for that proposal, preventing double-voting while making votes across proposals completely unlinkable.
          </p>
        </div>

      </div>

      {/* Privacy Architecture Flowchart */}
      <div className="glass-card p-6 sm:p-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-4 flex items-center gap-2">
          <FileCode2 size={16} /> Cryptographic Dataflow Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Traditional DAO */}
          <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-500/20 space-y-3">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <span>❌ Traditional Public Voting (Ethereum / Solana)</span>
            </div>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li>Voter public key broadcasted in plaintext</li>
              <li>Individual vote choice publicly exposed</li>
              <li>Vulnerable to voter intimidation and bribery</li>
              <li>Complete voting history permanently linkable</li>
            </ul>
          </div>

          {/* StellarRise Midnight */}
          <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-500/20 space-y-3">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span>✅ StellarRise on Midnight Network</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              <li>Voter identity 100% shielded via Compact witness</li>
              <li>Individual vote option calculated in ZK circuit</li>
              <li>Mathematical immunity to voter coercion</li>
              <li>Only public aggregate tally is recorded on-chain</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};
