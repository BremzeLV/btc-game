import { GameRound } from "src/game-round/types";
import { PriceMarketPair } from "src/price/types";

export enum GameStatus { 
    ONGOING = 'ongoing',
    CONCLUDED = 'concluded',
}

export interface Game {
    id: number;
    userId: string;
    points: number;
    status: GameStatus;
    marketPair: PriceMarketPair,
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export type FindOrStartNewGameResult = {
    game: Game;
    waitingGameRound: GameRound | null,
}