import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
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

function storeClick(click: ClickData) {
  const data = localStorage.getItem('clickData');
  const arr = data ? JSON.parse(data) : [];
  arr.push(click);
  localStorage.setItem('clickData', JSON.stringify(arr));
}

async function getLocation(): Promise<string> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return 'Unknown';
    const data = await res.json();
    return data.country_name || 'Unknown';
  } catch {
    return 'Unknown';
  }
}

const RedirectHandler: React.FC = () => {
  const { shortcode } = useParams<{ shortcode: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'error' | 'expired' | 'redirect'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function handleRedirect() {
      if (!shortcode) {
        setStatus('error');
        setMessage('No shortcode provided.');
        await log('frontend', 'error', 'page', 'No shortcode in URL');
        return;
      }
      const urls = getStoredUrls();
      const found = urls.find(u => u.shortcode === shortcode);
      if (!found) {
        setStatus('error');
        setMessage('Short URL not found.');
        await log('frontend', 'error', 'page', `Shortcode not found: ${shortcode}`);
        return;
      }
      if (Date.now() > found.expiry) {
        setStatus('expired');
        setMessage('This short URL has expired.');
        await log('frontend', 'warn', 'page', `Shortcode expired: ${shortcode}`);
        return;
      }
      // Log click
      const location = await getLocation();
      const click: ClickData = {
        shortcode,
        timestamp: Date.now(),
        source: document.referrer || 'Direct',
        location,
      };
      storeClick(click);
      await log('frontend', 'info', 'page', `Redirected: ${shortcode}`);
      setStatus('redirect');
      setTimeout(() => {
        window.location.href = found.longUrl;
      }, 1200);
    }
    handleRedirect();
    // eslint-disable-next-line
  }, [shortcode]);

  if (status === 'loading') {
    return <Box textAlign="center" mt={6}><CircularProgress /><Typography>Redirecting...</Typography></Box>;
  }
  if (status === 'error' || status === 'expired') {
    return <Box textAlign="center" mt={6}><Alert severity={status === 'error' ? 'error' : 'warning'}>{message}</Alert></Box>;
  }
  return <Box textAlign="center" mt={6}><CircularProgress /><Typography>Redirecting to destination...</Typography></Box>;
};

export default RedirectHandler; 