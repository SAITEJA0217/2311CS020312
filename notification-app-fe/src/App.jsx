import { useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { NotificationsPage } from './pages/NotificationsPage';
import { logEvent } from './utils/logger';

// Premium Minimalist Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#000000' }, // Sleek black
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700, letterSpacing: '-0.5px' },
  },
  shape: { borderRadius: 12 },
});

export default function App() {
  useEffect(() => {
    logEvent({ stack: 'frontend', level: 'info', pkg: 'app', message: 'App Started' });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes styling and applies the background color */}
      <NotificationsPage />
    </ThemeProvider>
  );
}