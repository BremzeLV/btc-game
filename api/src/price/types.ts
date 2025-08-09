import { DecimalString } from "src/utils/types";

export enum PriceMarketPair { 
    BTCUSD = 'btcusd',
}

export interface Price { 
    id: number;
    price: DecimalString;
    marketPair: PriceMarketPair;
    priceAt: string;
    createdAt: string;
}