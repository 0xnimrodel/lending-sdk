import { GetPublicClientReturnType } from '@wagmi/core';
import { Address } from 'viem';

declare class Lending {
    marketAddresses: Address[];
    markets: Market[];
    oracleAddress: Address | null;
    underlyingAddresses: Map<Address, Address>;
    publicClient: GetPublicClientReturnType;
    userAddress: Address | null;
    enteredMarkets: Set<Address>;
    constructor();
    initialize(userAddress: Address): Promise<void>;
    private fetchUnderlyingAddresses;
    private fetchMarketData;
    private calculateBorrowLimitUsed;
    getBorrowLimitUsedPercentage(): number;
}
interface Market {
    address: Address;
    cTokenBalance: bigint;
    supplyBalance: bigint;
    borrowBalance: bigint;
    exchangeRate: bigint;
    collateralFactor: bigint;
    price: bigint;
    isCollateral: boolean;
}

export { Lending, type Market };
