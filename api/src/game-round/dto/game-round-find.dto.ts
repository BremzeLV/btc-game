import { IsNumber } from 'class-validator';

export class GameRoundFindDto {
  @IsNumber()
  gameId: number;
}
