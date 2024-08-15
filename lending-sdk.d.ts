import { Address } from 'viem'

declare module 'lending-sdk' {
  export class Lending {
    constructor()
    initialize(userAddress: Address): Promise<void>
    getBorrowLimitUsedPercentage(): number
  }

  export interface Market {
    address: Address
    cTokenBalance: bigint
    supplyBalance: bigint
    borrowBalance: bigint
    exchangeRate: bigint
    collateralFactor: bigint
    price: bigint
    isCollateral: boolean
  }
}
