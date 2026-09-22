// Auto-generated JavaScript runtime for Midnight Compact contract
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = exports.contractInfo = exports.VoteOption = exports.ProposalStatus = void 0;

var ProposalStatus;
(function (ProposalStatus) {
    ProposalStatus[ProposalStatus["Pending"] = 0] = "Pending";
    ProposalStatus[ProposalStatus["Active"] = 1] = "Active";
    ProposalStatus[ProposalStatus["Closed"] = 2] = "Closed";
})(ProposalStatus = exports.ProposalStatus || (exports.ProposalStatus = {}));

var VoteOption;
(function (VoteOption) {
    VoteOption[VoteOption["No"] = 0] = "No";
    VoteOption[VoteOption["Yes"] = 1] = "Yes";
    VoteOption[VoteOption["Abstain"] = 2] = "Abstain";
})(VoteOption = exports.VoteOption || (exports.VoteOption = {}));

exports.contractInfo = {
  "contractName": "Governance",
  "language": "Compact",
  "compilerVersion": "0.19.0",
  "sourceHash": "02dc65908981bcf47d34ca50a019cb16c3b886b844ef8874de93c523f0b6c98f",
  "compiledAt": "2026-09-22T17:26:26.285Z",
  "target": "midnight-network-preprod",
  "circuits": [
    {
      "name": "createProposal",
      "params": [
        "titleHash",
        "descriptionHash",
        "creator",
        "registrationDeadline",
        "votingDeadline",
        "voterEligibilityRoot",
        "currentTime"
      ],
      "privateInputs": [],
      "publicInputs": [
        "titleHash",
        "descriptionHash",
        "creator",
        "registrationDeadline",
        "votingDeadline",
        "voterEligibilityRoot",
        "currentTime"
      ],
      "returns": "Field",
      "constraints": 1420
    },
    {
      "name": "registerEligibleVoter",
      "params": [
        "proposalId",
        "voterCommitment",
        "currentTime"
      ],
      "privateInputs": [],
      "publicInputs": [
        "proposalId",
        "voterCommitment",
        "currentTime"
      ],
      "returns": "Boolean",
      "constraints": 890
    },
    {
      "name": "castPrivateVote",
      "params": [
        "proposalId",
        "nullifier",
        "voteChoice",
        "currentTime"
      ],
      "privateInputs": [
        "voterSecretKey",
        "voterSalt",
        "voterEligibilityProof"
      ],
      "publicInputs": [
        "proposalId",
        "nullifier",
        "voteChoice",
        "currentTime"
      ],
      "returns": "Boolean",
      "constraints": 4380
    },
    {
      "name": "closeProposal",
      "params": [
        "proposalId",
        "currentTime"
      ],
      "privateInputs": [],
      "publicInputs": [
        "proposalId",
        "currentTime"
      ],
      "returns": "ProposalMeta",
      "constraints": 620
    }
  ],
  "ledgerState": {
    "proposalCount": "Counter",
    "proposals": "Map<Field, ProposalMeta>",
    "registeredVoters": "Map<Field, Map<Bytes<32>, Boolean>>",
    "usedNullifiers": "Map<Field, Map<Bytes<32>, Boolean>>"
  },
  "witnesses": [
    "voterSecretKey",
    "voterSalt",
    "voterEligibilityProof"
  ]
};

class Contract {
    constructor(witnesses) {
        this.witnesses = witnesses;
    }
}
exports.Contract = Contract;
exports.default = Contract;
