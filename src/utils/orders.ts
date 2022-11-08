import type { Depth, NumberMatrix, OrderBookMap } from '../types';
import { roundDown, roundUp } from './round';

export const addOrdersToCache = async (
	bookOrders: OrderBookMap,
	newOrders: string[][],
	decimals: number,
	roundFn: (num: number, decimals: number) => number
) => {
	newOrders.forEach(newOrder => {
		const price = roundFn(Number(newOrder[0]), decimals);
		bookOrders[price] = (bookOrders[price] || 0) + Number(newOrder[1]);
	});
	return bookOrders;
};

export const getOrders = async (bookOrders: OrderBookMap): Promise<NumberMatrix> => {
	return Object.keys(bookOrders)
		.map(key => [Number(key), Number(bookOrders[Number(key)])])
		.sort((a, b) => Number(b[0]) - Number(a[0]))
		.slice(0, 10);
};

export const addAllOrdersToCache = async (
	bids: OrderBookMap,
	asks: OrderBookMap,
	data: Depth,
	precision: number
) => {
	return Promise.all([
		addOrdersToCache(bids, data.bids, precision, roundUp),
		addOrdersToCache(asks, data.asks, precision, roundDown),
	]);
};

export const getAllFormattedOrders = async (bids: OrderBookMap, asks: OrderBookMap) => {
	return await Promise.all([getOrders(bids), getOrders(asks)]);
};
