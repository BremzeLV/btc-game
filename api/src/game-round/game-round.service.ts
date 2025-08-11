import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { GameRound, GameRoundPrediction, GameRoundResult } from './types';
import { GameRoundEntity } from './entities/game-round.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { GameRoundCreateDto } from './dto/game-round-create.dto';
import { InjectQueue } from '@nestjs/bullmq';
import {
  JobDataName,
  JobDataType,
  QueueJobName,
  QueueName,
} from 'src/queue/types';
import { Queue } from 'bullmq';
import { GameService } from 'src/game/game.service';
import { PriceService } from 'src/price/price.service';
import Big from 'big.js';
import { WebsocketsService } from 'src/websockets/websockets.service';
import { User } from 'src/user/types';
import { AllConfigType } from 'src/config/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GameRoundService {
  private roundLength: number;

  constructor(
    @InjectRepository(GameRoundEntity)
    private readonly gameRoundRepository: Repository<GameRoundEntity>,
    @InjectQueue(QueueName.GameQueue)
    private readonly gameQueue: Queue<JobDataType, void, JobDataName>,
    private readonly gameService: GameService,
    private readonly priceService: PriceService,
    private readonly websocketsService: WebsocketsService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    this.roundLength = this.configService.getOrThrow(
      'app.gameRoundLenghtMiliseconds',
      { infer: true },
    );
  }

  async create(dto: GameRoundCreateDto, user: User): Promise<GameRound> {
    const roundStartAt = new Date();
    const roundEndAt = new Date(roundStartAt.getTime() + this.roundLength);

    const game = await this.gameService.findOrStartNewGame(dto, user);

    const existingGameRound = await this.findOne({
      where: {
        gameId: game.id,
        result: GameRoundResult.WAITING,
        userId: user.uuid,
      },
    });

    if (existingGameRound) {
      throw new UnprocessableEntityException(
        'Cannot start another round before last one resolves',
      );
    }

    const gameRound = await this.gameRoundRepository.save(
      this.gameRoundRepository.create({
        gameId: game.id,
        userId: user.uuid,
        prediction: dto.prediction,
        roundStartAt: roundStartAt.toISOString(),
        roundEndAt: roundEndAt.toISOString(),
      }),
    );

    await this.gameQueue.add(QueueJobName.OneMinuteGame, gameRound, {
      delay: this.roundLength,
    });

    return gameRound;
  }

  async find(options: FindManyOptions<GameRound>): Promise<GameRound[]> {
    return this.gameRoundRepository.find(options);
  }

  async findOne(
    options: FindManyOptions<GameRound>,
  ): Promise<GameRound | null> {
    return this.gameRoundRepository.findOne(options);
  }

  async update(
    id: GameRound['id'],
    dto: Partial<GameRound>,
  ): Promise<GameRound | null> {
    await this.gameRoundRepository.update(id, dto);
    return this.findOne({ where: { id } });
  }

  async resolveRound(gameRound: GameRound): Promise<void> {
    const roundTimeDelta =
      new Date(gameRound.roundEndAt).getTime() -
      new Date(gameRound.roundStartAt).getTime();

    const roundStartAtMinusDelta = new Date(
      new Date(gameRound.roundStartAt).getTime() - roundTimeDelta,
    ).toISOString();
    const roundEndAtMinusDelta = new Date(
      new Date(gameRound.roundEndAt).getTime() - roundTimeDelta,
    ).toISOString();

     const game = await this.gameService.findOne({
       where: { id: gameRound.gameId },
     });

     if (!game) {
       throw new NotFoundException(
         `Cannot find the game with id: ${gameRound.gameId}`,
       );
     }

    const [startPrice, endPrice] = await Promise.all([
      this.priceService.findOne({
        where: {
          marketPair: game.marketPair,
          priceAt: Between(roundStartAtMinusDelta, gameRound.roundStartAt),
        },
        order: {
          priceAt: 'DESC',
        },
      }),
      this.priceService.findOne({
        where: {
          marketPair: game.marketPair,
          priceAt: Between(roundEndAtMinusDelta, gameRound.roundEndAt),
        },
        order: {
          priceAt: 'DESC',
        },
      }),
    ]);

    if (!startPrice || !endPrice) {
      throw new NotFoundException({
        message: 'Can not find price for the game round',
        context: {
          gameRound,
          startPrice,
          endPrice,
        },
      });
    }

    let isRoundWon = false;
    switch (gameRound.prediction) {
      case GameRoundPrediction.UP:
        isRoundWon = Big(startPrice.price).lt(endPrice.price);
        break;
      case GameRoundPrediction.DOWN:
        isRoundWon = Big(startPrice.price).gt(endPrice.price);
        break;
    }

    const [updatedGame, updatedGameRound] = await Promise.all([
      this.gameService.update(gameRound.gameId, {
        points: isRoundWon ? game.points + 1 : Math.max(0, game.points - 1),
      }),
      this.update(gameRound.id, {
        result: isRoundWon ? GameRoundResult.WON : GameRoundResult.LOST,
      }),
    ]);

    this.websocketsService.broadcastGameRoundEnd({
      game: updatedGame!,
      gameRound: updatedGameRound!,
      startPrice: startPrice.price,
      endPrice: endPrice.price,
    });
  }

  async cancelRound(gameRound: GameRound): Promise<void> {
    const canceledGameRound = await this.update(gameRound.id, {
      result: GameRoundResult.CANCELLED,
    });

    this.websocketsService.broadcastGameRoundCancel({
      gameRound: canceledGameRound!,
    });
  }
}
