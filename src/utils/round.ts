//https://www.binance.com/en/support/announcement/updates-to-decimal-places-of-try-trading-pairs-c84958fd430046ab8e3c4adbc0888f77

export const roundUp = (num: number, decimalAggregator: number) => {
	return Math.round(num / decimalAggregator) * decimalAggregator;
};

export const roundDown = (num: number, decimalAggregator: number) => {
	return Math.floor(num / decimalAggregator) * decimalAggregator;
};

export const precisionCount = (decimals: number) => {
	if (!isFinite(decimals)) return 0;
	let e = 1,
		p = 0;
	while (Math.round(decimals * e) / e !== decimals) {
		e *= 10;
		p++;
	}
	return p;
};
