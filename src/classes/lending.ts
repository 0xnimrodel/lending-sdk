import type { Address, Abi, PublicClient } from 'viem'
import { createPublicClient, http } from 'viem'
import { multicall } from 'viem/actions'
import { linea } from 'viem/chains'

import ComptrollerABI from '../abis/comptroller.json'
import CTokenABI from '../abis/c-token.json'
import OracleABI from '../abis/oracle.json'
import { comptrollerAddress } from '../config/constants.js'
import type { Market } from '../types.js'

export class Lending {
  marketAddresses: Address[] = []

  markets: Market[] = []

  oracleAddress: Address | null = null

  underlyingAddresses: Map<Address, Address> = new Map()

  userAddress: Address

  enteredMarkets: Set<Address> = new Set()

  publicClient: PublicClient

  constructor(userAddress: Address) {
    this.userAddress = userAddress

    this.publicClient = createPublicClient({
      chain: linea,
      transport: http('https://rpc.linea.build'),
    })
  }

  async initialize() {
    const [marketsResult, oracleResult, enteredMarketsResult] = await multicall(
      this.publicClient,
      {
        contracts: [
          {
            address: comptrollerAddress as Address,
            abi: ComptrollerABI as Abi,
            functionName: 'getAllMarkets',
          },
          {
            address: comptrollerAddress as Address,
            abi: ComptrollerABI as Abi,
            functionName: 'oracle',
          },
          {
            address: comptrollerAddress as Address,
            abi: ComptrollerABI as Abi,
            functionName: 'getAssetsIn',
            args: [this.userAddress],
          },
        ],
      }
    )

    const marketAddresses = marketsResult.result as Address[]
    const oracleAddress = oracleResult.result as Address
    const enteredMarkets = new Set(enteredMarketsResult.result as Address[])

    const marketsChanged =
      marketAddresses.length !== this.marketAddresses.length ||
      !marketAddresses.every((address) =>
        this.marketAddresses.includes(address)
      )
    const oracleChanged = oracleAddress !== this.oracleAddress
    const enteredMarketsChanged =
      enteredMarkets.size !== this.enteredMarkets.size

    if (marketsChanged) {
      this.marketAddresses = marketAddresses
      await this.fetchUnderlyingAddresses()
    }

    if (oracleChanged) {
      this.oracleAddress = oracleAddress
    }

    if (enteredMarketsChanged) {
      this.enteredMarkets = enteredMarkets
    }

    await this.fetchMarketData(this.userAddress)
  }

  private async fetchUnderlyingAddresses() {
    const underlyingCalls = this.marketAddresses.map((market) => ({
      address: market,
      abi: CTokenABI as Abi,
      functionName: 'underlying',
    }))

    const results = await multicall(this.publicClient, {
      contracts: underlyingCalls,
    })

    results.forEach((result, index) => {
      if (result.status === 'success') {
        this.underlyingAddresses.set(
          this.marketAddresses[index]!,
          result.result as Address
        )
      }
    })
  }

  private async fetchMarketData(userAddress: Address) {
    const calls = this.marketAddresses.flatMap((market) => [
      {
        address: market,
        abi: CTokenABI as Abi,
        functionName: 'getAccountSnapshot',
        args: [userAddress],
      },
      {
        address: comptrollerAddress as Address,
        abi: ComptrollerABI as Abi,
        functionName: 'markets',
        args: [market],
      },
      {
        address: this.oracleAddress!,
        abi: OracleABI as Abi,
        functionName: 'getUnderlyingPrice',
        args: [market],
      },
    ])

    const results = await multicall(this.publicClient, { contracts: calls })

    this.markets = this.marketAddresses
      .map((marketAddress, index) => {
        const snapshotResult = results[index * 3]
        const marketResult = results[index * 3 + 1]
        const priceResult = results[index * 3 + 2]

        if (
          snapshotResult?.status === 'success' &&
          marketResult?.status === 'success' &&
          priceResult?.status === 'success'
        ) {
          const [, cTokenBalance, borrowBalance, exchangeRate] =
            snapshotResult.result as bigint[]
          const [, collateralFactorMantissa] = marketResult.result as [
            boolean,
            bigint,
            boolean
          ]

          const price = priceResult.result as bigint

          const supplyBalance = (cTokenBalance * exchangeRate) / BigInt(10e18)

          return {
            address: marketAddress,
            cTokenBalance,
            supplyBalance,
            borrowBalance,
            exchangeRate,
            collateralFactor: collateralFactorMantissa,
            price,
            isCollateral: this.enteredMarkets.has(marketAddress),
          }
        }
        return null
      })
      .filter((market): market is Market => market !== null)
  }

  private calculateBorrowLimitUsed(): bigint {
    let totalBorrowLimit = BigInt(0)
    let totalBorrowBalance = BigInt(0)

    this.markets.forEach((market) => {
      const supplyBalanceUSD =
        (market.supplyBalance * market.price) / BigInt(1e18)

      const borrowBalanceUSD =
        (market.borrowBalance * market.price) / BigInt(1e18)

      if (market.isCollateral) {
        totalBorrowLimit +=
          (supplyBalanceUSD * market.collateralFactor) / BigInt(1e18)
      }
      totalBorrowBalance += borrowBalanceUSD
    })

    if (totalBorrowLimit === BigInt(0)) {
      return BigInt(0)
    }
    const scaleFactor = BigInt(10000)
    const borrowLimitUsedScaled =
      (totalBorrowBalance * scaleFactor * BigInt(100)) / totalBorrowLimit
    return borrowLimitUsedScaled
  }

  getBorrowLimitUsedPercentage(): number {
    const borrowLimitUsedScaled = this.calculateBorrowLimitUsed()
    return Number(borrowLimitUsedScaled) / 100000
  }
}
