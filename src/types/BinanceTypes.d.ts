import type { JsonValue } from 'react-use-websocket/dist/lib/types';

export type Ticker = {
	e: string;
	E: number;
	s: string;
	p: string;
	P: string;
	w: string;
	x: string;
	c: string;
	Q: string;
	b: string;
	B: string;
	a: string;
	A: string;
	o: string;
	h: string;
	l: string;
	v: string;
	q: string;
	O: number;
	C: number;
	F: number;
	L: number;
	n: number;
};

export type MiniTicker = {
	e: string; // Event type
	E: number; // Event time
	s: string; // Symbol
	c: string; // Close price
	o: string; // Open price
	h: string; // High price
	l: string; // Low price
	v: string; // Total traded base asset volume
	q: string; // Total traded quote asset volume
};

export type Depth = {
	lastUpdateId: number;
	bids: string[][];
	asks: string[][];
};

export type OrdersType = {
	bids: number[][];
	asks: number[][];
};

export type TickerParams = {
	method: 'SUBSCRIBE' | 'UNSUBSCRIBE';
	params: string[];
	id: number;
} & JsonValue;
