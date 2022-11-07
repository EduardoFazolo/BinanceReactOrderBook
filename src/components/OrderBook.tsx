import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { Button, MenuItem, Select } from '@mui/material';

import { useOrderBook } from '../contexts/OrderBookContext';
import { addOrders, getOrders } from '../utils/orders';
import { precisionCount, roundDown, roundUp } from '../utils/round';
import CurrentPrice from './CurrentPrice';
import OrdersTable from './OrdersTable';

import type { SelectChangeEvent } from '@mui/material';

import type { JsonValue } from 'react-use-websocket/dist/lib/types';

import type { Depth, OrderBookType, TickerParams } from '../types/BinanceTypes';
type DepthMessage = MessageEvent<Depth> & JsonValue;

let cachedBids: Record<number, number> = {};
let cachedAsks: Record<number, number> = {};

const allowedPairs = ['BTCBUSD', 'ETHBUSD', 'ETHBTC'];

const reqType = 'depth20';

const OrderBook = () => {
	const socketUrl = 'wss://stream.binance.com:9443/stream';

	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<DepthMessage>(socketUrl);
	const { orders, setOrders, setCurrentPair, onSelectNewPair } = useOrderBook();

	const [decimals, setDecimals] = useState(0.1);
	const [pair, setPair] = useState('BTCBUSD');

	const handleClickSendMessage = useCallback(
		() =>
			sendJsonMessage({
				method: 'SUBSCRIBE',
				params: [`${pair.toLowerCase()}@${reqType}`],
				id: 1,
			} as TickerParams),
		[sendJsonMessage, pair]
	);

	const handleClickUnSendMessage = useCallback(
		() =>
			sendJsonMessage({
				method: 'UNSUBSCRIBE',
				params: [`${pair.toLowerCase()}@${reqType}`],
				id: 1,
			} as TickerParams),
		[sendJsonMessage, pair]
	);

	const onChangePair = useCallback(
		(event: SelectChangeEvent) => {
			sendJsonMessage({
				method: 'UNSUBSCRIBE',
				params: [`${pair.toLowerCase()}@${reqType}`],
				id: 1,
			} as TickerParams);
			const newPair = event.target.value as string;
			sendJsonMessage({
				method: 'SUBSCRIBE',
				params: [`${newPair.toLowerCase()}@${reqType}`],
				id: 1,
			} as TickerParams);
			setCurrentPair(newPair);
			onSelectNewPair(pair, newPair);
			setPair(newPair);
			setOrders({} as OrderBookType);
		},
		[sendJsonMessage, pair, setCurrentPair, setOrders, onSelectNewPair]
	);

	const onSelectDecimal = (event: SelectChangeEvent) => {
		cachedBids = {};
		cachedAsks = {};
		const decimals = Number(event.target.value as string);
		setDecimals(decimals);
	};

	useEffect(() => {
		const generateOrders = async () => {
			if (!lastJsonMessage || !lastJsonMessage.data || !lastJsonMessage.data.bids) return;
			await Promise.all([
				addOrders(cachedBids, lastJsonMessage.data.bids, decimals, roundUp),
				addOrders(cachedAsks, lastJsonMessage.data.asks, decimals, roundDown),
			]);
			const [newBids, newAsks] = await Promise.all([
				getOrders(cachedBids),
				getOrders(cachedAsks),
			]);
			setOrders({} as OrderBookType);
			setOrders({ bids: newBids, asks: newAsks });
		};

		generateOrders();
	}, [lastJsonMessage, decimals, setOrders]);

	return (
		<div className='mt-4 w-[800px] h-[650px] bg-white'>
			<Button
				variant='contained'
				onClick={handleClickSendMessage}
				disabled={readyState !== ReadyState.OPEN}>
				Subscribe
			</Button>

			<Button
				color='error'
				variant='contained'
				onClick={handleClickUnSendMessage}
				disabled={readyState !== ReadyState.OPEN}
				className='ml-5 mr-5 border-4 p-1 border-black'>
				Unsubscribe
			</Button>

			<Select id='symbol-select' value={pair} onChange={onChangePair}>
				{allowedPairs.map(p => (
					<MenuItem key={p} value={p}>
						{p}
					</MenuItem>
				))}
			</Select>

			<Select
				id='decimal-aggregator-select'
				value={decimals.toString()}
				onChange={onSelectDecimal}>
				<MenuItem value={0.01}>0.01</MenuItem>
				<MenuItem value={0.1}>0.1</MenuItem>
				<MenuItem value={1}>1</MenuItem>
				<MenuItem value={10}>10</MenuItem>
				<MenuItem value={50}>50</MenuItem>
				<MenuItem value={100}>100</MenuItem>
			</Select>

			<div className='flex flex-col'>
				<OrdersTable
					data={orders.bids}
					decimals={decimals}
					className='text-red-600'></OrdersTable>
				<CurrentPrice />

				<OrdersTable
					data={orders.asks}
					decimals={decimals}
					className='text-green-600'></OrdersTable>
			</div>
		</div>
	);
};

export default OrderBook;
