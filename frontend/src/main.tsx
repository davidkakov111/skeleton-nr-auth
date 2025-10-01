import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/auth/AuthContext.tsx'
import { SnackbarProvider } from 'notistack';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <App />
        </ AuthProvider>
      </SnackbarProvider>
    </ ThemeProvider>
  </StrictMode>,
)
