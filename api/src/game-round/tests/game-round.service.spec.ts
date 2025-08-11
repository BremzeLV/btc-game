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

describe('GameRoundService', () => {
  let gameRoundService: GameRoundService;
  let gameRoundRepository: jest.Mocked<Partial<Repository<GameRoundEntity>>>;

  beforeEach(async () => {
    gameRoundRepository = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameRoundService,
        {
          provide: getRepositoryToken(GameRoundEntity),
          useValue: gameRoundRepository,
        },
        { provide: GameService, useValue: { findOne: jest.fn() } },
        {
          provide: getQueueToken(QueueName.GameQueue),
          useValue: {} as Partial<Queue<JobDataType, void, JobDataName>>,
        },
        { provide: PriceService, useValue: {} },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockReturnValue(5000),
          },
        },
        { provide: WebsocketsService, useValue: {} },
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
});
