import { useCallback, useMemo, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import type { JsonValue } from 'react-use-websocket/dist/lib/types';

import type { Depth, Ticker, TickerParams } from '../types/Binance';

type MessageTicker = MessageEvent<Depth> & JsonValue;

const OrdersTable = ({ data }: { data?: string[][] }) => {
	console.log('data:::', data);
	if (!data) return <div>Loading...</div>;
	return (
		<div>
			{data.map(d => (
				<div key={d[0]} className='flex flex-row'>
					<div className='flex flex-col mr-5'>
						<div>{d[0]}</div>
					</div>
					<div className='flex flex-col mr-5'>
						<div>{d[1]}</div>
					</div>
					<div className='flex flex-col mr-5'>
						<div>{Number(d[0]) * Number(d[1])}</div>
					</div>
				</div>
			))}
		</div>
	);
};

const OrderBook = () => {
	const socketUrl = 'wss://stream.binance.com:9443/stream';

	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<MessageTicker>(socketUrl);

	const messageHistory = useRef<MessageEvent[]>([]);

	const tickerName = 'btcbusd';

	const reqType = 'depth20';

	const wsParams = [`${tickerName}@${reqType}`];

	const handleClickSendMessage = useCallback(
		() =>
			sendJsonMessage({
				method: 'SUBSCRIBE',
				params: wsParams,
				id: 1,
			} as TickerParams),
		[sendJsonMessage]
	);

	const handleClickUnSendMessage = useCallback(
		() =>
			sendJsonMessage({
				method: 'UNSUBSCRIBE',
				params: wsParams,
				id: 1,
			} as TickerParams),
		[sendJsonMessage]
	);

	const connectionStatus = {
		[ReadyState.CONNECTING]: 'Connecting',
		[ReadyState.OPEN]: 'Open',
		[ReadyState.CLOSING]: 'Closing',
		[ReadyState.CLOSED]: 'Closed',
		[ReadyState.UNINSTANTIATED]: 'Uninstantiated',
	}[readyState];

	return (
		<div className='mt-4 w-[800px] h-[400px] bg-white'>
			<button
				onClick={handleClickSendMessage}
				disabled={readyState !== ReadyState.OPEN}
				className='ml-5 mr-5 border-4 p-1 border-black'>
				Subscribe
			</button>
			<button
				onClick={handleClickUnSendMessage}
				disabled={readyState !== ReadyState.OPEN}
				className='ml-5 mr-5 border-4 p-1 border-black'>
				Unsubscribe
			</button>
			<div>The WebSocket is currently {connectionStatus}</div>
			{lastJsonMessage ? (
				<div className='flex flex-row w-full justify-between'>
					<div className='flex flex-col mr-5'>
						<div>Bid</div>
						<div className='flex flex-row w-full justify-between'>
							<div className='flex flex-col'>
								<div>Price</div>
							</div>
							<div className='flex flex-col mr-5'>
								<div>Quantity</div>
							</div>
							<div className='flex flex-col mr-5'>
								<div>Total</div>
							</div>
						</div>
						<OrdersTable data={lastJsonMessage.data?.bids}></OrdersTable>
					</div>
					<div className='flex flex-col mr-5'>
						<div>Ask</div>
						<div className='flex flex-row w-full justify-between'>
							<div className='flex flex-col'>
								<div>Price</div>
							</div>
							<div className='flex flex-col'>
								<div>Quantity</div>
							</div>
							<div className='flex flex-col mr-5'>
								<div>Total</div>
							</div>
						</div>
						<OrdersTable data={lastJsonMessage.data?.asks}></OrdersTable>
					</div>
				</div>
			) : null}

			{/* <ul>
				{messageHistory.current.map((message, idx) => (
					<div key={idx}>{JSON.stringify(message.data, null, 4)}</div>
				))}
			</ul> */}
		</div>
	);
};

export default OrderBook;
