import { useCallback, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';

import type { JsonValue } from 'react-use-websocket/dist/lib/types';

import type { MiniTicker, TickerParams } from '../types/BinanceTypes';

type MiniTickerMessage = MessageEvent<MiniTicker> & JsonValue;

const CurrentPrice = ({ tickerName }: { tickerName: string }) => {
	const socketUrl = 'wss://stream.binance.com:9443/stream';

	const { sendJsonMessage, lastJsonMessage } = useWebSocket<MiniTickerMessage>(socketUrl);

	const getCurrentPrice = useCallback(() => {
		const wsParams = [`${tickerName}@miniTicker`];

		return sendJsonMessage({
			method: 'SUBSCRIBE',
			params: wsParams,
			id: 2,
		} as TickerParams);
	}, [sendJsonMessage, tickerName]);

	useEffect(() => {
		getCurrentPrice();
	}, [getCurrentPrice]);

	return <div>{lastJsonMessage ? lastJsonMessage.data?.c : null}</div>;
};

export default CurrentPrice;
