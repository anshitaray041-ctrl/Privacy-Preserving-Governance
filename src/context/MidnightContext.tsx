import React, { createContext, useContext, useState, useEffect } from 'react';
import { NetworkType, WalletState } from '../types';
import { MidnightClientService } from '../services/midnightClient';
import { VoterWitness } from '../../contract/src/witness';

interface MidnightContextType {
  wallet: WalletState;
  voterWitness: VoterWitness;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setNetwork: (network: NetworkType) => void;
  regenerateIdentity: () => void;
}

const MidnightContext = createContext<MidnightContextType | undefined>(undefined);

export const MidnightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [voterWitness, setVoterWitness] = useState<VoterWitness>(() => new VoterWitness());
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    walletName: 'Lace Midnight',
    address: '',
    shieldedAddress: '',
    dustBalance: '0.00 DUST',
    network: 'preprod',
    voterSecret: '',
  });

  useEffect(() => {
    setWallet(prev => ({
      ...prev,
      voterSecret: voterWitness.getSecretKey(),
    }));
  }, [voterWitness]);

  const connectWallet = async () => {
    setWallet(prev => ({ ...prev, isConnecting: true }));
    try {
      const data = await MidnightClientService.connectLaceWallet(wallet.network);
      setWallet(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        address: data.address,
        shieldedAddress: data.shieldedAddress,
        dustBalance: data.dustBalance,
        walletName: data.walletName,
      }));
    } catch (err) {
      console.error('Wallet connection error:', err);
      setWallet(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = () => {
    setWallet(prev => ({
      ...prev,
      isConnected: false,
      address: '',
      shieldedAddress: '',
      dustBalance: '0.00 DUST',
    }));
  };

  const setNetwork = (network: NetworkType) => {
    setWallet(prev => ({
      ...prev,
      network,
      address: prev.isConnected ? `mn_${network}_${prev.address.slice(10)}` : '',
    }));
  };

  const regenerateIdentity = () => {
    const newWitness = new VoterWitness();
    setVoterWitness(newWitness);
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
