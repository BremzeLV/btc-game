import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from '../game.controller';
import { GameService } from '../game.service';
import { GameFindDto } from '../dto/game-find.dto';
import { PriceMarketPair } from '../../price/types';
import { User } from '../../user/types';
import { Game, GameStatus } from '../types';
import { GameRoundService } from 'src/game-round/game-round.service';
import { GameRoundResult } from 'src/game-round/types';

describe('GameController', () => {
  let gameController: GameController;
  let gameService: Partial<GameService>;
  let gameRoundService: Partial<GameRoundService>;

  beforeEach(async () => {
    gameService = {
      findOrStartNewGame: jest.fn(),
    };
    gameRoundService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        { provide: GameService, useValue: gameService },
        { provide: GameRoundService, useValue: gameRoundService },
      ],
    }).compile();

    gameController = module.get<GameController>(GameController);
  });

  describe('findOrStartNewGame', () => {
    const query: GameFindDto = {
      marketPair: PriceMarketPair.BTCUSD,
    };
    const user: User = { id: 1, uuid: 'user-123' };

    const game = {
      id: 1,
      points: 1337,
      userId: user.uuid,
      status: GameStatus.ONGOING,
    } as Game;

    const gameRound = {
      id: 1,
      result: GameRoundResult.WAITING,
      userId: user.uuid,
    };

    
    beforeEach(() => {
      (gameService.findOrStartNewGame as jest.Mock).mockResolvedValue(game);
      (gameRoundService.findOne as jest.Mock).mockResolvedValue(gameRound);
    });
    it('should return game and waitingGameRound', async () => {
      const result = await gameController.findOrStartNewGame(
        query,
        user,
      );

      expect(gameService.findOrStartNewGame).toHaveBeenCalledWith(
        query,
        user,
      );

      expect(gameRoundService.findOne).toHaveBeenCalledWith({
        where: {
          gameId: game.id,
          result: GameRoundResult.WAITING,
          userId: user.uuid,
        },
      });

      expect(result).toEqual({
        game: game,
        waitingGameRound: gameRound,
      });
    });
  });
});
