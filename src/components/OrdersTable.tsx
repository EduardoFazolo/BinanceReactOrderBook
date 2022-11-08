import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { precisionCount } from '../utils/round';

import type { OrdersType } from '../types/BinanceTypes';
interface Props {
	data: OrdersType;
	decimals: number;
	className?: string;
}

const OrdersTable = ({ data, decimals, className }: Props) => {
	return (
		<TableContainer className={className}>
			<Table aria-label='Orders table'>
				<TableHead>
					<TableRow>
						<TableCell className='p-0 text-light-gray font-bold text-left border-b-0 w-[120px]'>
							Price
						</TableCell>
						<TableCell className='p-0 text-light-gray font-bold text-center border-b-0 w-[120px]'>
							Amount
						</TableCell>
						<TableCell className='p-0 text-light-gray font-bold text-right border-b-0 w-[calc(100%-240px)]'>
							Total
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data?.slice(0, 10).map(row => {
						const price = Number(row[0]);
						const amount = Number(row[1]);
						return (
							<TableRow key={price}>
								<TableCell className='p-0 text-inherit text-left border-b-0'>
									{price.toFixed(precisionCount(decimals))}
								</TableCell>
								<TableCell className='p-0 text-default-gray text-center border-b-0'>
									{amount.toFixed(5)}
								</TableCell>
								<TableCell className='p-0 text-default-gray text-right border-b-0'>
									{(price * amount).toFixed(2)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default OrdersTable;
