// src/classes/lending.ts
import { createPublicClient, http } from "viem";
import { multicall } from "viem/actions";
import { linea } from "viem/chains";

// src/abis/comptroller.json
var comptroller_default = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "action",
        type: "string"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "pauseState",
        type: "bool"
      }
    ],
    name: "ActionPaused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "string",
        name: "action",
        type: "string"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "pauseState",
        type: "bool"
      }
    ],
    name: "ActionPaused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "error",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "info",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "detail",
        type: "uint256"
      }
    ],
    name: "Failure",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "MarketEntered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "MarketExited",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      }
    ],
    name: "MarketListed",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newBorrowCap",
        type: "uint256"
      }
    ],
    name: "NewBorrowCap",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldBorrowCapGuardian",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "newBorrowCapGuardian",
        type: "address"
      }
    ],
    name: "NewBorrowCapGuardian",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldCloseFactorMantissa",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newCloseFactorMantissa",
        type: "uint256"
      }
    ],
    name: "NewCloseFactor",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldCollateralFactorMantissa",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newCollateralFactorMantissa",
        type: "uint256"
      }
    ],
    name: "NewCollateralFactor",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldLiquidationIncentiveMantissa",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newLiquidationIncentiveMantissa",
        type: "uint256"
      }
    ],
    name: "NewLiquidationIncentive",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldPauseGuardian",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "newPauseGuardian",
        type: "address"
      }
    ],
    name: "NewPauseGuardian",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract PriceOracle",
        name: "oldPriceOracle",
        type: "address"
      },
      {
        indexed: false,
        internalType: "contract PriceOracle",
        name: "newPriceOracle",
        type: "address"
      }
    ],
    name: "NewPriceOracle",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldRewardDistributor",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "newRewardDistributor",
        type: "address"
      }
    ],
    name: "NewRewardDistributor",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newSupplyCap",
        type: "uint256"
      }
    ],
    name: "NewSupplyCap",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldSupplyCapGuardian",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "newSupplyCapGuardian",
        type: "address"
      }
    ],
    name: "NewSupplyCapGuardian",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "contract Unitroller",
        name: "unitroller",
        type: "address"
      }
    ],
    name: "_become",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newBorrowCapGuardian",
        type: "address"
      }
    ],
    name: "_setBorrowCapGuardian",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "bool",
        name: "state",
        type: "bool"
      }
    ],
    name: "_setBorrowPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newCloseFactorMantissa",
        type: "uint256"
      }
    ],
    name: "_setCloseFactor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "newCollateralFactorMantissa",
        type: "uint256"
      }
    ],
    name: "_setCollateralFactor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newLiquidationIncentiveMantissa",
        type: "uint256"
      }
    ],
    name: "_setLiquidationIncentive",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract CToken[]",
        name: "cTokens",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "newBorrowCaps",
        type: "uint256[]"
      }
    ],
    name: "_setMarketBorrowCaps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract CToken[]",
        name: "cTokens",
        type: "address[]"
      },
      {
        internalType: "uint256[]",
        name: "newSupplyCaps",
        type: "uint256[]"
      }
    ],
    name: "_setMarketSupplyCaps",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "bool",
        name: "state",
        type: "bool"
      }
    ],
    name: "_setMintPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newPauseGuardian",
        type: "address"
      }
    ],
    name: "_setPauseGuardian",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract PriceOracle",
        name: "newOracle",
        type: "address"
      }
    ],
    name: "_setPriceOracle",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newRewardDistributor",
        type: "address"
      }
    ],
    name: "_setRewardDistributor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "state",
        type: "bool"
      }
    ],
    name: "_setSeizePaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newSupplyCapGuardian",
        type: "address"
      }
    ],
    name: "_setSupplyCapGuardian",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "state",
        type: "bool"
      }
    ],
    name: "_setTransferPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      }
    ],
    name: "_supportMarket",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "accountAssets",
    outputs: [
      {
        internalType: "contract CToken",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "allMarkets",
    outputs: [
      {
        internalType: "contract CToken",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "borrowAmount",
        type: "uint256"
      }
    ],
    name: "borrowAllowed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "borrowCapGuardian",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "borrowCaps",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "borrowGuardianPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "borrowAmount",
        type: "uint256"
      }
    ],
    name: "borrowVerify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      }
    ],
    name: "checkMembership",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "holder",
        type: "address"
      },
      {
        internalType: "contract CToken[]",
        name: "cTokens",
        type: "address[]"
      }
    ],
    name: "claimComp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "holders",
        type: "address[]"
      },
      {
        internalType: "contract CToken[]",
        name: "cTokens",
        type: "address[]"
      },
      {
        internalType: "bool",
        name: "borrowers",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "suppliers",
        type: "bool"
      }
    ],
    name: "claimComp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "holder",
        type: "address"
      }
    ],
    name: "claimComp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "closeFactorMantissa",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "comptrollerImplementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "cTokens",
        type: "address[]"
      }
    ],
    name: "enterMarkets",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cTokenAddress",
        type: "address"
      }
    ],
    name: "exitMarket",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "getAccountLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getAllMarkets",
    outputs: [
      {
        internalType: "contract CToken[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "getAssetsIn",
    outputs: [
      {
        internalType: "contract CToken[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getBlockNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "address",
        name: "cTokenModify",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "redeemTokens",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "borrowAmount",
        type: "uint256"
      }
    ],
    name: "getHypotheticalAccountLiquidity",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "isComptroller",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      }
    ],
    name: "isDeprecated",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cTokenBorrowed",
        type: "address"
      },
      {
        internalType: "address",
        name: "cTokenCollateral",
        type: "address"
      },
      {
        internalType: "address",
        name: "liquidator",
        type: "address"
      },
      {
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256"
      }
    ],
    name: "liquidateBorrowAllowed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cTokenBorrowed",
        type: "address"
      },
      {
        internalType: "address",
        name: "cTokenCollateral",
        type: "address"
      },
      {
        internalType: "address",
        name: "liquidator",
        type: "address"
      },
      {
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "actualRepayAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "seizeTokens",
        type: "uint256"
      }
    ],
    name: "liquidateBorrowVerify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cTokenBorrowed",
        type: "address"
      },
      {
        internalType: "address",
        name: "cTokenCollateral",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "actualRepayAmount",
        type: "uint256"
      }
    ],
    name: "liquidateCalculateSeizeTokens",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "liquidationIncentiveMantissa",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "markets",
    outputs: [
      {
        internalType: "bool",
        name: "isListed",
        type: "bool"
      },
      {
        internalType: "uint256",
        name: "collateralFactorMantissa",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "isComped",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "minter",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "mintAmount",
        type: "uint256"
      }
    ],
    name: "mintAllowed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "mintGuardianPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "minter",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "actualMintAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "mintTokens",
        type: "uint256"
      }
    ],
    name: "mintVerify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "oracle",
    outputs: [
      {
        internalType: "contract PriceOracle",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pauseGuardian",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pendingAdmin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pendingComptrollerImplementation",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "redeemer",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "redeemTokens",
        type: "uint256"
      }
    ],
    name: "redeemAllowed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "redeemer",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "redeemAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "redeemTokens",
        type: "uint256"
      }
    ],
    name: "redeemVerify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "payer",
        type: "address"
      },
      {
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256"
      }
    ],
    name: "repayBorrowAllowed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "payer",
        type: "address"
      },
      {
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "actualRepayAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "borrowerIndex",
        type: "uint256"
      }
    ],
    name: "repayBorrowVerify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "rewardDistributor",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cTokenCollateral",
        type: "address"
      },
      {
        internalType: "address",
        name: "cTokenBorrowed",
        type: "address"
      },
      {
        internalType: "address",
        name: "liquidator",
        type: "address"
      },
      {
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "seizeTokens",
        type: "uint256"
      }
    ],
    name: "seizeAllowed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "seizeGuardianPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cTokenCollateral",
        type: "address"
      },
      {
        internalType: "address",
        name: "cTokenBorrowed",
        type: "address"
      },
      {
        internalType: "address",
        name: "liquidator",
        type: "address"
      },
      {
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "seizeTokens",
        type: "uint256"
      }
    ],
    name: "seizeVerify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "supplyCapGuardian",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "supplyCaps",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "src",
        type: "address"
      },
      {
        internalType: "address",
        name: "dst",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "transferTokens",
        type: "uint256"
      }
    ],
    name: "transferAllowed",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "transferGuardianPaused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "cToken",
        type: "address"
      },
      {
        internalType: "address",
        name: "src",
        type: "address"
      },
      {
        internalType: "address",
        name: "dst",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "transferTokens",
        type: "uint256"
      }
    ],
    name: "transferVerify",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// src/abis/c-token.json
