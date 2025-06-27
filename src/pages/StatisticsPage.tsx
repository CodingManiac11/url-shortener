import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Shortened URL Statistics</Typography>
      {urls.length === 0 ? (
        <Typography>No URLs have been shortened yet.</Typography>
      ) : (
        urls.map((url, idx) => {
          const urlClicks = clicks.filter(c => c.shortcode === url.shortcode);
          return (
            <Paper key={idx} sx={{ p: 2, mt: 3 }}>
              <Typography variant="h6">{window.location.origin}/{url.shortcode}</Typography>
              <Typography>Original: {url.longUrl}</Typography>
              <Typography>Created: {new Date(url.created).toLocaleString()}</Typography>
              <Typography>Expires: {new Date(url.expiry).toLocaleString()}</Typography>
              <Typography>Total Clicks: {urlClicks.length}</Typography>
              {urlClicks.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Location</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {urlClicks.map((click, i) => (
                        <TableRow key={i}>
                          <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{click.source}</TableCell>
                          <TableCell>{click.location}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          );
        })
      )}
    </Box>
  );
};

export default StatisticsPage; 