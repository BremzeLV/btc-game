import { Card } from "@/components/ui/card";

interface ScoreDisplayProps {
	score: number;
  isGameStateLoading: boolean;
}

export const ScoreDisplay = ({ score, isGameStateLoading }: ScoreDisplayProps) => {
  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="text-center">
          {!isGameStateLoading && (<p className="text-2xl font-bold text-foreground">{score}</p>)}
          <p className="text-sm text-muted-foreground">Score</p>
        </div>
      </div>
    </Card>
  );
};