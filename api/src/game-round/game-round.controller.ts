import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GameRoundService } from './game-round.service';
import { GameRoundCreateDto } from './dto/game-round-create.dto';
import { GameRound, GameRoundResult } from './types';
import { GameRoundFindDto } from './dto/game-round-find.dto';
import { RequestUser } from 'src/decorators/user.decorator';
import type { User } from 'src/user/types';

@Controller({
  path: 'game-round',
})
export class GameRoundController {
  constructor(private readonly gameRoundService: GameRoundService) {}

  @Get('/findWaiting')
  findWaiting(
    @Query() query: GameRoundFindDto,
    @RequestUser() user: User,
  ): Promise<GameRound | null> {
    return this.gameRoundService.findOne({
      where: {
        gameId: query.gameId,
        result: GameRoundResult.WAITING,
        userId: user.uuid,
      },
    });
  }

  @Post('/create')
  createGameRound(
    @Body() dto: GameRoundCreateDto,
    @RequestUser() user: User,
  ): Promise<GameRound> {
    return this.gameRoundService.create(dto, user);
  }
}
