import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import {
    Button, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField
} from '@mui/material';

import { addOrders, getOrders } from '../utils/orders';
import { precisionCount, roundDown, roundUp } from '../utils/round';
import CurrentPrice from './CurrentPrice';
import OrdersTable from './OrdersTable';

import type { SelectChangeEvent } from '@mui/material';

import type { JsonValue } from 'react-use-websocket/dist/lib/types';

import type { Depth, TickerParams } from '../types/Binance';
type DepthMessage = MessageEvent<Depth> & JsonValue;

let tempBids: Record<number, number> = {};
let tempAsks: Record<number, number> = {};

const OrderBook = () => {
	const socketUrl = 'wss://stream.binance.com:9443/stream';

	const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket<DepthMessage>(socketUrl);
	const [bids, setBids] = useState<number[][]>([]);
	const [asks, setAsks] = useState<number[][]>([]);

	const tickerName = 'btcbusd';
	const reqType = 'depth20';
	const wsParams = [`${tickerName}@${reqType}`];

	const [decimals, setDecimals] = useState(0.1);
	const [pair, setPair] = useState('');

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

	const onSelectDecimal = (event: SelectChangeEvent) => {
		tempBids = {};
		tempAsks = {};
		setBids([]);
		setAsks([]);
		const decimals = Number(event.target.value as string);
		setDecimals(decimals);
	};

	useEffect(() => {
		const generateOrders = async () => {
			if (!lastJsonMessage || !lastJsonMessage.data || !lastJsonMessage.data.bids) return;
			await Promise.all([
				addOrders(tempBids, lastJsonMessage.data.bids, decimals, roundUp),
				addOrders(tempAsks, lastJsonMessage.data.asks, decimals, roundDown),
			]);
			const [newBids, newAsks] = await Promise.all([
				getOrders(tempBids),
				getOrders(tempAsks),
			]);
			setBids(newBids);
			setAsks(newAsks);
		};
		generateOrders();
	}, [lastJsonMessage, decimals]);

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
				<OrdersTable data={bids} decimals={decimals} className='text-red-600'></OrdersTable>
				<CurrentPrice tickerName={tickerName} />

				<OrdersTable
					data={asks}
					decimals={decimals}
					className='text-green-600'></OrdersTable>
			</div>
		</div>
	);
};

export default OrderBook;
