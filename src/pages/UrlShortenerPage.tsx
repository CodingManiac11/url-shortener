import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Grid, 
  TextField, 
  Typography, 
  Paper, 
  Alert, 
  IconButton, 
  Tooltip,
  Fade,
  Zoom,
  Card,
  CardContent,
  Chip,
  Snackbar,
  InputAdornment,
  Divider
} from '@mui/material';
import {
  AddCircleOutlineRounded,
  RemoveCircleOutlineRounded,
  LinkRounded,
  AccessTimeRounded,
  CodeRounded,
  ContentCopyRounded,
  CheckCircleRounded,
  LaunchRounded,
  RocketLaunchRounded
} from '@mui/icons-material';
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
  const [copySuccess, setCopySuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCopyUrl = async (url: string, shortcode: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(shortcode);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccess(false);
    setIsSubmitting(true);
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
      setIsSubmitting(false);
      return;
    }
    // Store results
    const allUrls = [...stored, ...newResults];
    storeUrls(allUrls);
    setResults(newResults);
    setErrors([]);
    setSuccess(true);
    setIsSubmitting(false);
    await log('frontend', 'info', 'component', 'All URLs shortened successfully');
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
            Transform Long URLs into Rocket Speed
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500,
              fontSize: '1.2rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              mb: 1
            }}
          >
            Because patience is overrated. Create lightning-fast short links that actually work.
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: 400,
              fontSize: '1rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              fontStyle: 'italic'
            }}
          >
            🚀 Launch URLs • 📊 Track Performance • ⚡ Share at Warp Speed
          </Typography>
        </Box>
      </Fade>

      <Card 
        sx={{ 
          maxWidth: 900,
          mx: 'auto',
          mb: 4,
          borderRadius: 4,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {inputs.map((input, idx) => (
                <Zoom key={idx} in timeout={600 + idx * 100}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.1)',
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                      border: '1px solid rgba(102, 126, 234, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(102, 126, 234, 0.15)',
                      }
                    }} 
                  >
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr auto' }, gap: 2, alignItems: 'center' }}>
                      <TextField
                        label="Long URL"
                        fullWidth
                        value={input.longUrl}
                        onChange={e => handleInputChange(idx, 'longUrl', e.target.value)}
                        error={!!errors[idx] && errors[idx].includes('URL')}
                        helperText={errors[idx] && errors[idx].includes('URL') ? errors[idx] : 'Enter the URL you want to shorten'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LinkRounded sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          }
                        }}
                      />
                      
                      <TextField
                        label="Validity (min)"
                        fullWidth
                        value={input.validity}
                        onChange={e => handleInputChange(idx, 'validity', e.target.value)}
                        error={!!errors[idx] && errors[idx].includes('Validity')}
                        helperText={errors[idx] && errors[idx].includes('Validity') ? errors[idx] : 'Default: 30'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccessTimeRounded sx={{ color: 'secondary.main' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          }
                        }}
                      />
                      
                      <TextField
                        label="Custom Code"
                        fullWidth
                        value={input.shortcode}
                        onChange={e => handleInputChange(idx, 'shortcode', e.target.value)}
                        error={!!errors[idx] && errors[idx].includes('Shortcode')}
                        helperText={errors[idx] && errors[idx].includes('Shortcode') ? errors[idx] : 'Optional custom code'}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CodeRounded sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          }
                        }}
                      />
                      
                      <Box sx={{ textAlign: 'center' }}>
                        <Tooltip title="Remove this URL">
                          <span>
                            <IconButton 
                              color="secondary" 
                              onClick={() => handleRemoveRow(idx)} 
                              disabled={inputs.length === 1} 
                              size="large"
                              sx={{
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                '&:hover': {
                                  backgroundColor: 'rgba(244, 67, 54, 0.2)',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <RemoveCircleOutlineRounded fontSize="large" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                </Zoom>
              ))}
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} mb={3}>
              <Button 
                variant="outlined" 
                startIcon={<AddCircleOutlineRounded />} 
                onClick={handleAddRow} 
                sx={{ 
                  fontWeight: 600,
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(102, 126, 234, 0.2)',
                  }
                }}
              >
                Add Another URL
              </Button>
              
              <Button 
                type="submit" 
                variant="contained" 
                disabled={isSubmitting}
                sx={{ 
                  fontWeight: 700, 
                  fontSize: 18, 
                  px: 6, 
                  py: 2, 
                  borderRadius: 3, 
                  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.5)',
                  },
                  '&:disabled': {
                    opacity: 0.7,
                    transform: 'none',
                  }
                }}
              >
                {isSubmitting ? '🚀 Launching...' : '🚀 Launch Short URLs'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
      {success && results.length > 0 && (
        <Fade in timeout={1000}>
          <Card 
            sx={{ 
              maxWidth: 900,
              mx: 'auto',
              mb: 4,
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(76, 175, 80, 0.2)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <CheckCircleRounded sx={{ fontSize: 48, color: 'success.main', mb: 1 }} />
                <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 700, mb: 1 }}>
                  🚀 Boom! Your URLs are ready for takeoff
                </Typography>
                <Typography color="text.secondary">
                  Your URLs have been compressed to warp speed. Ready to share!
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              {results.map((res, idx) => (
                <Zoom key={idx} in timeout={800 + idx * 200}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      mb: 2, 
                      borderRadius: 3, 
                      background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%)',
                      border: '1px solid rgba(76, 175, 80, 0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 28px rgba(76, 175, 80, 0.15)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2, alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Original URL
                        </Typography>
                        <Typography 
                          sx={{ 
                            color: 'primary.main', 
                            fontWeight: 500, 
                            mb: 2,
                            wordBreak: 'break-all',
                            fontSize: '0.9rem'
                          }}
                        >
                          {res.longUrl}
                        </Typography>
                        
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Short URL
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography 
                            component="a"
                            href={`/${res.shortcode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ 
                              color: 'secondary.main', 
                              fontWeight: 600,
                              textDecoration: 'none',
                              fontSize: '1.1rem',
                              '&:hover': {
                                textDecoration: 'underline',
                              }
                            }}
                          >
                            {SHORT_URL_PREFIX}{res.shortcode}
                          </Typography>
                          <Chip 
                            label="New" 
                            size="small" 
                            color="success" 
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button
                          variant="outlined"
                          startIcon={copySuccess === res.shortcode ? <CheckCircleRounded /> : <ContentCopyRounded />}
                          onClick={() => handleCopyUrl(`${SHORT_URL_PREFIX}${res.shortcode}`, res.shortcode)}
                          color={copySuccess === res.shortcode ? "success" : "primary"}
                          size="small"
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {copySuccess === res.shortcode ? 'Copied!' : 'Copy Link'}
                        </Button>
                        
                        <Button
                          variant="outlined"
                          startIcon={<LaunchRounded />}
                          href={`/${res.shortcode}`}
                          target="_blank"
                          color="secondary"
                          size="small"
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                          }}
                        >
                          Test Link
                        </Button>
                        
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ textAlign: 'center', mt: 1 }}
                        >
                          Expires: {new Date(res.expiry).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Zoom>
              ))}
            </CardContent>
          </Card>
        </Fade>
      )}
      {errors.some(e => e) && (
        <Fade in timeout={600}>
          <Card 
            sx={{ 
              maxWidth: 900,
              mx: 'auto',
              mb: 4,
              borderRadius: 4,
              border: '1px solid rgba(244, 67, 54, 0.2)',
              background: 'rgba(255, 245, 245, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" color="error" sx={{ mb: 2, fontWeight: 600 }}>
                ⚠️ Please fix the following issues:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {errors.map((err, idx) => err && (
                  <Alert 
                    severity="error" 
                    key={idx}
                    sx={{ 
                      borderRadius: 2,
                      '& .MuiAlert-message': { fontWeight: 500 }
                    }}
                  >
                    <strong>Row {idx + 1}:</strong> {err}
                  </Alert>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Fade>
      )}

      <Snackbar
        open={!!copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          🚀 URL copied to clipboard! Ready for launch!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UrlShortenerPage; 