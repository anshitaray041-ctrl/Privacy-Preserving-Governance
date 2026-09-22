import { describe, it, expect } from 'vitest';
import { INITIAL_PROPOSALS } from '../src/services/mockData';
import { sha256Hex } from '../src/services/crypto';

describe('StellarRise Frontend Services & Data Tests', () => {
  it('Loads initial governance proposals with cryptographic hashes', () => {
    expect(INITIAL_PROPOSALS.length).toBeGreaterThan(0);
    const p1 = INITIAL_PROPOSALS[0];
    expect(p1.titleHash).toBeDefined();
    expect(p1.descriptionHash).toBeDefined();
    expect(p1.voterEligibilityRoot).toBeDefined();
    expect(p1.totalVotesCast).toBe(p1.yesCount + p1.noCount + p1.abstainCount);
  });

  it('Computes consistent SHA-256 hashes for proposal integrity', () => {
    const text = 'SIP-01: Establish Midnight Preprod Shielded Grants Program';
    const hash1 = sha256Hex(text);
    const hash2 = sha256Hex(text);
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64);
  });
});
