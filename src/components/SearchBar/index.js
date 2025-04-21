import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  CircularProgress,
  Typography,
  Autocomplete,
  IconButton 
} from '@mui/material';
import { FaSearch, FaMicrophone } from 'react-icons/fa'; // Updated icon imports

const SearchBar = ({ query, setQuery, loading, handleSearch }) => {
  const [voiceSearch, setVoiceSearch] = useState(false);

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      setVoiceSearch(true);
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = (event) => {
        setQuery(event.results[0][0].transcript);
      };
      recognition.start();
    }
  };

  return (
    <Box sx={{ 
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)',
      borderRadius: '40px',
      p: 2,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      mx: 'auto',
      mb: 4
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Autocomplete
          freeSolo
          fullWidth
          options={[]}
          inputValue={query}
          onInputChange={(e, newValue) => setQuery(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Describe your perfect movie..."
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <FaSearch style={{ color: '#757575', marginRight: 8 }} />
                ),
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={24} />
                    ) : (
                      <IconButton 
                        onClick={startVoiceSearch}
                        disabled={voiceSearch}
                        sx={{ mr: 1 }}
                      >
                        <FaMicrophone color={voiceSearch ? 'primary' : 'action'} />
                      </IconButton>
                    )}
                  </>
                ),
                sx: {
                  borderRadius: '30px',
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  '& fieldset': { border: 'none' }
                }
              }}
            />
          )}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          sx={{
            ml: 2,
            px: 3,
            borderRadius: '30px',
            height: '56px',
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
          }}
        >
          Search
        </Button>
      </Box>
      <Typography 
        variant="caption" 
        sx={{ 
          mt: 1, 
          display: 'block', 
          color: 'text.secondary',
          textAlign: 'center'
        }}
      >
        Try: "space adventure with humor" or "dark mystery thriller"
      </Typography>
    </Box>
  );
};

export default SearchBar;