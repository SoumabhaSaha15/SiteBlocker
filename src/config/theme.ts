import { createTheme } from '@mui/material/styles';

const brandBlue = '#1499ff'; // Extracted from BrandIcon SVG[cite: 5]
const darkTheme = createTheme(
  {
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: brandBlue,
            light: '#5cb8ff',
            dark: '#0070c7',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#2a3b50', // Slate blue accent
            light: '#4f647e',
            dark: '#142131',
            contrastText: '#ffffff',
          },
          background: {
            default: '#f4f8fc', // Soft tinted canvas matching the brand blue
            paper: '#ffffff',   // Crisp white for elevated cards and modals
          },
          text: {
            primary: '#0e1726',
            secondary: '#556376',
          },
          divider: 'rgba(20, 153, 255, 0.12)',
        },
      },
      dark: {
        palette: {
          primary: {
            main: brandBlue,
            light: '#70beff',
            dark: '#0077d4',
            contrastText: '#001c3d',
          },
          secondary: {
            main: '#9ecaff',
            contrastText: '#002952',
          },
          background: {
            default: '#080d14', // Deep navy-black body canvas
            paper: '#101824',   // Elevated dark container with clear contrast
          },
          text: {
            primary: '#e9f1fa',
            secondary: '#8fa2b8',
          },
          divider: 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
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
