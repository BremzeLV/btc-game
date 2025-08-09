import { IsDate, IsEnum, IsString } from "class-validator";
import { PriceMarketPair } from "../types";
import type { DecimalString } from "src/utils/types";

export class PriceCreateDto { 
  @IsString()
  price: DecimalString;
  
  @IsEnum(PriceMarketPair)
  marketPair: PriceMarketPair;

  @IsDate()
  priceAt: string;
}