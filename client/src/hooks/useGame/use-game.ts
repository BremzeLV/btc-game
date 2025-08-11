import { useCallback, useEffect, useMemo, useState } from "react";
import { PriceMarketPair } from "../usePrice/types";
import { FindOrStartNewGameResponse, GameRoundCancelData, GameRoundCreateResponse, GameRoundEndData, GameRoundPrediction, GameRoundResult, GameState } from "./types";
import { axiosInstance } from "@/lib/axios-instance";
import useWebSocket from "../use-websocket";

export const useGame = () => {
	const [gameState, setGameState] = useState<GameState>({
		score: 0,
		activeGameRound: null,
		lastGameRoundResult: null,
		lastGameRoundPrices: null,
	});
	const [isGameStateLoading, setIsGameStateLoading] = useState(true);
	const { socketRef, reconnect: reconnectWS } = useWebSocket();

	const fetchGame = useCallback(
		(marketPair: PriceMarketPair) => {
			axiosInstance
				.get("/game/findOrStartNewGame", { params: { marketPair } })
				.then((response: FindOrStartNewGameResponse) => {
					reconnectWS(); // reconnect to get authorized ws connection from the BE accessToken cookie
					setGameState({
						score: response.data.game.points,
						activeGameRound: response.data.waitingGameRound,
						lastGameRoundResult: null,
						lastGameRoundPrices: null,
					});
					setIsGameStateLoading(false);
				});
		},
		[reconnectWS]
	);

	const newGameRound = useCallback(
		(prediction: GameRoundPrediction, marketPair: PriceMarketPair) => {
			axiosInstance
				.post("/game-round/create", {
					prediction,
					marketPair,
				})
				.then((response: GameRoundCreateResponse) => {
					setGameState((prev: GameState) => ({
						...prev,
						activeGameRound: {
							prediction,
							marketPair,
							resolved: false,
							result: response.data.result,
							roundStartAt: response.data.roundStartAt,
							roundEndAt: response.data.roundEndAt,
						},
						lastGameRoundResult: null,
						lastGameRoundPrices: null,
					}));
				});
		},
		[]
	);

	const resetGame = useCallback(async (marketPair: PriceMarketPair) => {
		await axiosInstance
			.post("/game/start", { marketPair })
			.then(() => {
				setGameState({
					score: 0,
					activeGameRound: null,
					lastGameRoundResult: null,
					lastGameRoundPrices: null,
				});
			});
	}, []);

	const clearActiveGameRound = useCallback(() => {
		setGameState((prev) => ({
			...prev,
			activeGameRound: null,
		}));
	}, []);

	useEffect(() => {
		if (!socketRef.current) return;

		socketRef.current.on("gameRoundEnd", ({ game, gameRound, startPrice, endPrice }: GameRoundEndData) => {
			setGameState({
				score: game.points,
				activeGameRound: null,
				lastGameRoundResult: gameRound.result,
				lastGameRoundPrices: {
					startPrice,
					endPrice,
				}
			});
		});

		socketRef.current.on("gameRoundCancel", ({ gameRound }: GameRoundCancelData) => {
			setGameState((prev) => ({
				...prev,
				activeGameRound: null,
				lastGameRoundResult: gameRound.result,
				lastGameRoundPrices: null,
			}));
		});
	}, [socketRef]);

	const canMakePrediction = useMemo(() => {
		return !gameState.activeGameRound || gameState.activeGameRound.resolved;
	}, [gameState.activeGameRound]);

	const roundTimeRemaining = useMemo(() => {
		if (!gameState.activeGameRound || gameState.activeGameRound.resolved)
			return 0;

		const elapsed =
			Date.now() - new Date(gameState.activeGameRound.roundStartAt).getTime();

		const roundLength =
			new Date(gameState.activeGameRound.roundEndAt).getTime() -
			new Date(gameState.activeGameRound.roundStartAt).getTime();

		const remaining = Math.max(0, roundLength - elapsed);

		return remaining;
	}, [gameState.activeGameRound]);

	return {
		clearActiveGameRound,
		newGameRound,
		fetchGame,
		resetGame,
		gameState,
		canMakePrediction,
		roundTimeRemaining,
		isGameStateLoading,
	};
};
