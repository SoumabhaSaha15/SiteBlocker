import { StrictMode } from 'react';
import App from "@/content/views/App";
import darkTheme from "@/config/theme";
import { SnackbarProvider } from 'notistack';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { StyledEngineProvider } from '@mui/material/styles';

(()=>{
  const container = document.createElement('div');
  container.id = 'SiteBlockerOverlay';
  document.body.replaceWith(container);
  createRoot(container).render(
    <StrictMode>
      <StyledEngineProvider enableCssLayer>
        <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <SnackbarProvider maxSnack={3} style={{ borderRadius: 16 }}>
            <App />
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </StrictMode>
  );
})()
