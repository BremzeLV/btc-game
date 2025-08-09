import { BitcoinIcon } from "@/components/ui/bitcoin-icon";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import Big from 'big.js';

interface PriceDisplayProps {
	price: string | null;
	lastUpdated?: string;
	isPriceDataLoading: boolean;
}

export const PriceDisplay = ({
	price,
	lastUpdated,
	isPriceDataLoading,
}: PriceDisplayProps) => {
	if (isPriceDataLoading) {
		return (
			<Card className="p-6 bg-gradient-bitcoin shadow-bitcoin">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<BitcoinIcon className="w-8 h-8 text-primary-foreground" />
						<div>
							<Skeleton className="h-8 w-32 mb-2" />
							<Skeleton className="h-4 w-24" />
						</div>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<Card className="p-6 bg-gradient-bitcoin shadow-bitcoin border-0">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<BitcoinIcon className="w-8 h-8 text-primary-foreground" />
					<div>
						<h2 className="text-2xl font-bold text-primary-foreground">
							{`${Big(price ?? 0).toFixed(2)}$`}
						</h2>
						<p className="text-sm text-primary-foreground/80">
							Bitcoin (BTC/USD)
						</p>
					</div>
				</div>
			</div>

			{lastUpdated && (
				<p className="text-xs text-primary-foreground/60 mt-3">
					Last updated: {new Date(lastUpdated).toLocaleTimeString()}
				</p>
			)}
		</Card>
	);
};