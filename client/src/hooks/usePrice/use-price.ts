import { useCallback, useEffect, useState } from "react";
import useWebSocket from "../use-websocket";
import { PriceData, PriceMarketPair, PriceResponse } from "./types";
import { axiosInstance } from "@/lib/axios-instance";

export const usePrice = () => {
	const [priceData, setPriceData] = useState<PriceData | null>(null);
	const [isPriceDataLoading, setIsPriceDataLoading] = useState(true);

	const { socketRef } = useWebSocket();

	const fetchPrice = useCallback(
		(marketPair: PriceMarketPair) => {
			axiosInstance
				.get("/price", {
					params: {
						marketPair,
					},
				})
				.then(({ data }: PriceResponse) => {
					if (isPriceDataLoading) {
						// checks if its initial price, if theres response from ws already then skip price update
						setPriceData({
							price: data.price,
							priceAt: data.priceAt,
						});

						setIsPriceDataLoading(false);
					}
				});
		},
		[isPriceDataLoading]
	);

	useEffect(() => {
		if (!socketRef.current) return;

		socketRef.current.on("priceUpdated", (price: PriceData) => {
			setPriceData({
				price: price.price,
				priceAt: price.priceAt,
			});

			if (isPriceDataLoading) {
				setIsPriceDataLoading(false);
			}
		});
	}, [isPriceDataLoading, socketRef]);

	return {
		priceData,
		isPriceDataLoading,
		fetchPrice,
	};
};
