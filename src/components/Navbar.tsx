import React, { useState } from 'react';
import { Shield, Sparkles, Wallet, LogOut, ChevronDown, CheckCircle2, Key, RefreshCw, AlertTriangle, ExternalLink, X, Zap, Rocket, FlaskConical } from 'lucide-react';
import { useMidnight } from '../context/MidnightContext';
import { NetworkType, WalletType } from '../types';
import { MidnightClientService, WalletInfo } from '../services/midnightClient';

interface NavbarProps {
  activeTab: 'proposals' | 'privacy-demo' | 'proofs' | 'deployment' | 'architecture';
  setActiveTab: (tab: 'proposals' | 'privacy-demo' | 'proofs' | 'deployment' | 'architecture') => void;
  openCreateModal: () => void;
  externalWalletModalOpen?: boolean;
  onWalletModalClose?: () => void;
}

const WalletSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletType: WalletType) => void;
  isConnecting: boolean;
  connectingType: WalletType | null;
  connectionError?: string;
}> = ({ isOpen, onClose, onSelectWallet, isConnecting, connectingType, connectionError }) => {
  if (!isOpen) return null;

  const wallets = MidnightClientService.getAvailableWallets();

  const walletIcons: Record<WalletType, React.ReactNode> = {
    demo: <FlaskConical size={22} />,
    lace: <Zap size={22} />,
    freighter: <Rocket size={22} />,
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center">
              <Wallet size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Connect Wallet</h2>
              <p className="text-xs text-slate-400">Choose a wallet to interact with StellarRise</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Connection Error */}
        {connectionError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2">
            <AlertTriangle size={14} className="text-rose-400 shrink-0 mt-0.5" />
            <span>{connectionError}</span>
          </div>
        )}

        {/* Wallet List */}
        <div className="p-6 space-y-3">
          {wallets.map((w) => {
            const isThisConnecting = isConnecting && connectingType === w.id;

            return (
              <button
                key={w.id}
                onClick={() => onSelectWallet(w.id)}
                disabled={isConnecting}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 text-left group
                  ${isThisConnecting
                    ? 'bg-purple-600/15 border-purple-500/50 ring-2 ring-purple-500/20'
                    : 'bg-[#0f1426] border-[var(--border-subtle)] hover:border-purple-500/40 hover:bg-[#151c36] cursor-pointer'
                  }
                  ${isConnecting && !isThisConnecting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {/* Wallet Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white
                  bg-gradient-to-br ${w.gradient} shadow-lg
                  ${isThisConnecting ? 'animate-pulse' : 'group-hover:scale-105 transition-transform'}
                `}>
                  {walletIcons[w.id]}
                </div>

                {/* Wallet Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white font-display">{w.name}</span>
                    {w.id === 'demo' && (
                      <span className="badge badge-green text-[9px] py-0 px-1.5">Sandbox</span>
                    )}
                    {w.id === 'lace' && (
                      <span className="badge badge-purple text-[9px] py-0 px-1.5">Midnight Native</span>
                    )}
                    {w.id === 'freighter' && (
                      <span className="badge badge-cyan text-[9px] py-0 px-1.5">Stellar Bridge</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{w.description}</p>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0">
                  {isThisConnecting ? (
                    <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-500 -rotate-90 group-hover:text-purple-400 transition-colors" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="px-6 pb-5">
          <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-400 leading-relaxed">
            <span className="text-purple-300 font-semibold">🔒 Privacy First:</span>{' '}
            Your private keys and vote choices never leave your browser. All ZK proofs are generated locally in your client enclave.
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Navbar Component ────────────────────────────────────────────────────────
export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openCreateModal, externalWalletModalOpen, onWalletModalClose }) => {
  const { wallet, voterWitness, connectWallet, disconnectWallet, setNetwork, regenerateIdentity } = useMidnight();
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const [showWitnessDetails, setShowWitnessDetails] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [connectingType, setConnectingType] = useState<WalletType | null>(null);
  const [connectionError, setConnectionError] = useState<string | undefined>();

  const isWalletModalVisible = showWalletModal || !!externalWalletModalOpen;
  const closeWalletModal = () => {
    setShowWalletModal(false);
    setConnectionError(undefined);
    onWalletModalClose?.();
  };

  const networks: { id: NetworkType; label: string; badge: string }[] = [
    { id: 'preprod', label: 'Midnight Preprod', badge: 'Live Preprod' },
    { id: 'preview', label: 'Midnight Preview', badge: 'Staging' },
    { id: 'local-standalone', label: 'Midnight Local Proof Node', badge: 'Simulation' },
  ];

  const currentNetworkLabel = networks.find(n => n.id === wallet.network)?.label || 'Midnight Preprod';

  const handleSelectWallet = async (walletType: WalletType) => {
    setConnectingType(walletType);
    setConnectionError(undefined);
    try {
      await connectWallet(walletType);
      closeWalletModal();
    } catch (err: any) {
      setConnectionError(err.message || 'Failed to connect wallet. Please try again.');
    } finally {
      setConnectingType(null);
    }
  };

  const getWalletBadgeColor = (): string => {
    switch (wallet.walletType) {
      case 'demo': return 'text-emerald-400';
      case 'freighter': return 'text-sky-400';
      case 'lace':
      default: return 'text-purple-400';
    }
  };

  const getWalletLabel = (): string => {
    switch (wallet.walletType) {
      case 'demo': return 'Demo Wallet';
      case 'freighter': return 'Freighter';
      case 'lace':
      default: return 'Lace Midnight';
    }
  };

  const getWalletIcon = (): string => {
    switch (wallet.walletType) {
      case 'demo': return '🧪';
      case 'freighter': return '🚀';
      case 'lace':
      default: return '🌙';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[#070913]/90 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('proposals')}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#0b0e1b] rounded-[11px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-purple-200">
                  StellarRise
                </span>
                <span className="badge badge-purple text-[10px] py-0.5 px-2">Midnight DApp</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-medium">Privacy-Preserving Governance</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0f1426] p-1.5 rounded-xl border border-[var(--border-subtle)]">
            <button
              onClick={() => setActiveTab('proposals')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'proposals'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Governance
            </button>
            <button
              onClick={() => setActiveTab('privacy-demo')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'privacy-demo'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Observable Privacy
            </button>
            <button
              onClick={() => setActiveTab('proofs')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'proofs'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              ZK Proof Audit
            </button>
            <button
              onClick={() => setActiveTab('deployment')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'deployment'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Deployment
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'architecture'
                  ? 'bg-purple-600/30 text-white border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Privacy Model
            </button>
          </nav>

          {/* Right Section: Network & Wallet */}
          <div className="flex items-center gap-3">
            
            {/* Network Selector */}
            <div className="relative">
              <button
                onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-[#0f1426] border border-[var(--border-subtle)] hover:border-purple-500/40 text-slate-300"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{currentNetworkLabel}</span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>

              {showNetworkDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0d1224] border border-[var(--border-active)] rounded-xl shadow-2xl p-2 z-50">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Select Midnight Network
                  </div>
                  {networks.map(n => (
                    <button
                      key={n.id}
                      onClick={() => {
                        setNetwork(n.id);
                        setShowNetworkDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-colors ${
                        wallet.network === n.id
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{n.label}</span>
                      <span className="text-[10px] text-slate-400">{n.badge}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Create Proposal Button */}
            <button
              onClick={openCreateModal}
              className="btn btn-secondary text-xs sm:text-sm py-2 px-3.5 hidden sm:inline-flex"
            >
              + New Proposal
            </button>

            {/* Wallet / Witness Controls */}
            {wallet.isConnected ? (
              <div className="relative flex items-center gap-2">
                <button
                  onClick={() => setShowWitnessDetails(!showWitnessDetails)}
                  className="flex items-center gap-2.5 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 hover:border-purple-500/60 px-3.5 py-2 rounded-xl text-left cursor-pointer transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center text-sm">
                    {getWalletIcon()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-white">
                        {wallet.address ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-4)}` : 'mn_voter'}
                      </span>
                      <CheckCircle2 size={12} className="text-emerald-400" />
                    </div>
                    <div className="text-[10px] font-mono text-cyan-300">{wallet.dustBalance}</div>
                  </div>
                </button>

                {/* Witness Inspector Dropdown */}
                {showWitnessDetails && (
                  <div className="absolute right-0 top-14 w-84 bg-[#0d1224] border border-[var(--border-active)] rounded-2xl shadow-2xl p-4 z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                        <Key size={14} />
                        Voter Private Witness (Client-Only)
                      </div>
                      <button
                        onClick={regenerateIdentity}
                        title="Generate new anonymous identity"
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5"
                      >
                        <RefreshCw size={13} />
                      </button>
                    </div>

                    {/* Connected Wallet Type */}
                    <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-base">{getWalletIcon()}</span>
                      <div>
                        <div className={`text-xs font-bold ${getWalletBadgeColor()}`}>{getWalletLabel()}</div>
                        <div className="text-[10px] text-slate-400">{wallet.walletName}</div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Shielded Address</div>
                        <div className="font-mono text-[11px] text-cyan-300 bg-black/40 p-1.5 rounded border border-white/5 break-all">
                          {voterWitness.getVoterAddress()}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400">Voter Commitment (Public Hash)</div>
                        <div className="font-mono text-[11px] text-purple-300 bg-black/40 p-1.5 rounded border border-white/5 break-all">
                          {voterWitness.getCommitment().slice(0, 32)}...
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-amber-400">Private Secret Key (Never On-Chain)</div>
                        <div className="font-mono text-[11px] text-amber-300/80 bg-black/40 p-1.5 rounded border border-white/5 break-all">
                          {voterWitness.getSecretKey().slice(0, 16)}••••••••••••••••••••••••••••••••
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">{getWalletLabel()} Connected</span>
                      <button
                        onClick={disconnectWallet}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                      >
                        <LogOut size={13} /> Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowWalletModal(true)}
                disabled={wallet.isConnecting}
                className="btn btn-primary text-xs sm:text-sm py-2 px-4 shadow-lg shadow-purple-500/20"
              >
                <Wallet size={15} />
                {wallet.isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Wallet Selection Modal */}
      <WalletSelectionModal
        isOpen={isWalletModalVisible}
        onClose={closeWalletModal}
        onSelectWallet={handleSelectWallet}
        isConnecting={wallet.isConnecting}
        connectingType={connectingType}
        connectionError={connectionError}
      />
    </>
  );
};
