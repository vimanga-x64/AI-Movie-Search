import React from 'react';
import { Box, Typography } from '@mui/material';
import { useMovieSearch } from './hooks/useMovieSearch';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';

function App() {
  const { query, setQuery, movies, loading, error, handleSearch } = useMovieSearch();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h3" gutterBottom align="center" sx={{ mb: 4 }}>
        AI Movie Search
      </Typography>
      
      <SearchBar 
        query={query}
        setQuery={setQuery}
        loading={loading}
        handleSearch={handleSearch}
      />
      
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: 3 
      }}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Box>
    </Box>
  );
}

export default App;