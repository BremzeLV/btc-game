import { GameRound } from "src/game-round/types";

export enum QueueName { 
    GameQueue = 'gameQueue',
}

export enum QueueJobName { 
    OneMinuteGame = 'oneMinuteGame',
}

export type JobDataType = GameRound & {
  roundStartAt: string;
  roundEndAt: string;
};
export type JobDataName = QueueJobName;