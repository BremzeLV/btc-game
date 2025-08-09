import { PriceMarketPair } from "src/price/types";

export type BinanceModuleOptions = {
    wsUrl: string;
    marketPair: PriceMarketPair;
}

export const WS_URL_BINDING_KEY = 'WS_URL';
export const MARKET_PAIR_BINDING_KEY = 'MARKET_PAIR';

export type BinanceTickerWsMessage = {
    /**  event timestamp */
    E: number;
    /** most recent closing price */
    c: string;
    [key: string]: string | number;
};