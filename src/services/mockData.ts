import { ProposalMeta, ProposalStatus } from '../../contract/src/types';
import { sha256Hex } from './crypto';

const now = Date.now();
const dayMs = 24 * 60 * 60 * 1000;

export const INITIAL_PROPOSALS: ProposalMeta[] = [
  {
    id: '1',
    title: 'SIP-01: Establish Midnight Preprod Shielded Grants Program',
    description: 'Allocate 250,000 DUST tokens to bootstrap developer tooling, zero-knowledge voting privacy circuits, and decentralized governance analytics on Midnight Preprod.',
    titleHash: sha256Hex('SIP-01: Establish Midnight Preprod Shielded Grants Program'),
    descriptionHash: sha256Hex('Allocate 250,000 DUST tokens to bootstrap developer tooling...'),
    creator: 'mn_preprod_1q9d84f09238fha2804294jff02j48f9j489jf849fj84',
    registrationDeadline: now + 2 * dayMs,
    votingDeadline: now + 5 * dayMs,
    voterEligibilityRoot: sha256Hex('STELLARRISE_ROOT_1_GENESIS'),
    status: ProposalStatus.Active,
    yesCount: 14,
    noCount: 2,
    abstainCount: 1,
    totalVotesCast: 17,
    createdAt: now - 1 * dayMs,
    category: 'Treasury & Grants'
  },
  {
    id: '2',
    title: 'SIP-02: Upgrade Compact Governance Circuit to Nullifier v2',
    description: 'Implement BLS12-381 optimized Poseidon hashing inside the castPrivateVote circuit to reduce in-browser proof generation latency by 45% on consumer hardware.',
    titleHash: sha256Hex('SIP-02: Upgrade Compact Governance Circuit to Nullifier v2'),
    descriptionHash: sha256Hex('Implement BLS12-381 optimized Poseidon hashing...'),
    creator: 'mn_preprod_1q79c0a98df2410a8c88fd7392b490f8423f0a1209b',
    registrationDeadline: now + 1 * dayMs,
    votingDeadline: now + 4 * dayMs,
    voterEligibilityRoot: sha256Hex('STELLARRISE_ROOT_2_CIRCUITS'),
    status: ProposalStatus.Active,
    yesCount: 28,
    noCount: 0,
    abstainCount: 3,
    totalVotesCast: 31,
    createdAt: now - 2 * dayMs,
    category: 'Core Protocol'
  },
  {
    id: '3',
    title: 'SIP-03: Ratify StellarRise Zero-Knowledge Anonymity Standards',
    description: 'Adopt formal selective disclosure criteria guaranteeing that individual voter choices and membership keys are mathematically unlinkable from public ledger states.',
    titleHash: sha256Hex('SIP-03: Ratify StellarRise Zero-Knowledge Anonymity Standards'),
    descriptionHash: sha256Hex('Adopt formal selective disclosure criteria...'),
    creator: 'mn_preprod_1q44a8e90c210984da09f0293e84019283f0192a39',
    registrationDeadline: now - 3 * dayMs,
    votingDeadline: now - 1 * dayMs,
    voterEligibilityRoot: sha256Hex('STELLARRISE_ROOT_3_SECURITY'),
    status: ProposalStatus.Closed,
    yesCount: 52,
    noCount: 4,
    abstainCount: 2,
    totalVotesCast: 58,
    createdAt: now - 5 * dayMs,
    category: 'Security & Privacy'
  }
];
