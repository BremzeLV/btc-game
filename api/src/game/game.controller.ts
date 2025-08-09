import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { FindOrStartNewGameResult, Game } from './types';
import { GameService } from './game.service';
import { GameFindDto } from './dto/game-find.dto';
import { GameCreateDto } from './dto/game-create.dto';
import { GameRoundService } from 'src/game-round/game-round.service';
import { GameRoundResult } from 'src/game-round/types';
import type { User } from 'src/user/types';
import { RequestUser } from 'src/decorators/user.decorator';

@Controller({
  path: 'game',
})
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly gameRoundService: GameRoundService,
  ) {}

  @Get('/findOrStartNewGame')
  async findOrStartNewGame(
    @Query() query: GameFindDto,
    @RequestUser() user: User,
  ): Promise<FindOrStartNewGameResult> {
    const game = await this.gameService.findOrStartNewGame(query, user);
    const waitingGameRound = await this.gameRoundService.findOne(
      {
        where: { gameId: game.id, result: GameRoundResult.WAITING, userId: user.uuid },
      },
    );

    return {
      game,
      waitingGameRound,
    };
  }

  @Post('/start')
  start(
    @Body() dto: GameCreateDto,
    @RequestUser() user: User,
  ): Promise<Game> {
    return this.gameService.startNew(dto, user);
  }
}
