import React from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { styles } from './styles';

const SearchBar = ({ query, setQuery, loading, handleSearch }) => {
  return (
    <Box sx={styles.container}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Try: 'Funny movies about space' or 'Dramas with planes'"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        sx={styles.input}
      />
      <Button 
        variant="contained" 
        onClick={handleSearch}
        disabled={loading}
        sx={styles.button}
      >
        {loading ? <CircularProgress size={24} /> : 'Search'}
      </Button>
    </Box>
  );
};

export default SearchBar;