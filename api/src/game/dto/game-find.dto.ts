import { IsEnum, IsUUID } from 'class-validator';
import { PriceMarketPair } from 'src/price/types';

export class GameFindDto {
  @IsEnum(PriceMarketPair)
  marketPair: PriceMarketPair;
}
