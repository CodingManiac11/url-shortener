import React, { useState } from 'react';
import { Box, Button, Grid, TextField, Typography, Paper, Alert, IconButton, Tooltip } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { log } from '../logging';

interface UrlInput {
  longUrl: string;
  validity: string;
  shortcode: string;
}

interface ShortenedUrl {
  longUrl: string;
  shortcode: string;
  expiry: number;
  created: number;
}

const SHORT_URL_PREFIX = window.location.origin + '/';
const DEFAULT_VALIDITY = 30; // minutes

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidShortcode(code: string) {
  return /^[a-zA-Z0-9]{3,16}$/.test(code);
}

function generateShortcode(existing: Set<string>) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  } while (existing.has(code));
  return code;
}

function getStoredUrls(): ShortenedUrl[] {
  try {
    const data = localStorage.getItem('shortenedUrls');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function storeUrls(urls: ShortenedUrl[]) {
  localStorage.setItem('shortenedUrls', JSON.stringify(urls));
}

const UrlShortenerPage: React.FC = () => {
  const [inputs, setInputs] = useState<UrlInput[]>([{ longUrl: '', validity: '', shortcode: '' }]);
  const [errors, setErrors] = useState<string[]>([]);
  const [results, setResults] = useState<ShortenedUrl[]>([]);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (idx: number, field: keyof UrlInput, value: string) => {
    const newInputs = [...inputs];
    newInputs[idx] = { ...newInputs[idx], [field]: value };
    setInputs(newInputs);
  };

  const handleAddRow = () => {
    setInputs([...inputs, { longUrl: '', validity: '', shortcode: '' }]);
    setErrors([...errors, '']);
  };

  const handleRemoveRow = (idx: number) => {
    const newInputs = inputs.filter((_, i) => i !== idx);
    const newErrors = errors.filter((_, i) => i !== idx);
    setInputs(newInputs);
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);
    let hasError = false;
    const newResults: ShortenedUrl[] = [];
    const errorList: string[] = [];
    const stored = getStoredUrls();
    const existingShortcodes = new Set(stored.map(u => u.shortcode));
    for (let i = 0; i < inputs.length; i++) {
      const { longUrl, validity, shortcode } = inputs[i];
      if (!longUrl && !validity && !shortcode) continue; // skip empty row
      if (!longUrl) {
        errorList[i] = 'Long URL is required.';
        hasError = true;
        await log('frontend', 'error', 'component', `Row ${i+1}: Long URL missing`);
        continue;
      }
      if (!isValidUrl(longUrl)) {
        errorList[i] = 'Invalid URL format.';
        hasError = true;
        await log('frontend', 'error', 'component', `Row ${i+1}: Invalid URL format`);
        continue;
      }
      let validMinutes = DEFAULT_VALIDITY;
      if (validity) {
        if (!/^[0-9]+$/.test(validity)) {
          errorList[i] = 'Validity must be an integer.';
          hasError = true;
          await log('frontend', 'error', 'component', `Row ${i+1}: Validity not integer`);
          continue;
        }
        validMinutes = parseInt(validity, 10);
      }
      let code = shortcode.trim();
      if (code) {
        if (!isValidShortcode(code)) {
          errorList[i] = 'Shortcode must be alphanumeric (3-16 chars).';
          hasError = true;
          await log('frontend', 'error', 'component', `Row ${i+1}: Invalid shortcode`);
          continue;
        }
        if (existingShortcodes.has(code)) {
          errorList[i] = 'Shortcode already exists.';
          hasError = true;
          await log('frontend', 'error', 'component', `Row ${i+1}: Shortcode collision`);
          continue;
        }
      } else {
        code = generateShortcode(existingShortcodes);
      }
      existingShortcodes.add(code);
      const now = Date.now();
      const expiry = now + validMinutes * 60 * 1000;
      newResults.push({ longUrl, shortcode: code, expiry, created: now });
      await log('frontend', 'info', 'component', `Shortened URL created: ${code}`);
    }
    if (hasError) {
      setErrors(errorList);
      setResults([]);
      setSuccess(false);
      return;
    }
    // Store results
    const allUrls = [...stored, ...newResults];
    storeUrls(allUrls);
    setResults(newResults);
    setErrors([]);
    setSuccess(true);
    await log('frontend', 'info', 'component', 'All URLs shortened successfully');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>Shorten URLs</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {inputs.map((input, idx) => (
            <Grid key={idx} size={12}>
              <Paper sx={{ p: 3, mb: 2, borderRadius: 3, boxShadow: 6, background: 'linear-gradient(90deg, #f3e5f5 0%, #fff3e0 100%)' }} elevation={4}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 5 }}>
                    <TextField
                      label="Long URL"
                      fullWidth
                      value={input.longUrl}
                      onChange={e => handleInputChange(idx, 'longUrl', e.target.value)}
                      error={!!errors[idx] && errors[idx].includes('URL')}
                      helperText={errors[idx] && errors[idx].includes('URL') ? errors[idx] : ''}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 2 }}>
                    <TextField
                      label="Validity (min)"
                      fullWidth
                      value={input.validity}
                      onChange={e => handleInputChange(idx, 'validity', e.target.value)}
                      error={!!errors[idx] && errors[idx].includes('Validity')}
                      helperText={errors[idx] && errors[idx].includes('Validity') ? errors[idx] : ''}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <TextField
                      label="Custom Shortcode"
                      fullWidth
                      value={input.shortcode}
                      onChange={e => handleInputChange(idx, 'shortcode', e.target.value)}
                      error={!!errors[idx] && errors[idx].includes('Shortcode')}
                      helperText={errors[idx] && errors[idx].includes('Shortcode') ? errors[idx] : ''}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }} sx={{ textAlign: { xs: 'right', md: 'center' } }}>
                    <Tooltip title="Remove this row">
                      <span>
                        <IconButton color="secondary" onClick={() => handleRemoveRow(idx)} disabled={inputs.length === 1} size="large">
                          <RemoveCircleOutlineIcon fontSize="large" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box display="flex" justifyContent="flex-end" mt={2} mb={2}>
          <Button variant="outlined" color="secondary" startIcon={<AddCircleOutlineIcon />} onClick={handleAddRow} sx={{ fontWeight: 600 }}>
            Add URL
          </Button>
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, fontWeight: 700, fontSize: 18, px: 5, py: 1.5, borderRadius: 2, boxShadow: 3 }}>
          Shorten
        </Button>
      </form>
      {success && results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 700 }}>Shortened URLs</Typography>
          {results.map((res, idx) => (
            <Paper key={idx} sx={{ p: 2, mt: 2, borderRadius: 2, boxShadow: 2, background: 'linear-gradient(90deg, #fff3e0 0%, #f3e5f5 100%)' }}>
              <Typography>Original: <span style={{ color: '#8e24aa', fontWeight: 500 }}>{res.longUrl}</span></Typography>
              <Typography>Short URL: <a href={`/${res.shortcode}`} style={{ color: '#ff9800', fontWeight: 600 }}>{SHORT_URL_PREFIX}{res.shortcode}</a></Typography>
              <Typography>Expires: {new Date(res.expiry).toLocaleString()}</Typography>
            </Paper>
          ))}
        </Box>
      )}
      {errors.some(e => e) && (
        <Box mt={2}>
          {errors.map((err, idx) => err && <Alert severity="error" key={idx}>{`Row ${idx+1}: ${err}`}</Alert>)}
        </Box>
      )}
    </Box>
  );
};

export default UrlShortenerPage; 