import m3Tokens from "@/config/material-theme";
import { createTheme } from '@mui/material/styles';
const darkTheme = createTheme(
  {
    colorSchemes: { ...m3Tokens, },
    palette: { mode: "dark" },
    typography: { fontFamily: '"Roboto", serif' },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12, // Pill-shaped buttons
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
      MuiFab: {
        styleOverrides: {
          extended: {
            textTransform: 'none',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    }
  }
);
export default darkTheme;
