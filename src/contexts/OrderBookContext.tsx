import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import { env } from '../env/client.mjs';

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { JsonValue } from 'react-use-websocket/dist/lib/types';
import type { MiniTicker, OrderBookType, TickerParams } from '../types';
type MiniTickerMessage = MessageEvent<MiniTicker> & JsonValue;

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

function useOrderBookHook() {
	const [orders, setOrders] = useState({} as OrderBookType);
	const [currentPair, setCurrentPair] = useState('BTCBUSD');
	const [currentPrice, setCurrentPrice] = useState(0);
	const [lastPrice, setLastPrice] = useState(0);

	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<MiniTickerMessage>(
		env.NEXT_PUBLIC_SOCKET_URL
	);

	const onSelectNewPair = useCallback(
		(lastPair: string, newPair: string) => {
			setLastPrice(currentPrice);
			sendJsonMessage({
				method: 'UNSUBSCRIBE',
				params: [`${lastPair.toLowerCase()}@${env.NEXT_PUBLIC_TICKER_REQUEST}`],
				id: 2,
			} as TickerParams);
			sendJsonMessage({
				method: 'SUBSCRIBE',
				params: [`${newPair.toLowerCase()}@${env.NEXT_PUBLIC_TICKER_REQUEST}`],
				id: 2,
			} as TickerParams);
		},
		[sendJsonMessage, setLastPrice, currentPrice]
	);

	useEffect(() => {
		setLastPrice(currentPrice);
		setCurrentPrice(lastJsonMessage?.data?.c ? Number(lastJsonMessage?.data?.c) : 0);
	}, [lastJsonMessage, readyState, setLastPrice]);

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
