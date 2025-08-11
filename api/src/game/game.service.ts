import { Injectable } from '@nestjs/common';

import { Game, GameStatus } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { GameEntity } from './entities/game.entity';
import { GameCreateDto } from './dto/game-create.dto';
import { GameFindDto } from './dto/game-find.dto';
import { User } from 'src/user/types';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
  ) {}

  async create(dto: Partial<Game>): Promise<Game> {
    return this.gameRepository.save(this.gameRepository.create(dto));
  }

  async update(id: Game['id'], dto: Partial<Game>): Promise<Game | null> {
    await this.gameRepository.update(id, dto);
    return this.findOne({ where: { id } });
  }

  async find(options: FindManyOptions<Game>): Promise<Game[]> {
    return this.gameRepository.find(options);
  }

  async findOne(options: FindManyOptions<Game>): Promise<Game | null> {
    return this.gameRepository.findOne(options);
  }

  async startNew(dto: GameCreateDto, user: User): Promise<Game> {
    const activeGame = await this.findOne({
      where: {
        status: GameStatus.ONGOING,
        marketPair: dto.marketPair,
        userId: user.uuid,
      },
    });

    if (activeGame) {
      await this.update(activeGame.id, { status: GameStatus.CONCLUDED });
    }

    return await this.create({ marketPair: dto.marketPair, userId: user.uuid });
  }

  async findOrStartNewGame(dto: GameFindDto, user: User): Promise<Game> {
    let game = await this.findOne({
      where: {
        status: GameStatus.ONGOING,
        marketPair: dto.marketPair,
        userId: user.uuid,
      },
    });

    if (!game) {
      game = await this.create({
        marketPair: dto.marketPair,
        userId: user.uuid,
      });
    }

    return game;
  }
}
