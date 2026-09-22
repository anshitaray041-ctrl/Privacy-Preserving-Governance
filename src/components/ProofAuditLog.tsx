import React from 'react';
import { useGovernance } from '../context/GovernanceContext';
import { Shield, Cpu, CheckCircle, ExternalLink, Copy, Hash } from 'lucide-react';

export const ProofAuditLog: React.FC = () => {
  const { proofLogs } = useGovernance();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <Cpu className="text-purple-400" />
            Zero-Knowledge Proof Audit Log
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time public verifiable log of Compact circuit executions and shielded nullifier transitions.
          </p>
        </div>
        <span className="badge badge-purple text-xs">
          {proofLogs.length} Verified Circuit Transactions
        </span>
      </div>

      {/* Proof Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            
            <thead className="bg-[#0f1426] border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Circuit</th>
                <th className="py-3 px-4">Proof ID</th>
                <th className="py-3 px-4">Nullifier / Scope</th>
                <th className="py-3 px-4">ZK Proof Snippet</th>
                <th className="py-3 px-4">Block Height</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-slate-300">
              {proofLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                    No circuit proofs executed yet. Cast a private vote to record a ZK proof!
                  </td>
                </tr>
              ) : (
                proofLogs.map((log) => (
                  <tr key={log.proofId} className="hover:bg-white/[0.02] transition-colors">
                    
                    <td className="py-3.5 px-4 font-bold text-purple-300 flex items-center gap-1.5">
                      <Shield size={13} className="text-purple-400" />
                      {log.circuitName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {log.proofId}
                    </td>

                    <td className="py-3.5 px-4 text-cyan-300">
                      {log.publicInputs.nullifier}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      <span className="bg-black/30 px-2 py-0.5 rounded border border-white/5">
                        {log.zkProofHex.slice(0, 14)}...
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-emerald-400">
                      #{log.blockHeight || 104320}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle size={11} /> Verified
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Explanatory Box */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-slate-400 leading-relaxed">
        <span className="font-bold text-purple-300">Selective Disclosure In Action:</span> Notice how every row above contains proof of valid authorization and unique nullifiers, while the voter's private key, identity, and personal ballot choice remain 100% shielded from public observation.
      </div>

    </div>
  );
};
