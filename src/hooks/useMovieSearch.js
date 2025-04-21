import { useState } from 'react';
import { interpretQuery } from '../services/hfService';
import { searchMovies } from '../services/tmdbService';

export const useMovieSearch = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError('');
    setMovies([]);
    
    try {
      const interpretedQuery = await interpretQuery(query);
      const movieResults = await searchMovies(interpretedQuery);
      
      if (movieResults.length === 0) {
        setError(`No movies found for "${query}". Try more specific terms like:
          - "Sci-fi movies"
          - "Space adventures"
          - "Star Wars-like movies"`);
      } else {
        setMovies(movieResults);
      }
    } catch (err) {
      setError('Failed to fetch movie recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { query, setQuery, movies, loading, error, handleSearch };
};