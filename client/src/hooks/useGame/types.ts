import { AxiosResponse } from "axios";
import { PriceMarketPair } from "../usePrice/types";

export enum GameRoundPrediction {
	UP = "up",
	DOWN = "down",
}

export enum GameRoundResult {
	WON = "won",
	LOST = "lost",
	WAITING = "waiting",
	CANCELLED = "cancelled",
}


export type Game = {
	points: number;
};

export type GameRound = {
	prediction: GameRoundPrediction;
	marketPair: PriceMarketPair;
	resolved: boolean;
	roundStartAt: string;
	roundEndAt: string;
	result: GameRoundResult;
};

export type FindOrStartNewGameResponse = AxiosResponse<{
	game: Game;
	waitingGameRound: GameRound;
}>;
export type GameRoundCreateResponse = AxiosResponse<GameRound>;

export type GameState = {
	score: number;
	activeGameRound: GameRound | null;
	lastGameRoundResult: GameRoundResult | null;
	lastGameRoundPrices: {
		startPrice: string;
		endPrice: string;
	} | null;
};

export type GameRoundEndData = {
	game: Game,
	gameRound: GameRound,
	startPrice: string;
	endPrice: string;
}

export type GameRoundCancelData = {
	gameRound: GameRound;
};