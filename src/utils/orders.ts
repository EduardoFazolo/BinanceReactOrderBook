export const addOrders = async (
	bookOrders: Record<number, number>,
	newOrders: string[][],
	decimals: number,
	roundFn: (num: number, decimals: number) => number
) => {
	newOrders.forEach(newOrder => {
		const price = roundFn(Number(newOrder[0]), decimals);
		bookOrders[price] = (bookOrders[price] || 0) + Number(newOrder[1]);
	});
};

export const getOrders = async (bookOrders: Record<number, number>) => {
	return Object.keys(bookOrders)
		.map(key => [Number(key), Number(bookOrders[Number(key)])])
		.sort((a, b) => Number(b[0]) - Number(a[0]));
};
