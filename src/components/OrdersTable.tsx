import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { precisionCount } from '../utils/round';

interface Props {
	data?: number[][];
	decimals: number;
	className?: string;
}

const OrdersTable = ({ data, decimals, className }: Props) => {
	if (!data) return <div>Loading...</div>;
	return (
		<TableContainer className={className}>
			<Table className='max-w-[400px]' aria-label='Orders table'>
				<TableHead>
					<TableRow>
						<TableCell className='p-0'>Price</TableCell>
						<TableCell className='p-0'>Amount</TableCell>
						<TableCell className='p-0'>Total</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.slice(0, 10).map(row => {
						const price = Number(row[0]);
						const amount = Number(row[1]);
						return (
							<TableRow key={price}>
								<TableCell className='p-0 text-inherit'>
									{price.toFixed(precisionCount(decimals))}
								</TableCell>
								<TableCell className='p-0'>{amount.toFixed(5)}</TableCell>
								<TableCell className='p-0'>{(price * amount).toFixed(2)}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default OrdersTable;
