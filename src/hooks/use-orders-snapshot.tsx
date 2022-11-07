import { useEffect, useState } from 'react';

import { getCorrectSnapshot } from '../utils/orders';

import type { OrdersType } from '../types/BinanceTypes';

export const useOrdersSnapshot = (symbol = 'BTCBUSD', decimals = 10) => {
	const [snapshot, setSnapshot] = useState<OrdersType>({} as OrdersType);

	useEffect(() => {
		const interval = setInterval(async () => {
			const newSnapshot = await getCorrectSnapshot(symbol.toUpperCase(), decimals);
			setSnapshot(newSnapshot);
			console.log('Updating orderbook with most recent snapshot...');
		}, 10000);
		return () => clearInterval(interval);
	}, [symbol, decimals]);

	return {
		snapshot,
	};
};
