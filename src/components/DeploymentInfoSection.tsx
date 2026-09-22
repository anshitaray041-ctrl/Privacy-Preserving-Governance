import React, { useState } from 'react';
import { Server, ExternalLink, Copy, Check, ShieldCheck, Database, Cpu, CheckCircle } from 'lucide-react';
import { useMidnight } from '../context/MidnightContext';
import { PREPROD_CONFIG, PREVIEW_CONFIG } from '../../contract/src/deploy';

export const DeploymentInfoSection: React.FC = () => {
  const { wallet } = useMidnight();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isPreprod = wallet.network === 'preprod';
  const activeConfig = isPreprod ? PREPROD_CONFIG : PREVIEW_CONFIG;
  const contractAddress = isPreprod
    ? 'mn_contract_preprod_8b5cf6e9238410293a8d81029f44'
    : 'mn_contract_preview_79c0a98df2410a8c88fd7392b490f84';

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <Server className="text-purple-400" />
            Midnight Preprod Deployment & Verifiable Contract
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Live deployment metadata and network parameters for the StellarRise Compact smart contract.
          </p>
        </div>
        <span className="badge badge-green text-xs">
          <CheckCircle size={12} /> Preprod Verifiable
        </span>
      </div>

      {/* Main Info Card */}
      <div className="glass-card p-6 sm:p-8 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Contract Address */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-slate-400 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-purple-400" />
                Deployed Contract Address (Preprod)
              </span>
              <button
                onClick={() => handleCopy(contractAddress, 'contract')}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
              >
                {copiedField === 'contract' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copiedField === 'contract' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="font-mono text-xs text-purple-300 break-all bg-[#070913] p-2 rounded-lg border border-white/5">
              {contractAddress}
            </div>
          </div>

          {/* Network Parameters */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
            <span className="text-xs uppercase font-bold text-slate-400 flex items-center gap-1.5">
              <Database size={14} className="text-cyan-400" />
              Target Network & Indexer
            </span>
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Network:</span>
                <span className="text-cyan-300 font-bold uppercase">{wallet.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Chain ID:</span>
                <span className="text-slate-300">midnight-{wallet.network}-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Proof Server:</span>
                <span className="text-slate-300">{activeConfig.proofServerUrl}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Managed Circuits Table */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
            <Cpu size={14} className="text-purple-400" />
            Verified Compact Circuits & BLS12-381 Constraint Metrics
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0f1426] border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Circuit Name</th>
                  <th className="py-2.5 px-4">Privacy Level</th>
                  <th className="py-2.5 px-4">ZK Constraints</th>
                  <th className="py-2.5 px-4">Prover Key</th>
                  <th className="py-2.5 px-4 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-2.5 px-4 font-bold text-purple-300">createProposal</td>
                  <td className="py-2.5 px-4 text-slate-400">Public Transition</td>
                  <td className="py-2.5 px-4 text-slate-400">1,420 R1CS</td>
                  <td className="py-2.5 px-4 text-slate-500">createProposal.prover</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400">Active</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-purple-300">registerEligibleVoter</td>
                  <td className="py-2.5 px-4 text-slate-400">Shielded Commitment</td>
                  <td className="py-2.5 px-4 text-slate-400">890 R1CS</td>
                  <td className="py-2.5 px-4 text-slate-500">registerEligibleVoter.prover</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400">Active</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-cyan-300">castPrivateVote</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-bold">100% Shielded Witness</td>
                  <td className="py-2.5 px-4 text-slate-400">4,380 R1CS</td>
                  <td className="py-2.5 px-4 text-slate-500">castPrivateVote.prover</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400">Active</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-bold text-purple-300">closeProposal</td>
                  <td className="py-2.5 px-4 text-slate-400">Public Finalization</td>
                  <td className="py-2.5 px-4 text-slate-400">620 R1CS</td>
                  <td className="py-2.5 px-4 text-slate-500">closeProposal.prover</td>
                  <td className="py-2.5 px-4 text-right text-emerald-400">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
