import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#9f3876',
      dark: '#bd1d82',
    },
    secondary: {
      light: '#f6a4fd',
      main: '#a8a8a8',
    },
    text: {
      primary: '#000000',
      secondary: '#a8a8a8',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: ['"Plus Jakarta Sans"', '"Poppins"', 'system-ui', 'sans-serif'].join(', '),
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.7,
    },
  },
  shape: {
    borderRadius: 16,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 24,
          paddingBlock: 10,
          boxShadow: 'none',
          '&:focus-visible': {
            outline: '3px solid rgba(189, 29, 130, 0.5)',
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          backgroundImage: 'linear-gradient(120deg, #9f3876, #bd1d82)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          '& fieldset': {
            borderWidth: 2,
          },
        },
      },
    },
  },
});

export default responsiveFontSizes(theme);
