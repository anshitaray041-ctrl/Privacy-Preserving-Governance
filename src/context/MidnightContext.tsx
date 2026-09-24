import React, { createContext, useContext, useState, useEffect } from 'react';
import { NetworkType, WalletState, WalletConnectionStatus, WalletType } from '../types';
import { MidnightClientService } from '../services/midnightClient';
import { VoterWitness } from '../../contract/src/witness';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

interface MidnightContextType {
  wallet: WalletState;
  voterWitness: VoterWitness;
  connectWallet: (walletType?: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  setNetwork: (network: NetworkType) => void;
  regenerateIdentity: () => void;
  clearError: () => void;
}

const MidnightContext = createContext<MidnightContextType | undefined>(undefined);

export const MidnightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [voterWitness, setVoterWitness] = useState<VoterWitness>(() => new VoterWitness());
  const [expectedNetwork, setExpectedNetwork] = useState<NetworkType>('preprod');
  const [wallet, setWallet] = useState<WalletState>({
    status: 'disconnected',
    isConnected: false,
    isConnecting: false,
    walletName: 'Lace Midnight',
    walletType: 'lace',
    address: '',
    shieldedAddress: '',
    dustBalance: '0.00 DUST',
    network: 'preprod',
    expectedNetwork: 'preprod',
    voterSecret: '',
    currentTx: { status: 'idle' },
  });

  useEffect(() => {
    setWallet(prev => ({
      ...prev,
      voterSecret: voterWitness.getSecretKey(),
    }));
  }, [voterWitness]);

  const connectWallet = async (walletType: WalletType = 'lace') => {
    setWallet(prev => ({ ...prev, isConnecting: true, status: 'connecting', error: undefined }));
    try {
      const data = await MidnightClientService.connectWallet(walletType, expectedNetwork);
      
      // Check for network mismatch
      const isMismatch = data.actualNetwork !== expectedNetwork;
      
      setWallet(prev => ({
        ...prev,
        status: isMismatch ? 'wrong_network' : 'connected',
        isConnected: !isMismatch,
        isConnecting: false,
        address: data.address,
        shieldedAddress: data.shieldedAddress,
        dustBalance: data.dustBalance,
        walletName: data.walletName,
        walletType: data.walletType,
        network: data.actualNetwork,
        expectedNetwork: expectedNetwork,
      }));
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setWallet(prev => ({
        ...prev,
        status: 'disconnected',
        isConnected: false,
        isConnecting: false,
        error: err.message || 'Failed to connect wallet',
      }));
    }
  };

  const disconnectWallet = () => {
    setWallet(prev => ({
      ...prev,
      status: 'disconnected',
      isConnected: false,
      isConnecting: false,
      address: '',
      shieldedAddress: '',
      dustBalance: '0.00 DUST',
      error: undefined,
      currentTx: { status: 'idle' },
    }));
  };

  const setNetwork = (network: NetworkType) => {
    try {
      setNetworkId(network === 'preprod' ? 'preprod' : network === 'preview' ? 'preview' : 'undeployed');
    } catch {
      // ignore in test / browser mock env
    }
    setExpectedNetwork(network);
    setWallet(prev => ({
      ...prev,
      expectedNetwork: network,
      network: network,
      status: prev.isConnected ? 'connected' : prev.status,
      address: prev.isConnected ? `mn_${network}_${prev.address.slice(10)}` : '',
    }));
  };

  const regenerateIdentity = () => {
    const newWitness = new VoterWitness();
    setVoterWitness(newWitness);
  };

  const clearError = () => {
    setWallet(prev => ({ ...prev, error: undefined }));
  };

  return (
    <MidnightContext.Provider
      value={{
        wallet,
        voterWitness,
        connectWallet,
        disconnectWallet,
        setNetwork,
        regenerateIdentity,
        clearError,
      }}
    >
      {children}
    </MidnightContext.Provider>
  );
};

export const useMidnight = () => {
  const context = useContext(MidnightContext);
  if (!context) {
    throw new Error('useMidnight must be used within a MidnightProvider');
  }
  return context;
};
