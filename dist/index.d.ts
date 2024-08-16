import { ethers } from 'ethers';

declare class Lending {
    marketAddresses: string[];
    markets: Market[];
    oracleAddress: string | null;
    underlyingAddresses: Map<string, string>;
    userAddress: string | null;
    enteredMarkets: Set<string>;
    provider: ethers.JsonRpcProvider;
    constructor();
    initialize(userAddress: string): Promise<void>;
    private fetchUnderlyingAddresses;
    private fetchMarketData;
    private calculateBorrowLimitUsed;
    getBorrowLimitUsedPercentage(): number;
}
interface Market {
    address: string;
    cTokenBalance: bigint;
    supplyBalance: bigint;
    borrowBalance: bigint;
    exchangeRate: bigint;
    collateralFactor: bigint;
    price: bigint;
    isCollateral: boolean;
}

export { Lending, type Market };
