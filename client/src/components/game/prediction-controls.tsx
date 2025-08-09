import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Counter } from "../shared/counter";
import { GameRoundPrediction } from "@/hooks/useGame/types";
import { Skeleton } from "../ui/skeleton";

interface PredictionControlsProps {
	onNewPrediction: (prediction: GameRoundPrediction) => void;
	canMakePrediction: boolean;
	roundTimeRemaining: number;
	activeGameRoundPrediction?: GameRoundPrediction;
	isGameStateLoading: boolean;
}

export const PredictionControls = ({
	onNewPrediction,
	canMakePrediction,
	roundTimeRemaining,
	activeGameRoundPrediction,
	isGameStateLoading,
}: PredictionControlsProps) => {
	if (!canMakePrediction && roundTimeRemaining > 0) {
		return (
			<Card className="p-6 text-center">
				<div className="flex items-center justify-center gap-2 mb-4">
					<Clock className="w-5 h-5 text-muted-foreground" />
					<span className="text-lg font-medium">Waiting for resolution...</span>
				</div>

				<div className="mb-4">
					<p className="text-sm text-muted-foreground mb-2">
						Your guess:{" "}
						{activeGameRoundPrediction === GameRoundPrediction.UP
							? "Price will go UP"
							: "Price will go DOWN"}
					</p>
					<p className="text-2xl font-bold text-primary">
						<Counter timer={roundTimeRemaining} />
					</p>
					<p className="text-sm text-muted-foreground">Time remaining</p>
				</div>

				<div className="text-sm text-muted-foreground">
					Your guess will be resolved after the timer expires.
				</div>
			</Card>
		);
	}

	return (
		<Card className="p-6">
			<h3 className="text-lg font-semibold mb-4 text-center">
				Make Your Prediction
			</h3>

			{isGameStateLoading ? (
				<div className="grid grid-cols-2 gap-4">
					<Skeleton className="h-16" />
					<Skeleton className="h-16" />
				</div>
			) : (
				<div className="grid grid-cols-2 gap-4">
					<Button
						onClick={() => onNewPrediction(GameRoundPrediction.UP)}
						size="lg"
						className="h-16 bg-gradient-success shadow-success hover:shadow-success/50 transition-all duration-200"
					>
						<div className="flex flex-col items-center gap-2">
							<TrendingUp className="w-6 h-6" />
							<span className="font-semibold">UP</span>
						</div>
					</Button>

					<Button
						onClick={() => onNewPrediction(GameRoundPrediction.DOWN)}
						size="lg"
						className="h-16 bg-gradient-danger shadow-danger hover:shadow-danger/50 transition-all duration-200"
					>
						<div className="flex flex-col items-center gap-2">
							<TrendingDown className="w-6 h-6" />
							<span className="font-semibold">DOWN</span>
						</div>
					</Button>
				</div>
			)}

			<div className="mt-4 text-center">
				<p className="text-xs text-muted-foreground">
					• Correct guess: +1 point • Wrong guess: -1 point
					<br />• Guess resolves after 60 seconds
				</p>
			</div>
		</Card>
	);
};
