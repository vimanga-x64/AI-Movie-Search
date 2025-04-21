import axios from 'axios';

export const searchMoviesDirect = async (query) => {
  const response = await axios.get(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: {
        api_key: process.env.REACT_APP_TMDB_KEY,
        query: query,
        page: 1,
        include_adult: false
      }
    }
  );
  return response.data.results;
};

export const searchMovies = async (keywords) => {
  try {
    // First check if it's a space-related query
    const isSpaceQuery = /space|sci-fi|astronaut|nasa|galaxy|cosmos/i.test(keywords);

    if (isSpaceQuery) {
      // Try with sci-fi genre filter first
      const spaceGenreResults = await axios.get(
        'https://api.themoviedb.org/3/discover/movie',
        {
          params: {
            api_key: process.env.REACT_APP_TMDB_KEY,
            with_genres: 878, // Sci-Fi genre ID
            sort_by: 'popularity.desc',
            'vote_count.gte': 1000, // Only well-known movies
            include_adult: false
          }
        }
      );
      
      if (spaceGenreResults.data.results.length > 0) {
        return spaceGenreResults.data.results.slice(0, 12);
      }

      // If no genre results, try with predefined space movies
      return await getPopularSpaceMovies();
    }

    // For non-space queries, try direct search
    const directResults = await searchMoviesDirect(keywords);
    if (directResults.length > 0) return directResults;

    // Then try discover with keywords
    const terms = keywords.split(/[, ]+/).filter(term => term.length > 0);
    const discoverResults = await Promise.all(
      terms.map(term => searchMoviesDiscover(term))
    );

    // Combine and deduplicate results
    const allResults = discoverResults.flat();
    const uniqueResults = allResults.filter(
      (movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
    );

    return uniqueResults
      .filter(movie => movie.poster_path)
      .slice(0, 20);

  } catch (err) {
    console.error('Search error:', err);
    // For space queries, return predefined movies as fallback
    if (/space|sci-fi|astronaut/i.test(keywords)) {
      return await getPopularSpaceMovies();
    }
    return [];
  }
};

const searchMoviesDiscover = async (keyword) => {
  try {
    const keywordId = await getKeywordId(keyword);
    const response = await axios.get(
      'https://api.themoviedb.org/3/discover/movie',
      {
        params: {
          api_key: process.env.REACT_APP_TMDB_KEY,
          with_keywords: keywordId,
          sort_by: 'popularity.desc',
          include_adult: false
        }
      }
    );
    return response.data.results;
  } catch (err) {
    console.error('Discover error:', err);
    return [];
  }
};

const getKeywordId = async (keyword) => {
  try {
    const response = await axios.get(
      'https://api.themoviedb.org/3/search/keyword',
      {
        params: {
          api_key: process.env.REACT_APP_TMDB_KEY,
          query: keyword
        }
      }
    );
    return response.data.results[0]?.id || keyword;
  } catch (err) {
    console.error('Keyword ID error:', err);
    return keyword;
  }
};

const getPopularSpaceMovies = async () => {
  const spaceMovieIds = [
    157336, // Interstellar
    286217, // The Martian
    49026,  // Gravity
    568,    // Apollo 13
    62,     // 2001: A Space Odyssey
    329,    // Space Odyssey
    1726,   // Iron Man (includes space elements)
    27205,  // Inception (space-like themes)
    49538,  // Moon
    68718,  // Elysium
  ];

  try {
    const movieRequests = spaceMovieIds.map(id => 
      axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
        params: { 
          api_key: process.env.REACT_APP_TMDB_KEY,
          append_to_response: 'keywords' 
        }
      })
    );

    const responses = await Promise.all(movieRequests);
    return responses
      .map(res => res.data)
      .filter(movie => movie.poster_path) // Only movies with posters
      .slice(0, 12); // Limit to 12 results
  } catch (err) {
    console.error('Popular space movies error:', err);
    return [];
  }
};