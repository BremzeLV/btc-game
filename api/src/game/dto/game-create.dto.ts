import { IsEnum, IsUUID } from 'class-validator';
import { PriceMarketPair } from 'src/price/types';

export class GameCreateDto {
  @IsEnum(PriceMarketPair)
  marketPair: PriceMarketPair;
}
