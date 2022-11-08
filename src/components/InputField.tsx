import { styled, TextField } from '@mui/material';

const TextFieldWithCss = styled(TextField)({
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

const InputField = ({
	setPairName,
}: {
	setPairName(event: React.ChangeEvent<HTMLInputElement>): void;
}) => {
	return (
		<TextFieldWithCss
			id='pair-input'
			label='Pair'
			variant='outlined'
			className='border-white'
			InputProps={{ className: 'text-light-gray font-bold', autoComplete: 'off' }}
			onChange={setPairName}
			InputLabelProps={{ className: 'text-light-gray' }}
		/>
	);
};

export default InputField;
