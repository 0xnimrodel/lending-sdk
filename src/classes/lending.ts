import { comptrollerAddress } from '../config/constants.js'
import { comptrollerABI, cTokenABI, oracleABI } from '../abis/index.js'
import { ethers } from 'ethers'

export class Lending {
  marketAddresses: string[] = []
  markets: Market[] = []
  oracleAddress: string | null = null
  underlyingAddresses: Map<string, string> = new Map()
  userAddress: string | null = null
  enteredMarkets: Set<string> = new Set()
  provider: ethers.JsonRpcProvider

  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://rpc.linea.build')
  }

  async initialize(userAddress: string) {
    this.userAddress = userAddress
    const comptroller = new ethers.Contract(
      comptrollerAddress,
      comptrollerABI,
      this.provider
    )

    const [marketAddressesResult, oracleAddressResult, enteredMarketsResult] =
      await Promise.all([
        comptroller.getAllMarkets(),
        comptroller.oracle(),
        comptroller.getAssetsIn(userAddress),
      ])

    const marketAddresses = marketAddressesResult as string[]
    const oracleAddress = oracleAddressResult as string
    const enteredMarkets = new Set(enteredMarketsResult as string[])

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
    try {
      const cTokenInterface = new ethers.Interface(cTokenABI)

      const underlyingPromises = this.marketAddresses.map(
        async (marketAddress) => {
          const cTokenContract = new ethers.Contract(
            marketAddress,
            cTokenInterface,
            this.provider
          )
          try {
            const underlying = await cTokenContract.underlying()
            return { marketAddress, underlying }
          } catch (error) {
            return { marketAddress, underlying: null }
          }
        }
      )

      const results = await Promise.all(underlyingPromises)

      results.forEach(({ marketAddress, underlying }) => {
        if (underlying) {
          this.underlyingAddresses.set(marketAddress, underlying)
        }
      })
    } catch (error) {
      throw error
    }
  }

  private async fetchMarketData(userAddress: string) {
    try {
      const cTokenInterface = new ethers.Interface(cTokenABI)
      const comptrollerInterface = new ethers.Interface(comptrollerABI)
      const oracleInterface = new ethers.Interface(oracleABI)

      const marketDataPromises = this.marketAddresses.map(
        async (marketAddress) => {
          const cTokenContract = new ethers.Contract(
            marketAddress,
            cTokenInterface,
            this.provider
          )
          const comptrollerContract = new ethers.Contract(
            comptrollerAddress,
            comptrollerInterface,
            this.provider
          )
          const oracleContract = new ethers.Contract(
            this.oracleAddress!,
            oracleInterface,
            this.provider
          )

          try {
            const [accountSnapshot, markets, underlyingPrice] =
              await Promise.all([
                cTokenContract.getAccountSnapshot(userAddress),
                comptrollerContract.markets(marketAddress),
                oracleContract.getUnderlyingPrice(marketAddress),
              ])

            const [, cTokenBalance, borrowBalance, exchangeRate] =
              accountSnapshot
            const [, collateralFactorMantissa] = markets
            const price = underlyingPrice

            const supplyBalance =
              (BigInt(cTokenBalance) * BigInt(exchangeRate)) /
              ethers.parseEther('1')

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
          } catch (error) {
            return null
          }
        }
      )

      const results = await Promise.all(marketDataPromises)
      this.markets = results.filter(
        (market): market is Market => market !== null
      )
    } catch (error) {
      throw error
    }
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
    return Number(borrowLimitUsedScaled) / 10000
  }
}

export interface Market {
  address: string
  cTokenBalance: bigint
  supplyBalance: bigint
  borrowBalance: bigint
  exchangeRate: bigint
  collateralFactor: bigint
  price: bigint
  isCollateral: boolean
}
