import { Abi, Address, createPublicClient, http } from 'viem'
import { comptrollerAddress } from '../config/network.js'
import { comptrollerABI, cTokenABI, oracleABI } from '../abis/index.js'
import { multicall } from 'viem/actions'
import { linea } from 'viem/chains'

export class Lending {
  marketAddresses: Address[] = []
  markets: Market[] = []
  oracleAddress: Address | null = null
  underlyingAddresses: Map<Address, Address> = new Map()
  client: any
  userAddress: Address | null = null
  enteredMarkets: Set<Address> = new Set()

  constructor() {
    this.client = createPublicClient({
      chain: linea,
      transport: http('https://rpc.linea.build'),
    })
  }

  async initialize(userAddress: Address) {
    this.userAddress = userAddress
    const [marketsResult, oracleResult, enteredMarketsResult] = await multicall(
      this.client,
      {
        contracts: [
          {
            address: comptrollerAddress as Address,
            abi: comptrollerABI as Abi,
            functionName: 'getAllMarkets',
          },
          {
            address: comptrollerAddress as Address,
            abi: comptrollerABI as Abi,
            functionName: 'oracle',
          },
          {
            address: comptrollerAddress as Address,
            abi: comptrollerABI as Abi,
            functionName: 'getAssetsIn',
            args: [userAddress],
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

    await this.fetchMarketData(userAddress)
  }

  private async fetchUnderlyingAddresses() {
    const underlyingCalls = this.marketAddresses.map((market) => ({
      address: market,
      abi: cTokenABI as Abi,
      functionName: 'underlying',
    }))

    const results = await multicall(this.client, { contracts: underlyingCalls })

    results.forEach((result, index) => {
      if (result.status === 'success') {
        this.underlyingAddresses.set(
          this.marketAddresses[index],
          result.result as Address
        )
      }
    })
  }

  private async fetchMarketData(userAddress: Address) {
    const calls = this.marketAddresses.flatMap((market) => [
      {
        address: market,
        abi: cTokenABI as Abi,
        functionName: 'getAccountSnapshot',
        args: [userAddress],
      },
      {
        address: comptrollerAddress as Address,
        abi: comptrollerABI as Abi,
        functionName: 'markets',
        args: [market],
      },
      {
        address: this.oracleAddress!,
        abi: oracleABI as Abi,
        functionName: 'getUnderlyingPrice',
        args: [market],
      },
    ])

    const results = await multicall(this.client, { contracts: calls })

    this.markets = this.marketAddresses
      .map((marketAddress, index) => {
        const snapshotResult = results[index * 3]
        const marketResult = results[index * 3 + 1]
        const priceResult = results[index * 3 + 2]

        if (
          snapshotResult.status === 'success' &&
          marketResult.status === 'success' &&
          priceResult.status === 'success'
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
