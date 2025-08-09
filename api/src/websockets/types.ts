import { GameRound } from 'src/game-round/types';
import { Game } from 'src/game/types';

export type GameRoundEndData = {
    game: Game;
    gameRound: GameRound;
    startPrice: string;
    endPrice: string;
};

export type GameRoundCancelData = {
    gameRound: GameRound;
};