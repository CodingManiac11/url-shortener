import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Card,
  CardContent,
  Grid,
  Chip,
  Fade,
  Zoom,
  Avatar,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  BarChartRounded,
  LinkRounded,
  VisibilityRounded,
  AccessTimeRounded,
  TrendingUpRounded,
  RocketLaunchRounded,
} from '@mui/icons-material';
import { log } from '../logging';

interface ShortenedUrl {
  longUrl: string;
  shortcode: string;
  expiry: number;
  created: number;
}

interface ClickData {
  shortcode: string;
  timestamp: number;
  source: string;
  location: string;
}

function getStoredUrls(): ShortenedUrl[] {
  try {
    const data = localStorage.getItem('shortenedUrls');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function getClickData(): ClickData[] {
  try {
    const data = localStorage.getItem('clickData');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

const StatisticsPage: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [clicks, setClicks] = useState<ClickData[]>([]);

  useEffect(() => {
    log('frontend', 'info', 'page', 'Statistics page loaded');
    setUrls(getStoredUrls());
    setClicks(getClickData());
  }, []);

  const totalClicks = clicks.length;
  const activeUrls = urls.filter(url => url.expiry > Date.now()).length;
  const expiredUrls = urls.length - activeUrls;
  const averageClicksPerUrl = urls.length > 0 ? (totalClicks / urls.length).toFixed(1) : '0';

  const getClicksForUrl = (shortcode: string) => clicks.filter(c => c.shortcode === shortcode);
  const getUrlStatus = (url: ShortenedUrl) => url.expiry > Date.now() ? 'active' : 'expired';
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <Fade in timeout={800}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            <RocketLaunchRounded sx={{ fontSize: '3rem', color: 'white', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }} />
            Mission Control Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Track your rocket-powered URLs and their supersonic performance
          </Typography>
        </Box>
      </Fade>

      {urls.length === 0 ? (
        <Fade in timeout={1000}>
          <Card 
            sx={{ 
              maxWidth: 600,
              mx: 'auto',
              textAlign: 'center',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <CardContent sx={{ p: 6 }}>
              <BarChartRounded sx={{ fontSize: 80, color: 'primary.main', mb: 3, opacity: 0.7 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                No URLs in orbit yet
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Start launching URLs to see your mission data here. Your performance metrics will appear once you create your first rocket-powered link.
              </Typography>
            </CardContent>
          </Card>
        </Fade>
      ) : (
        <>
          {/* Statistics Overview */}
          <Fade in timeout={1000}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
              <Card sx={{ 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 2, mx: 'auto' }}>
                    <LinkRounded />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {urls.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total URLs
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 2, mx: 'auto' }}>
                    <VisibilityRounded />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {totalClicks}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Clicks
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 2, mx: 'auto' }}>
                    <AccessTimeRounded />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {activeUrls}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active URLs
                  </Typography>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                color: 'white',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Avatar sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 2, mx: 'auto' }}>
                    <TrendingUpRounded />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    {averageClicksPerUrl}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Avg Clicks/URL
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Fade>

          {/* Individual URL Statistics */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
            � Mission Performance Report
          </Typography>
          
          {urls.map((url, idx) => {
            const urlClicks = getClicksForUrl(url.shortcode);
            const status = getUrlStatus(url);
            const clickRate = urlClicks.length;
            
            return (
              <Zoom key={idx} in timeout={600 + idx * 100}>
                <Card 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${status === 'active' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)'}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box sx={{ flex: 1, mr: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                            {window.location.origin}/{url.shortcode}
                          </Typography>
                          <Chip 
                            label={status === 'active' ? 'Active' : 'Expired'}
                            color={status === 'active' ? 'success' : 'warning'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        
                        <Typography 
                          color="text.secondary" 
                          sx={{ mb: 2, wordBreak: 'break-all', fontSize: '0.9rem' }}
                        >
                          <strong>Original:</strong> {url.longUrl}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Created:</strong> {formatDate(url.created)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Expires:</strong> {formatDate(url.expiry)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ textAlign: 'center', minWidth: 120 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'secondary.main', mb: 1 }}>
                          {clickRate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                          Total Clicks
                        </Typography>
                      </Box>
                    </Box>

                    {clickRate > 0 && (
                      <>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          📈 Click History
                        </Typography>
                        <TableContainer 
                          component={Paper} 
                          sx={{ 
                            borderRadius: 2, 
                            boxShadow: 'none',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            maxHeight: 300,
                          }}
                        >
                          <Table size="small" stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(102, 126, 234, 0.1)' }}>
                                  Timestamp
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(102, 126, 234, 0.1)' }}>
                                  Source
                                </TableCell>
                                <TableCell sx={{ fontWeight: 600, backgroundColor: 'rgba(102, 126, 234, 0.1)' }}>
                                  Location
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {urlClicks.map((click, i) => (
                                <TableRow key={i} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' } }}>
                                  <TableCell>{formatDate(click.timestamp)}</TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={click.source} 
                                      size="small" 
                                      color="primary" 
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>{click.location}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                    
                    {clickRate === 0 && (
                      <Paper 
                        sx={{ 
                          p: 3, 
                          textAlign: 'center', 
                          backgroundColor: 'rgba(102, 126, 234, 0.05)',
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          borderRadius: 2
                        }}
                      >
                        <VisibilityRounded sx={{ fontSize: 40, color: 'text.secondary', mb: 1, opacity: 0.5 }} />
                        <Typography color="text.secondary">
                          No clicks recorded yet
                        </Typography>
                      </Paper>
                    )}
                  </CardContent>
                </Card>
              </Zoom>
            );
          })}
        </>
      )}
    </Box>
  );
};

export default StatisticsPage; 