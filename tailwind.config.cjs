/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
	},
	important: '#__next',
	corePlugins: {
		preflight: false,
	},
	plugins: [],
};
