import { Address, PublicClient } from 'viem';

type Market = {
    address: Address;
    cTokenBalance: bigint;
    supplyBalance: bigint;
    borrowBalance: bigint;
    exchangeRate: bigint;
    collateralFactor: bigint;
    price: bigint;
    isCollateral: boolean;
};

declare class Lending {
    marketAddresses: Address[];
    markets: Market[];
    oracleAddress: Address | null;
    underlyingAddresses: Map<Address, Address>;
    userAddress: Address;
    enteredMarkets: Set<Address>;
    publicClient: PublicClient;
    constructor(userAddress: Address);
    initialize(): Promise<void>;
    private fetchUnderlyingAddresses;
    private fetchMarketData;
    private calculateBorrowLimitUsed;
    getBorrowLimitUsedPercentage(): number;
}

export { Lending, type Market };
