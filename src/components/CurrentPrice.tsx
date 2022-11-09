import { useOrderBook } from '../contexts/OrderBookContext';
import { precisionCount } from '../utils/round';

const CurrentPrice = () => {
	const { currentPrice, lastPrice } = useOrderBook();

	if (currentPrice === 0) return <></>;

	const precision = precisionCount(currentPrice);
	const price = currentPrice.toLocaleString('en-US', {
		minimumFractionDigits: precision > 2 ? precision : 2,
	});

	let color = 'text-white';
	let arrow = '';

	if (currentPrice > lastPrice) {
		color = 'text-price-up';
		arrow = '↑';
	} else if (currentPrice < lastPrice) {
		color = 'text-price-down';
		arrow = '↓';
	}

	return (
		<div className={color + ' font-bold text-xl flex w-[200px]'}>
			<div className='justify-start flex-1'>{price}</div>
			<div className='justify-start flex-1 ml-2'>{arrow}</div>
			<div className='text-light-gray font-normal text-xs flex h-inherit justify-center items-center'>
				${lastPrice}
			</div>
		</div>
	);
};

export default CurrentPrice;
