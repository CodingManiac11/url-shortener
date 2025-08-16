import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, Fade, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LinkRounded, BarChartRounded, RocketLaunchRounded } from '@mui/icons-material';
import UrlShortenerPage from './pages/UrlShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectHandler from './pages/RedirectHandler';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
      light: '#8fa5f3',
      dark: '#4c63d2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f093fb',
      light: '#f5b7fd',
      dark: '#d171e8',
      contrastText: '#ffffff',
    },
    background: {
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paper: '#ffffff',
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.3s ease-in-out',
        },
        contained: {
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
            },
          },
        },
      },
    },
  },
});

const AnimatedNavButton = ({ to, icon, children, isActive }: { 
  to: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  isActive: boolean; 
}) => (
  <Button 
    color="inherit" 
    component={Link} 
    to={to}
    startIcon={icon}
    sx={{
      mx: 1,
      borderRadius: 3,
      px: 3,
      py: 1,
      background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
      backdropFilter: isActive ? 'blur(10px)' : 'none',
      border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      },
      transition: 'all 0.3s ease',
    }}
  >
    {children}
  </Button>
);

const AppContent = () => {
  const location = useLocation();
  
  return (
    <>
      <AppBar 
        position="static" 
        sx={{ 
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              fontSize: '1.8rem',
              background: 'linear-gradient(45deg, #ffffff 30%, #f0f8ff 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <RocketLaunchRounded sx={{ color: 'white', fontSize: '2rem' }} />
            ShortAF
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AnimatedNavButton 
              to="/" 
              icon={<LinkRounded />} 
              isActive={location.pathname === '/'}
            >
              Shorten URL
            </AnimatedNavButton>
            <AnimatedNavButton 
              to="/stats" 
              icon={<BarChartRounded />} 
              isActive={location.pathname === '/stats'}
            >
              Analytics
            </AnimatedNavButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
            `,
            pointerEvents: 'none',
          },
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            pt: 6, 
            pb: 6,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Fade in timeout={800}>
            <Box>
              <Routes>
                <Route path="/" element={<UrlShortenerPage />} />
                <Route path="/stats" element={<StatisticsPage />} />
                <Route path=":shortcode" element={<RedirectHandler />} />
              </Routes>
            </Box>
          </Fade>
        </Container>
      </Box>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
