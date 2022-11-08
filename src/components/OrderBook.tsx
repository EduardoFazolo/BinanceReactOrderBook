import { useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import { Button } from '@mui/material';

import { useOrderBook } from '../contexts/OrderBookContext';
import { env } from '../env/client.mjs';
import { addAllOrdersToCache, getAllFormattedOrders } from '../utils/orders';
import CurrentPrice from './CurrentPrice';
import OrdersTable from './OrdersTable';
import PairTextField from './PairTextField';
import SelectDecimals from './SelectDecimals';

import type { SelectChangeEvent } from '@mui/material';
import type { JsonValue } from 'react-use-websocket/dist/lib/types';
import type { Depth, OrderBookMap, TickerParams } from '../types';
type DepthMessage = MessageEvent<Depth> & JsonValue;

let cachedBids: OrderBookMap = {};
let cachedAsks: OrderBookMap = {};
let pair = '';

const OrderBook = () => {
	const { sendJsonMessage, lastJsonMessage } = useWebSocket<DepthMessage>(
		env.NEXT_PUBLIC_SOCKET_URL
	);
	const { orders, setOrders, setCurrentPair, onSelectNewPair } = useOrderBook();

	const [decimals, setDecimals] = useState(0.1);
	const [pairInput, setPaitInput] = useState('BTCBUSD');
	const [isBlocked, setIsBlocked] = useState(false);

	const unsubDepth = useCallback(
		(oldPair: string) => {
			return sendJsonMessage({
				method: 'UNSUBSCRIBE',
				params: [`${oldPair.toLowerCase()}@${env.NEXT_PUBLIC_DEPTH_REQUEST}`],
				id: 1,
			} as TickerParams);
		},
		[sendJsonMessage]
	);

	const subDepth = useCallback(
		(newPair: string) => {
			return sendJsonMessage({
				method: 'SUBSCRIBE',
				params: [`${newPair.toLowerCase()}@${env.NEXT_PUBLIC_DEPTH_REQUEST}`],
				id: 1,
			} as TickerParams);
		},
		[sendJsonMessage]
	);
	const onSubmitNewPair = useCallback(async () => {
		setIsBlocked(true);
		unsubDepth(pair);
		subDepth(pairInput);
		// Wait for WebSocket to answer
		await new Promise(r => setTimeout(r, 500));
		setIsBlocked(false);
		setCurrentPair(pairInput);
		onSelectNewPair(pair, pairInput);
		pair = pairInput;
		cachedBids = {};
		cachedAsks = {};
	}, [setCurrentPair, onSelectNewPair, subDepth, unsubDepth, pairInput]);

	const onSelectDecimal = (event: SelectChangeEvent) => {
		cachedBids = {};
		cachedAsks = {};
		const decimals = Number(event.target.value as string);
		setDecimals(decimals);
	};

	useEffect(() => {
		const generateOrders = async () => {
			if (!lastJsonMessage || !lastJsonMessage.data || !lastJsonMessage.data.bids) return;
			await addAllOrdersToCache(cachedBids, cachedAsks, lastJsonMessage.data, decimals);
			const [newBids, newAsks] = await getAllFormattedOrders(cachedBids, cachedAsks);
			setOrders({ bids: newBids, asks: newAsks });
		};
		generateOrders();

		const onEnterListener = (event: KeyboardEvent) => {
			if (!isBlocked && (event.code === 'Enter' || event.code === 'NumpadEnter')) {
				event.preventDefault();
				onSubmitNewPair();
			}
		};
		document.addEventListener('keydown', onEnterListener);
		return () => {
			document.removeEventListener('keydown', onEnterListener);
		};
	}, [lastJsonMessage, decimals, setOrders, isBlocked, onSubmitNewPair]);

	return (
		<div className='mt-4 w-full md:w-[400px] h-[650px] bg-light-dark-blue flex flex-col border-solid border-[1px] border-[#4d5664]'>
			<div className='flex justify-center items-center p-4'>
				<PairTextField value={pairInput} onChange={setPaitInput}></PairTextField>
				<SelectDecimals
					value={decimals.toString()}
					onSelectElement={onSelectDecimal}></SelectDecimals>
				<Button
					disabled={isBlocked}
					onClick={onSubmitNewPair}
					className='text-light-gray border-solid border-[1px] h-[56px] hover:bg-default-gray hover:bg-opacity-20 '>
					Search
				</Button>
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
