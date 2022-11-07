import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import type { JsonValue } from 'react-use-websocket/dist/lib/types';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { MiniTicker, OrderBookType, TickerParams } from '../types/BinanceTypes';
type OrderBookContextType = {
	orders: OrderBookType;
	setOrders: Dispatch<SetStateAction<OrderBookType>>;
	currentPair: string;
	setCurrentPair: Dispatch<SetStateAction<string>>;
	currentPrice: number;
	setCurrentPrice: Dispatch<SetStateAction<number>>;
	lastPrice: number;
	setLastPrice: Dispatch<SetStateAction<number>>;
	onSelectNewPair: (lastPair: string, newPair: string) => void;
};

const OrderBookContex = createContext<OrderBookContextType | undefined>(undefined);

export const OrderBookProvider = ({ children }: { children: ReactNode }) => {
	const results = useOrderBookHook();
	return <OrderBookContex.Provider value={results}>{children}</OrderBookContex.Provider>;
};

export const useOrderBook = () => {
	return useContext(OrderBookContex) as OrderBookContextType;
};

type MiniTickerMessage = MessageEvent<MiniTicker> & JsonValue;

function useOrderBookHook() {
	const [orders, setOrders] = useState({} as OrderBookType);
	const [currentPair, setCurrentPair] = useState('BTCBUSD');
	const [currentPrice, setCurrentPrice] = useState(0);
	const [lastPrice, setLastPrice] = useState(0);

	const socketUrl = 'wss://stream.binance.com:9443/stream';

	const { sendJsonMessage, lastJsonMessage, readyState } =
		useWebSocket<MiniTickerMessage>(socketUrl);

	const getCurrentPrice = useCallback(() => {
		return sendJsonMessage({
			method: 'SUBSCRIBE',
			params: [`${currentPair.toLowerCase()}@miniTicker`],
			id: 2,
		} as TickerParams);
	}, [sendJsonMessage, currentPair]);

	const onSelectNewPair = useCallback(
		(lastPair: string, newPair: string) => {
			setLastPrice(currentPrice);
			sendJsonMessage({
				method: 'UNSUBSCRIBE',
				params: [`${lastPair.toLowerCase()}@miniTicker`],
				id: 2,
			} as TickerParams);
			sendJsonMessage({
				method: 'SUBSCRIBE',
				params: [`${newPair.toLowerCase()}@miniTicker`],
				id: 2,
			} as TickerParams);
		},
		[sendJsonMessage, setLastPrice, currentPrice]
	);

	useEffect(() => {
		if (readyState !== ReadyState.OPEN) {
			getCurrentPrice();
		}
		setLastPrice(currentPrice);
		setCurrentPrice(lastJsonMessage?.data?.c ? Number(lastJsonMessage?.data?.c) : 0);
	}, [lastJsonMessage, readyState, getCurrentPrice, setLastPrice]);

	return {
		orders,
		setOrders,
		currentPair,
		setCurrentPair,
		currentPrice,
		setCurrentPrice,
		lastPrice,
		setLastPrice,
		onSelectNewPair,
	};
}
