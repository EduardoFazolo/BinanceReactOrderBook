import type { Depth, OrderBookType } from '../types/BinanceTypes';
import { roundDown, roundUp } from './round';

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

export const getOrders = async (bookOrders: Record<number, number>): Promise<number[][]> => {
	return Object.keys(bookOrders)
		.map(key => [Number(key), Number(bookOrders[Number(key)])])
		.sort((a, b) => Number(b[0]) - Number(a[0]))
		.slice(0, 10);
};

export const getCorrectSnapshot = async (
	symbol = 'BTCBUSD',
	decimals = 10
): Promise<OrderBookType> => {
	const cachedBids: Record<number, number> = {};
	const cachedAsks: Record<number, number> = {};

	const res = await fetch(`https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=2000`);
	if (res.body) {
		const reader = res.body.getReader();
		let result;
		const decoder = new TextDecoder('utf8');
		let finalStr = '';
		while (!result?.done) {
			result = await reader.read();
			finalStr += decoder.decode(result.value);
		}
		const orders = JSON.parse(finalStr) as Depth;
		await Promise.all([
			addOrders(cachedBids, orders.bids, decimals, roundUp),
			addOrders(cachedAsks, orders.asks, decimals, roundDown),
		]);
		const [newBids, newAsks] = await Promise.all([
			getOrders(cachedBids),
			getOrders(cachedAsks),
		]);
		console.log('Bids snapshot:', newBids);
		console.log('Asks snapshot:', newAsks);
		return { bids: newBids, asks: newAsks };
	}
	return {} as OrderBookType;
};
