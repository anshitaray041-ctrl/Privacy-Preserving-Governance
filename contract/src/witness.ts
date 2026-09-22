import { sha256Hex, generateRandomHex } from '../../src/services/crypto';
import { VoterPrivateState, GovernanceWitnessProvider } from './types';

/**
 * WitnessProvider manages the client-side private state for a Midnight voter.
 * This state is completely confidential to the user's browser/wallet and is
 * NEVER sent in plaintext to the public ledger.
 */
export class VoterWitness implements GovernanceWitnessProvider {
  private secretKey: string;
  private salt: string;
  private commitment: string;
  private voterAddress: string;

  constructor(secretKey?: string, salt?: string, voterAddress?: string) {
    this.secretKey = secretKey || generateRandomHex(32);
    this.salt = salt || generateRandomHex(32);
    this.commitment = sha256Hex(this.secretKey + this.salt);
    this.voterAddress = voterAddress || `mn_shielded_${this.commitment.slice(0, 24)}`;
  }

  public getPrivateState(): VoterPrivateState {
    return {
      secretKey: this.secretKey,
      salt: this.salt,
      commitment: this.commitment,
      voterAddress: this.voterAddress,
    };
  }

  public getSecretKey(): string {
    return this.secretKey;
  }

  public getSalt(): string {
    return this.salt;
  }

  public getCommitment(): string {
    return this.commitment;
  }

  public getVoterAddress(): string {
    return this.voterAddress;
  }

  /**
   * Generates a deterministic, unlinkable nullifier for a specific proposal.
   * Nullifier = Hash(secretKey + proposalId + "STELLARRISE_NULLIFIER")
   * This ensures:
   * 1. The voter can only generate ONE valid nullifier per proposal.
   * 2. Observers on the ledger cannot link nullifiers across different proposals to the same user.
   * 3. The secret key is never revealed.
   */
  public generateNullifier(proposalId: string): string {
    return sha256Hex(`${this.secretKey}:${proposalId}:STELLARRISE_NULLIFIER`);
  }

  public getEligibilityProof(proposalId: string): string {
    return sha256Hex(`PROOF:${this.commitment}:${proposalId}`);
  }
}
