import { useEffect, useState } from "react";

export interface CounterProps {
	timer: number;
}

export const Counter = ({ timer }: CounterProps) => {
	const [timeRemaining, setTimeRemaining] = useState(timer);

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 0) {
					clearInterval(interval);
					return 0;
				}
				return prev - 1000;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return <>{Math.ceil(timeRemaining / 1000)}</>;
};
