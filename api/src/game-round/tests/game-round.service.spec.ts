import { Test, TestingModule } from '@nestjs/testing';
import { GameRoundService } from 'src/game-round/game-round.service';
import { Repository } from 'typeorm';
import { GameRoundEntity } from '../entities/game-round.entity';
import { GameService } from 'src/game/game.service';
import { Queue } from 'bullmq';
import { JobDataName, JobDataType, QueueName } from 'src/queue/types';
import { PriceService } from 'src/price/price.service';
import { ConfigService } from '@nestjs/config';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getQueueToken } from '@nestjs/bullmq';
import { GameRound, GameRoundPrediction, GameRoundResult } from '../types';
import { Game, GameStatus } from 'src/game/types';
import { Price, PriceMarketPair } from 'src/price/types';

describe('GameRoundService', () => {
  let gameRoundService: GameRoundService;
  let gameRoundRepository: jest.Mocked<Partial<Repository<GameRoundEntity>>>;
  let gameService: Partial<GameService>;
  let websocketsService: Partial<WebsocketsService>;
  let priceService: Partial<PriceService>;

  beforeEach(async () => {
    gameRoundRepository = {
      find: jest.fn(),
      update: jest.fn(),
      findOne: jest.fn(),
    };

    gameService = {
      findOne: jest.fn(),
      update: jest.fn(),
    };

    websocketsService = {
      broadcastGameRoundEnd: jest.fn(),
    };

    priceService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameRoundService,
        {
          provide: getRepositoryToken(GameRoundEntity),
          useValue: gameRoundRepository,
        },
        { provide: GameService, useValue: gameService },
        {
          provide: getQueueToken(QueueName.GameQueue),
          useValue: {} as Partial<Queue<JobDataType, void, JobDataName>>,
        },
        { provide: PriceService, useValue: priceService },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(5000),
          },
        },
        { provide: WebsocketsService, useValue: websocketsService },
      ],
    }).compile();

    gameRoundService = module.get<GameRoundService>(GameRoundService);
  });

  describe('find', () => {
    it('should return game round', async () => {
      const options = { where: { id: 1 } };

      await gameRoundService.find(options);

      expect(gameRoundRepository.find).toHaveBeenCalledWith(options);
    });
  });

  describe('resolveRound', () => {
    const currentDateTime = new Date().toISOString();
    const roundStartAt = new Date(
      new Date(currentDateTime).getTime() - 60000,
    ).toISOString();

    const gameRound: GameRound = {
      id: 1,
      gameId: 1337,
      userId: 'user-123',
      prediction: GameRoundPrediction.UP,
      result: GameRoundResult.WAITING,
      roundStartAt,
      roundEndAt: currentDateTime,
      createdAt: currentDateTime,
      updatedAt: currentDateTime,
      deletedAt: currentDateTime,
    };

    const game: Partial<Game> = {
      id: 1337,
      userId: 'user-123',
      points: 10,
      status: GameStatus.ONGOING,
      marketPair: PriceMarketPair.BTCUSD,
    };

    const startPrice: Partial<Price> = { price: '10' };
    const endPrice: Partial<Price> = { price: '15' };

    beforeEach(() => {
      (gameService.findOne as jest.Mock).mockResolvedValue(game);
      (priceService.findOne as jest.Mock)
        .mockResolvedValueOnce(startPrice)
        .mockResolvedValueOnce(endPrice);
    });

    it('should win the game round when price predicted to go up', async () => {
      await gameRoundService.resolveRound(gameRound);

      expect(gameService.update).toHaveBeenCalledWith(1337, { points: 11 });
      expect(gameRoundRepository.update).toHaveBeenCalledWith(1, {
        result: GameRoundResult.WON,
      });
      expect(websocketsService.broadcastGameRoundEnd).toHaveBeenCalled();
    });

    it('should loose the game round when price predicted to go down', async () => {
      await gameRoundService.resolveRound({
        ...gameRound,
        prediction: GameRoundPrediction.DOWN,
      });

      expect(gameService.update).toHaveBeenCalledWith(1337, { points: 9 });
      expect(gameRoundRepository.update).toHaveBeenCalledWith(1, {
        result: GameRoundResult.LOST,
      });
      expect(websocketsService.broadcastGameRoundEnd).toHaveBeenCalled();
    });

    it('should throw when no game is found', async () => {
      (gameService.findOne as jest.Mock).mockResolvedValue(null);

      expect(async () => {
         await gameRoundService.resolveRound({
          ...gameRound,
          prediction: GameRoundPrediction.DOWN,
        })
      }).rejects.toThrow('Cannot find the game with id: 1337');
    });
  });
});
