import { useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import { Button, MenuItem, Select, TextField } from '@mui/material';

import { useOrderBook } from '../contexts/OrderBookContext';
import { addOrders, getOrders } from '../utils/orders';
import { roundDown, roundUp } from '../utils/round';
import CurrentPrice from './CurrentPrice';
import InputField from './InputField';
import OrdersTable from './OrdersTable';
import SelectDecimals from './SelectDecimals';

import type { SelectChangeEvent } from '@mui/material';

import type { JsonValue } from 'react-use-websocket/dist/lib/types';

import type { Depth, TickerParams } from '../types/BinanceTypes';
type DepthMessage = MessageEvent<Depth> & JsonValue;

let cachedBids: Record<number, number> = {};
let cachedAsks: Record<number, number> = {};

// TODO: Add this on env file
const reqType = 'depth20';

const OrderBook = () => {
	const socketUrl = 'wss://stream.binance.com:9443/stream';

	const { sendJsonMessage, lastJsonMessage } = useWebSocket<DepthMessage>(socketUrl);
	const { orders, setOrders, setCurrentPair, onSelectNewPair } = useOrderBook();

	const [decimals, setDecimals] = useState(0.1);
	const [pair, setPair] = useState('BTCBUSD');
	const [pairName, setPairName] = useState('BTCBUSD');

	const sendUnsub = useCallback(() => {
		return sendJsonMessage({
			method: 'UNSUBSCRIBE',
			params: [`${pair.toLowerCase()}@${reqType}`],
			id: 1,
		} as TickerParams);
	}, [pair, sendJsonMessage]);

	const sendSubs = useCallback(
		(newPair: string) => {
			return sendJsonMessage({
				method: 'SUBSCRIBE',
				params: [`${newPair.toLowerCase()}@${reqType}`],
				id: 1,
			} as TickerParams);
		},
		[sendJsonMessage]
	);
	const onChangePair = useCallback(async () => {
		sendUnsub();
		sendSubs(pairName);
		// Wait for WebSocket to answer
		await new Promise(r => setTimeout(r, 500));
		setCurrentPair(pairName);
		onSelectNewPair(pair, pairName);
		setPair(pairName);
		cachedBids = {};
		cachedAsks = {};
	}, [pair, setCurrentPair, onSelectNewPair, sendSubs, sendUnsub, pairName]);

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
			setOrders({ bids: newBids, asks: newAsks });
		};

		generateOrders();
	}, [lastJsonMessage, decimals, setOrders, pair]);

	return (
		<div className='mt-4 w-[400px] h-[650px] bg-[#182434] flex flex-col border-solid border-[1px] border-[#4d5664]'>
			<div className='flex justify-center items-center p-4'>
				<InputField setPairName={event => setPairName(event.target.value)}></InputField>
				<SelectDecimals
					value={decimals.toString()}
					onSelectElement={onSelectDecimal}></SelectDecimals>
				<Button onClick={onChangePair}>Search</Button>
			</div>

			<div className='flex flex-col h-[550px] justify-between w-full p-4'>
				<div className='flex justify-end h-full'>
					<OrdersTable
						data={orders.bids}
						decimals={decimals}
						className='text-price-down'></OrdersTable>
				</div>
				<div className='flex h-[140px] justify-start items-center'>
					<CurrentPrice />
				</div>

				<div className='flex justify-start h-full'>
					<OrdersTable
						data={orders.asks}
						decimals={decimals}
						className='text-price-up'></OrdersTable>
				</div>
			</div>
		</div>
	);
};

export default OrderBook;
