import React from "react";
import App from "@/pages/App";
import m3Tokens from "@/material-theme"
import ReactDOM from "react-dom/client";
import { SnackbarProvider } from 'notistack';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme(
  {
    colorSchemes: { ...m3Tokens, dark: true },
    palette: { mode: "dark" },
    typography: { fontFamily: '"Roboto", serif' },
    shape: { borderRadius: 20 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 50, // Pill-shaped buttons
            textTransform: 'none', // MD3 drops all-caps button text
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            paddingTop: '2px',
            paddingBottom: '2px',
            paddingLeft: '0',
            paddingRight: '8px',
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
            borderBottomRightRadius: 50,
            borderTopRightRadius: 50,
            boxShadow: 'none', // MD3 relies on tonal elevation over deep shadows
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            boxShadow: 'none', // MD3 relies on tonal elevation over deep shadows
          },
        },
      },
    }
  }
);

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3} style={{ borderRadius: 16 }}>
          <App />
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