var c_token_default = [
  {
    inputs: [],
    name: "AcceptAdminPendingAdminCheck",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "actualAddAmount",
        type: "uint256"
      }
    ],
    name: "AddReservesFactorFreshCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "BorrowCashNotAvailable",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256"
      }
    ],
    name: "BorrowComptrollerRejection",
    type: "error"
  },
  {
    inputs: [],
    name: "BorrowFreshnessCheck",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256"
      }
    ],
    name: "LiquidateAccrueBorrowInterestFailed",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256"
      }
    ],
    name: "LiquidateAccrueCollateralInterestFailed",
    type: "error"
  },
  {
    inputs: [],
    name: "LiquidateCloseAmountIsUintMax",
    type: "error"
  },
  {
    inputs: [],
    name: "LiquidateCloseAmountIsZero",
    type: "error"
  },
  {
    inputs: [],
    name: "LiquidateCollateralFreshnessCheck",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256"
      }
    ],
    name: "LiquidateComptrollerRejection",
    type: "error"
  },
  {
    inputs: [],
    name: "LiquidateFreshnessCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "LiquidateLiquidatorIsBorrower",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256"
      }
    ],
    name: "LiquidateRepayBorrowFreshFailed",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256"
      }
    ],
    name: "LiquidateSeizeComptrollerRejection",
    type: "error"
  },
  {
    inputs: [],
    name: "LiquidateSeizeLiquidatorIsBorrower",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256"
      }
    ],
    name: "MintComptrollerRejection",
    type: "error"
  },
  {
    inputs: [],
    name: "MintFreshnessCheck",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256"
      }
    ],
    name: "RedeemComptrollerRejection",
    type: "error"
  },
  {
    inputs: [],
    name: "RedeemFreshnessCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "RedeemTransferOutNotPossible",
    type: "error"
  },
  {
    inputs: [],
    name: "ReduceReservesAdminCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "ReduceReservesCashNotAvailable",
    type: "error"
  },
  {
    inputs: [],
    name: "ReduceReservesCashValidation",
    type: "error"
  },
  {
    inputs: [],
    name: "ReduceReservesFreshCheck",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256"
      }
    ],
    name: "RepayBorrowComptrollerRejection",
    type: "error"
  },
  {
    inputs: [],
    name: "RepayBorrowFreshnessCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "SetComptrollerOwnerCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "SetInterestRateModelFreshCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "SetInterestRateModelOwnerCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "SetPendingAdminOwnerCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "SetReserveFactorAdminCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "SetReserveFactorBoundsCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "SetReserveFactorFreshCheck",
    type: "error"
  },
  {
    inputs: [],
    name: "SetReserveGuardianOwnerCheck",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256"
      }
    ],
    name: "TransferComptrollerRejection",
    type: "error"
  },
  {
    inputs: [],
    name: "TransferNotAllowed",
    type: "error"
  },
  {
    inputs: [],
    name: "TransferNotEnough",
    type: "error"
  },
  {
    inputs: [],
    name: "TransferTooMuch",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "cashPrior",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "interestAccumulated",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "borrowIndex",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalBorrows",
        type: "uint256"
      }
    ],
    name: "AccrueInterest",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "borrowAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "accountBorrows",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalBorrows",
        type: "uint256"
      }
    ],
    name: "Borrow",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8"
      }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "liquidator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "cTokenCollateral",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "seizeTokens",
        type: "uint256"
      }
    ],
    name: "LiquidateBorrow",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "minter",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mintAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "mintTokens",
        type: "uint256"
      }
    ],
    name: "Mint",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldAdmin",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address"
      }
    ],
    name: "NewAdmin",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract ComptrollerInterface",
        name: "oldComptroller",
        type: "address"
      },
      {
        indexed: false,
        internalType: "contract ComptrollerInterface",
        name: "newComptroller",
        type: "address"
      }
    ],
    name: "NewComptroller",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract InterestRateModel",
        name: "oldInterestRateModel",
        type: "address"
      },
      {
        indexed: false,
        internalType: "contract InterestRateModel",
        name: "newInterestRateModel",
        type: "address"
      }
    ],
    name: "NewMarketInterestRateModel",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldPendingAdmin",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "newPendingAdmin",
        type: "address"
      }
    ],
    name: "NewPendingAdmin",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldReserveFactorMantissa",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newReserveFactorMantissa",
        type: "uint256"
      }
    ],
    name: "NewReserveFactor",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldReserveGuardian",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "newReserveGuardian",
        type: "address"
      }
    ],
    name: "NewReserveGuardian",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "redeemer",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "redeemAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "redeemTokens",
        type: "uint256"
      }
    ],
    name: "Redeem",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "payer",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "accountBorrows",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalBorrows",
        type: "uint256"
      }
    ],
    name: "RepayBorrow",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "benefactor",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "addAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newTotalReserves",
        type: "uint256"
      }
    ],
    name: "ReservesAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reduceAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newTotalReserves",
        type: "uint256"
      }
    ],
    name: "ReservesReduced",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [],
    name: "NO_ERROR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "_acceptAdmin",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "addAmount",
        type: "uint256"
      }
    ],
    name: "_addReserves",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "compLikeDelegatee",
        type: "address"
      }
    ],
    name: "_delegateCompLikeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reduceAmount",
        type: "uint256"
      }
    ],
    name: "_reduceReserves",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract ComptrollerInterface",
        name: "newComptroller",
        type: "address"
      }
    ],
    name: "_setComptroller",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract InterestRateModel",
        name: "newInterestRateModel",
        type: "address"
      }
    ],
    name: "_setInterestRateModel",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "newPendingAdmin",
        type: "address"
      }
    ],
    name: "_setPendingAdmin",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newReserveFactorMantissa",
        type: "uint256"
      }
    ],
    name: "_setReserveFactor",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "newReserveGuardian",
        type: "address"
      }
    ],
    name: "_setReserveGuardian",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "accrualBlockNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "accrueInterest",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "balanceOfUnderlying",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "borrowAmount",
        type: "uint256"
      }
    ],
    name: "borrow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "borrowBalanceCurrent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "borrowBalanceStored",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "borrowIndex",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "borrowRatePerBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "comptroller",
    outputs: [
      {
        internalType: "contract ComptrollerInterface",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "exchangeRateCurrent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "exchangeRateStored",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "getAccountSnapshot",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCash",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "underlying_",
        type: "address"
      },
      {
        internalType: "contract ComptrollerInterface",
        name: "comptroller_",
        type: "address"
      },
      {
        internalType: "contract InterestRateModel",
        name: "interestRateModel_",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "initialExchangeRateMantissa_",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "name_",
        type: "string"
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string"
      },
      {
        internalType: "uint8",
        name: "decimals_",
        type: "uint8"
      }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract ComptrollerInterface",
        name: "comptroller_",
        type: "address"
      },
      {
        internalType: "contract InterestRateModel",
        name: "interestRateModel_",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "initialExchangeRateMantissa_",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "name_",
        type: "string"
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string"
      },
      {
        internalType: "uint8",
        name: "decimals_",
        type: "uint8"
      }
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "interestRateModel",
    outputs: [
      {
        internalType: "contract InterestRateModel",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "isCToken",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256"
      },
      {
        internalType: "contract CTokenInterface",
        name: "cTokenCollateral",
        type: "address"
      }
    ],
    name: "liquidateBorrow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "mintAmount",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pendingAdmin",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "protocolSeizeShareMantissa",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "underlying_",
        type: "address"
      },
      {
        internalType: "contract ComptrollerInterface",
        name: "comptroller_",
        type: "address"
      },
      {
        internalType: "contract InterestRateModel",
        name: "interestRateModel_",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "initialExchangeRateMantissa_",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "name_",
        type: "string"
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string"
      },
      {
        internalType: "uint8",
        name: "decimals_",
        type: "uint8"
      },
      {
        internalType: "address payable",
        name: "admin_",
        type: "address"
      }
    ],
    name: "proxyInitialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "redeemTokens",
        type: "uint256"
      }
    ],
    name: "redeem",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "redeemAmount",
        type: "uint256"
      }
    ],
    name: "redeemUnderlying",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256"
      }
    ],
    name: "repayBorrow",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256"
      }
    ],
    name: "repayBorrowBehalf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "reserveFactorMantissa",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "reserveGuardian",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "liquidator",
        type: "address"
      },
      {
        internalType: "address",
        name: "borrower",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "seizeTokens",
        type: "uint256"
      }
    ],
    name: "seize",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "supplyRatePerBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract EIP20NonStandardInterface",
        name: "token",
        type: "address"
      }
    ],
    name: "sweepToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalBorrows",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalBorrowsCurrent",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "totalReserves",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dst",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "src",
        type: "address"
      },
      {
        internalType: "address",
        name: "dst",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "underlying",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// src/abis/oracle.json
var oracle_default = [
  {
    inputs: [
      {
        internalType: "string[]",
        name: "symbols_",
        type: "string[]"
      },
      {
        internalType: "bytes32[]",
        name: "priceIds_",
        type: "bytes32[]"
      },
      {
        internalType: "uint256[]",
        name: "baseUnits_",
        type: "uint256[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    name: "baseUnits",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      }
    ],
    name: "getPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract CToken",
        name: "cToken",
        type: "address"
      }
    ],
    name: "getUnderlyingPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "isPriceOracle",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    name: "priceIds",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pyth",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
];

// src/config/constants.ts
var comptrollerAddress = "0x1b4d3b0421dDc1eB216D230Bc01527422Fb93103";

// src/classes/lending.ts
var Lending = class {
  constructor(userAddress) {
    this.marketAddresses = [];
    this.markets = [];
    this.oracleAddress = null;
    this.underlyingAddresses = /* @__PURE__ */ new Map();
    this.enteredMarkets = /* @__PURE__ */ new Set();
    this.userAddress = userAddress;
    this.publicClient = createPublicClient({
      chain: linea,
      transport: http("https://rpc.linea.build")
    });
  }
  async initialize() {
    const [marketsResult, oracleResult, enteredMarketsResult] = await multicall(
      this.publicClient,
      {
        contracts: [
          {
            address: comptrollerAddress,
            abi: comptroller_default,
            functionName: "getAllMarkets"
          },
          {
            address: comptrollerAddress,
            abi: comptroller_default,
            functionName: "oracle"
          },
          {
            address: comptrollerAddress,
            abi: comptroller_default,
            functionName: "getAssetsIn",
            args: [this.userAddress]
          }
        ]
      }
    );
    const marketAddresses = marketsResult.result;
    const oracleAddress = oracleResult.result;
    const enteredMarkets = new Set(enteredMarketsResult.result);
    const marketsChanged = marketAddresses.length !== this.marketAddresses.length || !marketAddresses.every(
      (address) => this.marketAddresses.includes(address)
    );
    const oracleChanged = oracleAddress !== this.oracleAddress;
    const enteredMarketsChanged = enteredMarkets.size !== this.enteredMarkets.size;
    if (marketsChanged) {
      this.marketAddresses = marketAddresses;
      await this.fetchUnderlyingAddresses();
    }
    if (oracleChanged) {
      this.oracleAddress = oracleAddress;
    }
    if (enteredMarketsChanged) {
      this.enteredMarkets = enteredMarkets;
    }
    await this.fetchMarketData(this.userAddress);
  }
  async fetchUnderlyingAddresses() {
    const underlyingCalls = this.marketAddresses.map((market) => ({
      address: market,
      abi: c_token_default,
      functionName: "underlying"
    }));
    const results = await multicall(this.publicClient, {
      contracts: underlyingCalls
    });
    results.forEach((result, index) => {
      if (result.status === "success") {
        this.underlyingAddresses.set(
          this.marketAddresses[index],
          result.result
        );
      }
    });
  }
  async fetchMarketData(userAddress) {
    const calls = this.marketAddresses.flatMap((market) => [
      {
        address: market,
        abi: c_token_default,
        functionName: "getAccountSnapshot",
        args: [userAddress]
      },
      {
        address: comptrollerAddress,
        abi: comptroller_default,
        functionName: "markets",
        args: [market]
      },
      {
        address: this.oracleAddress,
        abi: oracle_default,
        functionName: "getUnderlyingPrice",
        args: [market]
      }
    ]);
    const results = await multicall(this.publicClient, { contracts: calls });
    this.markets = this.marketAddresses.map((marketAddress, index) => {
      const snapshotResult = results[index * 3];
      const marketResult = results[index * 3 + 1];
      const priceResult = results[index * 3 + 2];
      if (snapshotResult?.status === "success" && marketResult?.status === "success" && priceResult?.status === "success") {
        const [, cTokenBalance, borrowBalance, exchangeRate] = snapshotResult.result;
        const [, collateralFactorMantissa] = marketResult.result;
        const price = priceResult.result;
        const supplyBalance = cTokenBalance * exchangeRate / BigInt(1e19);
        return {
          address: marketAddress,
          cTokenBalance,
          supplyBalance,
          borrowBalance,
          exchangeRate,
          collateralFactor: collateralFactorMantissa,
          price,
          isCollateral: this.enteredMarkets.has(marketAddress)
        };
      }
      return null;
    }).filter((market) => market !== null);
  }
  calculateBorrowLimitUsed() {
    let totalBorrowLimit = BigInt(0);
    let totalBorrowBalance = BigInt(0);
    this.markets.forEach((market) => {
      const supplyBalanceUSD = market.supplyBalance * market.price / BigInt(1e18);
      const borrowBalanceUSD = market.borrowBalance * market.price / BigInt(1e18);
      if (market.isCollateral) {
        totalBorrowLimit += supplyBalanceUSD * market.collateralFactor / BigInt(1e18);
      }
      totalBorrowBalance += borrowBalanceUSD;
    });
    if (totalBorrowLimit === BigInt(0)) {
      return BigInt(0);
    }
    const scaleFactor = BigInt(1e4);
    const borrowLimitUsedScaled = totalBorrowBalance * scaleFactor * BigInt(100) / totalBorrowLimit;
    return borrowLimitUsedScaled;
  }
  getBorrowLimitUsedPercentage() {
    const borrowLimitUsedScaled = this.calculateBorrowLimitUsed();
    return Number(borrowLimitUsedScaled) / 1e5;
  }
};
export {
  Lending
};
