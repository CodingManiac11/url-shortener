import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UrlShortenerPage from './pages/UrlShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectHandler from './pages/RedirectHandler';

const theme = createTheme({
  palette: {
    primary: {
      main: '#8e24aa', // purple
      contrastText: '#fff',
    },
    secondary: {
      main: '#ff9800', // orange
      contrastText: '#fff',
    },
    background: {
      default: '#f3e5f5', // light purple background
      paper: '#fff3e0',   // light orange paper
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              URL Shortener
            </Typography>
            <Button color="inherit" component={Link} to="/">Shorten URL</Button>
            <Button color="inherit" component={Link} to="/stats">Statistics</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<UrlShortenerPage />} />
            <Route path="/stats" element={<StatisticsPage />} />
            <Route path=":shortcode" element={<RedirectHandler />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
