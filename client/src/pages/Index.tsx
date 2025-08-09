import { GameContainer } from "@/components/game/game-container";
import { PriceMarketPair } from "@/hooks/usePrice/types";

const Index = () => {
  return (
    <GameContainer marketPair={PriceMarketPair.BTCUSD} />
  );
};

export default Index;
