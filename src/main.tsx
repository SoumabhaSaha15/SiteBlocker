import React from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
const darkTheme = createTheme({
  colorSchemes: {
    dark: true,
  },
  typography: {
    fontFamily: '"Roboto", serif',
  }
});

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <>hello</>
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
