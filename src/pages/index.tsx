import Head from 'next/head';

import OrderBook from '../components/OrderBook';

import type { NextPage } from 'next';
const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Order Book</title>
				<meta name='description' content='An order book made as a code challenge' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='mx-auto flex min-h-screen flex-col items-center justify-center bg-gray-800 p-4'>
				<h1 className='text-5xl font-extrabold leading-normal text-gray-600 md:text-[5rem]'>
					Order Book
				</h1>
				<p className='text-2xl text-gray-600'>Welcome to my OrderBook</p>
				<OrderBook></OrderBook>
			</main>
		</>
	);
};

export default Home;