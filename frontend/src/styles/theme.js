import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0A2540', 
    },
    secondary: {
      main: '#00A86B', 
    },
    success: {
      main: '#28a745', 
    },
    warning: {
      main: '#ffc107', 
    },
    error: {
      main: '#dc3545', 
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',  
    },
    text: {
        primary: '#333333',
        secondary: '#6c757d',
    }
  },
  typography: {

    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h5: {
        fontWeight: 700,
    },
  },
  shape: {

    borderRadius: 8,
  },
  components: {

    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: 'none',
                fontWeight: 600,
            }
        }
    },
    MuiCard: {
        styleOverrides: {
            root: {
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
            }
        }
    }
  }
});