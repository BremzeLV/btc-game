import { usePrice } from "@/hooks/usePrice/use-price";
import { useGame } from "@/hooks/useGame/use-game";
import { PriceDisplay } from "./price-display";
import { ScoreDisplay } from "./score-display";
import { PredictionControls } from "./prediction-controls";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import ToastMessage from "../ui/toast";
import { PriceMarketPair } from "@/hooks/usePrice/types";
import { GameRoundPrediction, GameRoundResult } from "@/hooks/useGame/types";
import Big from "big.js";

export interface GameContainerProps {
	marketPair: PriceMarketPair;
}

export const GameContainer = ({ marketPair }: GameContainerProps) => {
	const { priceData, isPriceDataLoading, fetchPrice } = usePrice();

	const {
		newGameRound,
		fetchGame,
		resetGame,
		gameState,
		canMakePrediction,
		roundTimeRemaining,
		isGameStateLoading,
	} = useGame();

	useEffect(() => {
		fetchPrice(PriceMarketPair.BTCUSD);
  	}, [fetchPrice]);

  	useEffect(() => {
		fetchGame(PriceMarketPair.BTCUSD);
	}, [fetchGame]);
  
	useEffect(() => { 
		if (gameState.lastGameRoundResult !== null) {
		let title = 'Unknown game round result';
		const description: string[] = gameState.lastGameRoundPrices
			? [
			`Start price: ${gameState.lastGameRoundPrices.startPrice}$`,
			`End price: ${gameState.lastGameRoundPrices.endPrice}$`,
			]
			: [];

		switch (gameState.lastGameRoundResult) { 
			case GameRoundResult.WON:
			title = 'You won!';
			break;
			case GameRoundResult.LOST:
			title = 'You lost! :( House always wins!';
			break;
			case GameRoundResult.CANCELLED:
			title = 'Something went wrong with the round resolution';
			break;
		}
		
				toast(<ToastMessage title={title} description={description} />);
			}
	}, [gameState.lastGameRoundPrices, gameState.lastGameRoundResult])

	const handleNewGameRound = useCallback(
		(prediction: GameRoundPrediction) => {
			if (!priceData) return;

			newGameRound(prediction, marketPair);

			toast(
				<ToastMessage
					title={`Prediction recorded: ${prediction}`}
					description={[`Starting price: ${Big(priceData.price).toFixed(2)}$`]}
				/>
			);
		},
		[marketPair, newGameRound, priceData]
	);

	return (
		<div className="min-h-screen bg-background p-4">
			<div className="max-w-2xl mx-auto space-y-6">
				<div className="text-center pt-6">
					<h1 className="text-4xl font-bold bg-gradient-bitcoin bg-clip-text text-transparent mb-2">
						Bitcoin Price Predictor
					</h1>
					<p className="text-muted-foreground">
						Predict if Bitcoin will go up or down.
					</p>
				</div>

				<PriceDisplay
					price={priceData?.price || null}
					isPriceDataLoading={isPriceDataLoading}
					lastUpdated={priceData?.priceAt}
				/>

				<ScoreDisplay
					score={gameState.score}
					isGameStateLoading={isGameStateLoading}
				/>

				<PredictionControls
					onNewPrediction={handleNewGameRound}
					canMakePrediction={canMakePrediction}
					roundTimeRemaining={roundTimeRemaining}
					activeGameRoundPrediction={gameState.activeGameRound?.prediction}
					isGameStateLoading={isGameStateLoading}
				/>

				<div className="text-center">
					<Button
						onClick={() => resetGame(marketPair)}
						variant="outline"
						size="sm"
						className="gap-2"
					>
						<RotateCcw className="w-4 h-4" />
						Reset Game
					</Button>
				</div>
			</div>
		</div>
	);
};
