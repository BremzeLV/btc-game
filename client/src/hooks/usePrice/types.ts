import { AxiosResponse } from "axios";

export enum PriceMarketPair {
	BTCUSD = "btcusd",
}

export interface PriceData {
	price: string;
	priceAt: string;
}

export type PriceResponse = AxiosResponse<PriceData>;