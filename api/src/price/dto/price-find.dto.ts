import { IsEnum } from 'class-validator';
import { PriceMarketPair } from 'src/price/types';

export class PriceFindDto {
  @IsEnum(PriceMarketPair)
  marketPair: PriceMarketPair;
}
