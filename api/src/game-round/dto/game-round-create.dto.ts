import { IsEnum } from "class-validator";
import { GameRoundPrediction } from "../types";
import { PriceMarketPair } from "src/price/types";

export class GameRoundCreateDto {
  @IsEnum(PriceMarketPair)
  marketPair: PriceMarketPair;

  @IsEnum(GameRoundPrediction)
  prediction: GameRoundPrediction;
}