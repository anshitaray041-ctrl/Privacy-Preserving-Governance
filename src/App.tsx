import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { ProposalCard } from './components/ProposalCard';
import { ProposalDetail } from './components/ProposalDetail';
import { VotingModal } from './components/VotingModal';
import { CreateProposalModal } from './components/CreateProposalModal';
import { ProofAuditLog } from './components/ProofAuditLog';
import { PrivacyArchitectureModal } from './components/PrivacyArchitectureModal';
import { PrivacyBadge } from './components/PrivacyBadge';
import { useGovernance } from './context/GovernanceContext';
import { useMidnight } from './context/MidnightContext';
import { ProposalMeta } from '../contract/src/types';
import { Search, Filter, Plus, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const { proposals, filter, searchQuery, setFilter, setSearchQuery } = useGovernance();
  const { wallet, connectWallet } = useMidnight();

  const [activeTab, setActiveTab] = useState<'proposals' | 'proofs' | 'architecture'>('proposals');
  const [selectedProposal, setSelectedProposal] = useState<ProposalMeta | null>(null);
  const [votingProposal, setVotingProposal] = useState<ProposalMeta | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filtered proposals
  const filteredProposals = proposals.filter((p) => {
    if (filter === 'active' && p.status !== 1) return false;
    if (filter === 'closed' && p.status !== 2) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenVoting = (proposal: ProposalMeta) => {
    setVotingProposal(proposal);
  };

  const handleViewDetails = (proposal: ProposalMeta) => {
    setSelectedProposal(proposal);
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedProposal(null);
        }}
        openCreateModal={() => setIsCreateModalOpen(true)}
      />

      <main className="app-container flex-1 mt-6">
        
        {/* Banner Alert for Midnight Preprod */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-cyan-950/40 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Midnight Network Privacy Protocol
                <span className="badge badge-purple text-[10px]">Zero-Knowledge</span>
              </h4>
              <p className="text-xs text-slate-300">
                StellarRise enforces confidential ballots with client-side witness proving & public nullifiers.
              </p>
            </div>
          </div>
          
          {!wallet.isConnected && (
            <button
              onClick={connectWallet}
              className="btn btn-primary text-xs py-2 px-4 whitespace-nowrap shadow-md"
            >
              Connect Wallet to Vote
            </button>
          )}
        </div>

        {/* Tab 1: Proposals / Governance */}
        {activeTab === 'proposals' && (
          <>
            {selectedProposal ? (
              <ProposalDetail
                proposal={selectedProposal}
                onBack={() => setSelectedProposal(null)}
                onOpenVoting={handleOpenVoting}
              />
            ) : (
              <>
                {/* Stats Overview */}
                <StatsOverview />

                {/* Filters & Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                  
                  {/* Search Bar */}
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search proposals by title or keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0d1224] border border-[var(--border-subtle)] focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex items-center gap-1 bg-[#0d1224] p-1 rounded-xl border border-[var(--border-subtle)]">
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          filter === 'all'
                            ? 'bg-purple-600/30 text-white border border-purple-500/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        All ({proposals.length})
                      </button>
                      <button
                        onClick={() => setFilter('active')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          filter === 'active'
                            ? 'bg-purple-600/30 text-white border border-purple-500/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => setFilter('closed')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          filter === 'closed'
                            ? 'bg-purple-600/30 text-white border border-purple-500/40'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Closed
                      </button>
                    </div>

                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="btn btn-primary text-xs py-2 px-3.5 md:hidden"
                    >
                      <Plus size={14} /> New
                    </button>
                  </div>

                </div>

                {/* Proposals Grid */}
                {filteredProposals.length === 0 ? (
                  <div className="glass-card p-12 text-center text-slate-400">
                    <AlertCircle size={36} className="mx-auto text-slate-600 mb-3" />
                    <h3 className="text-base font-bold text-white">No proposals found</h3>
                    <p className="text-xs mt-1">Try adjusting your search query or filter criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProposals.map((proposal) => (
                      <ProposalCard
                        key={proposal.id}
                        proposal={proposal}
                        onOpenVoting={handleOpenVoting}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Tab 2: Proof Explorer */}
        {activeTab === 'proofs' && <ProofAuditLog />}

        {/* Tab 3: Privacy Architecture */}
        {activeTab === 'architecture' && <PrivacyArchitectureModal />}

      </main>

      {/* Voting Modal */}
      {votingProposal && (
        <VotingModal
          proposal={votingProposal}
          onClose={() => setVotingProposal(null)}
        />
      )}

      {/* Create Proposal Modal */}
      {isCreateModalOpen && (
        <CreateProposalModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={(newId) => {
            setIsCreateModalOpen(false);
            const found = proposals.find(p => p.id === newId);
            if (found) setSelectedProposal(found);
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[#070913] py-6 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-[1240px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">StellarRise</span>
            <span>—</span>
            <span>RiseIn Moonshots Submission</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Powered by Midnight Network</span>
            <span>•</span>
            <span>Compact Smart Contracts</span>
            <span>•</span>
            <span>Zero-Knowledge Proofs</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
