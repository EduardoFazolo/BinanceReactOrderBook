import { styled, TextField } from '@mui/material';

const TextFieldWithCss = styled(TextField)({
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

interface Props {
	onChange(newValue: string): void;
	value: string;
}

const InputField = ({ onChange, value }: Props) => {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value
			.slice(0, 8)
			.toUpperCase()
			.replace(/[^a-z]/gi, '');

		onChange(newValue);
	};
	return (
		<TextFieldWithCss
			id='pair-input'
			label='Pair'
			value={value}
			variant='outlined'
			className='border-white'
			InputProps={{ className: 'text-light-gray font-bold', autoComplete: 'off' }}
			onChange={handleChange}
			InputLabelProps={{ className: 'text-light-gray' }}
		/>
	);
};

export default InputField;
