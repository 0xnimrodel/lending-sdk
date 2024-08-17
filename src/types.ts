import { Address } from 'viem'

export type Market = {
  address: Address
  cTokenBalance: bigint
  supplyBalance: bigint
  borrowBalance: bigint
  exchangeRate: bigint
  collateralFactor: bigint
  price: bigint
  isCollateral: boolean
}
