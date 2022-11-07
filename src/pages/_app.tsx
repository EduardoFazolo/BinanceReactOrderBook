import '../styles/globals.css';

import { CssBaseline, StyledEngineProvider } from '@mui/material';

import type { AppType } from 'next/dist/shared/lib/utils';

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<StyledEngineProvider injectFirst>
			<CssBaseline />
			<Component {...pageProps} />;
		</StyledEngineProvider>
	);
};

export default MyApp;
