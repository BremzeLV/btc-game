export enum GameRoundPrediction { 
    UP = 'up',
    DOWN = 'down',
}

export enum GameRoundResult { 
    WON = 'won',
    LOST = 'lost',
    WAITING = 'waiting',
    CANCELLED = 'cancelled',
}

export interface GameRound {
    id: number;
    userId: string;
    gameId: number;
    prediction: GameRoundPrediction;
    result: GameRoundResult;
    roundStartAt: string;
    roundEndAt: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}