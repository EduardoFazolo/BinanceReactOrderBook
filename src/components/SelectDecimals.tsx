import type { SelectChangeEvent, SelectProps } from '@mui/material';
import type { ReactNode } from 'react';

import { MenuItem, Select } from '@mui/material';

const selectCss = {
	border: '1px solid #9ca9b4',
	color: '#b4c8d3',
	'& .MuiSelect-select': {
		color: '#b4c8d3',
		background: '#263e59',
	},
	'& .MuiSvgIcon-root': {
		color: '#b4c8d3',
	},
};

interface Props extends SelectProps {
	onSelectElement(event: SelectChangeEvent<unknown>, child: ReactNode): void | undefined;
}

const SelectDecimals = ({ value, onSelectElement, ...props }: Props) => {
	return (
		<Select
			id='decimal-aggregator-select'
			value={value}
			onChange={onSelectElement}
			sx={selectCss}
			className='text-white ml-2 mr-2 w-[140px]'
			{...props}>
			<MenuItem value={0.000001}>0.000001</MenuItem>
			<MenuItem value={0.0001}>0.0001</MenuItem>
			<MenuItem value={0.001}>0.001</MenuItem>
			<MenuItem value={0.01}>0.01</MenuItem>
			<MenuItem value={0.1}>0.1</MenuItem>
			<MenuItem value={1}>1</MenuItem>
			<MenuItem value={10}>10</MenuItem>
			<MenuItem value={50}>50</MenuItem>
			<MenuItem value={100}>100</MenuItem>
		</Select>
	);
};

export default SelectDecimals;
