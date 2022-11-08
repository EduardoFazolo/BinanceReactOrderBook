import { Input, MenuItem, Select, SelectChangeEvent, SelectProps, styled } from '@mui/material';

const SelectWithCSS = styled(Select)({
	'& .MuiSelect-underline:after': {
		borderBottomColor: '#b4c8d3',
	},
	'& .MuiOutlinedSelect-root': {
		backgroundColor: '#263e59',
		'& fieldset': {
			borderColor: 'red',
		},
		'&:hover fieldset': {
			borderColor: 'red',
		},
		'&.Mui-focused fieldset': {
			borderColor: 'red',
		},
	},
	'& ..MuiSelect-select': {
		background: 'red',
	},
});
const TextFieldWithCss = styled(Input)({
	'& label.Mui-focused': {
		color: '#b4c8d3',
	},
	'& .MuiInput-underline:after': {
		borderBottomColor: '#b4c8d3',
	},
	'& .MuiOutlinedInput-root': {
		backgroundColor: '#263e59',
		'& fieldset': {
			borderColor: '#9ca9b4',
		},
		'&:hover fieldset': {
			borderColor: '#b4c8d3',
		},
		'&.Mui-focused fieldset': {
			borderColor: '#b4c8d3',
		},
	},
	'& .MuiInputBase-input': {
		width: '100px',
	},
});

interface Props extends SelectProps {
	onSelectElement(event: SelectChangeEvent): void;
}

const SelectDecimals = ({ value, onSelectElement, ...props }: Props) => {
	return (
		<SelectWithCSS
			id='decimal-aggregator-select'
			value={value}
			onChange={onSelectElement}
			sx={{
				border: '1px solid #9ca9b4',
				color: '#b4c8d3',
				'& .MuiSelect-select': {
					color: '#b4c8d3',
					background: '#263e59',
				},
				'& .MuiSvgIcon-root': {
					color: '#b4c8d3',
				},
			}}
			className='text-white ml-2 mr-2 w-[180px]'
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
		</SelectWithCSS>
	);
};

export default SelectDecimals;
