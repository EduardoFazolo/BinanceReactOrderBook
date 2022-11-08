/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'light-gray': '#b4c8d3',
				'default-gray': '#9ca9b4',
				'price-down': '#de4459',
				'price-up': '#10c07b',
				'dark-blue': '#0d1019',
				'light-dark-blue': '#182434',
			},
		},
	},
	important: '#__next',
	corePlugins: {
		preflight: false,
	},
	plugins: [],
};
