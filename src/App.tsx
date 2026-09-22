import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { StatsOverview } from './components/StatsOverview';
import { ProposalCard } from './components/ProposalCard';
import { ProposalDetail } from './components/ProposalDetail';
import { VotingModal } from './components/VotingModal';
import { CreateProposalModal } from './components/CreateProposalModal';
import { ProofAuditLog } from './components/ProofAuditLog';
import { PrivacyArchitectureModal } from './components/PrivacyArchitectureModal';
import { ObservablePrivacyPanel } from './components/ObservablePrivacyPanel';
import { DeploymentInfoSection } from './components/DeploymentInfoSection';
import { useGovernance } from './context/GovernanceContext';
import { useMidnight } from './context/MidnightContext';
import { ProposalMeta } from '../contract/src/types';
import { Search, Plus, Sparkles, AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const { proposals, filter, searchQuery, setFilter, setSearchQuery } = useGovernance();
  const { wallet, connectWallet, setNetwork } = useMidnight();

  const [activeTab, setActiveTab] = useState<'proposals' | 'privacy-demo' | 'proofs' | 'deployment' | 'architecture'>('proposals');
  const [selectedProposal, setSelectedProposal] = useState<ProposalMeta | null>(null);
  const [votingProposal, setVotingProposal] = useState<ProposalMeta | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [hasDismissedHero, setHasDismissedHero] = useState(false);

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

      <main className="app-container flex-1 mt-4">
        
        {/* Network Mismatch Warning Alert */}
        {wallet.status === 'wrong_network' && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400 shrink-0" />
              <span>
                Network Mismatch: Your wallet is connected to <strong>{wallet.network}</strong>, but this DApp is currently targeting <strong>{wallet.expectedNetwork}</strong>.
              </span>
            </div>
            <button
              onClick={() => setNetwork(wallet.expectedNetwork)}
              className="btn btn-secondary text-xs py-1.5 px-3 whitespace-nowrap border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
            >
              Switch to {wallet.expectedNetwork}
            </button>
          </div>
        )}

        {/* Tab 1: Proposals / Governance & Landing */}
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
                {/* Landing Hero (Shown when not drilling into details) */}
                {!hasDismissedHero && (
                  <LandingHero
                    onLaunchGovernance={() => {
                      const el = document.getElementById('governance-proposals-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onExplorePrivacy={() => setActiveTab('privacy-demo')}
                  />
                )}

                {/* Stats Overview */}
                <div id="governance-proposals-section">
                  <StatsOverview />
                </div>

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
                      className="btn btn-primary text-xs py-2 px-3.5 sm:hidden"
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

        {/* Tab 2: Observable Privacy Demonstration */}
        {activeTab === 'privacy-demo' && <ObservablePrivacyPanel />}

        {/* Tab 3: Proof Explorer */}
        {activeTab === 'proofs' && <ProofAuditLog />}

        {/* Tab 4: Deployment Information */}
        {activeTab === 'deployment' && <DeploymentInfoSection />}

        {/* Tab 5: Privacy Architecture */}
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
            <span>RiseIn Moonshots Submission (Level 1, 2 & 3)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Midnight Preprod</span>
            <span>•</span>
            <span>Compact 0.19</span>
            <span>•</span>
            <span>BLS12-381 ZK-SNARKs</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
