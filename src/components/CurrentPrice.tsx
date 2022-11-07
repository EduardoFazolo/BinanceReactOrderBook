import { useOrderBook } from '../contexts/OrderBookContext';

const CurrentPrice = () => {
	const { currentPrice, lastPrice } = useOrderBook();

	if (currentPrice === 0) return <></>;

	const priceText = currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 });

	if (currentPrice > lastPrice) {
		return <div className={'text-green-600 font-bold text-xl'}>{priceText}</div>;
	} else if (currentPrice < lastPrice) {
		return <div className={'text-red-600 font-bold text-xl'}>{priceText}</div>;
	}
	return <div className={'text-black font-bold text-xl'}>{priceText}</div>;
};

export default CurrentPrice;
