import Head from 'next/head';

import OrderBook from '../components/OrderBook';
import { OrderBookProvider } from '../contexts/OrderBookContext';

import type { ReactNode } from 'react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Order Book</title>
				<meta name='description' content='An order book made as a code challenge' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<OrderBookProvider>
				<main className='flex min-h-screen w-full flex-col items-center bg-[#0d1019] p-4 pt-2 md:pt-4'>
					<div className='flex'>
						<Title className='text-price-up'>Order</Title>
						<Title className='text-price-down'>Book</Title>
					</div>
					<OrderBook />
				</main>
			</OrderBookProvider>
		</>
	);
};

const Title = ({ className, children }: { className: string; children: ReactNode }) => {
	return (
		<h1 className={'text-2xl font-extrabold leading-normal md:text-[5rem] m-1 ' + className}>
			{children}
		</h1>
	);
};

export default Home;
