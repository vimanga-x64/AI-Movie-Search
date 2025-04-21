import axios from 'axios';

export const searchMoviesDirect = async (query) => {
  try {
    const response = await axios.get(
      'https://api.themoviedb.org/3/search/movie',
      {
        params: {
          api_key: process.env.REACT_APP_TMDB_KEY,
          query: query,
          page: 1,
          include_adult: false,
          region: 'US' // Default region for consistent results
        }
      }
    );
    return response.data.results;
  } catch (err) {
    console.error('Direct search error:', err);
    return [];
  }
};

export const searchMovies = async (keywords) => {
  try {
    // Check for special query types
    const isSpaceQuery = /space|sci-fi|astronaut|nasa|galaxy|cosmos|alien/i.test(keywords);
    const isComedyQuery = /comedy|funny|humor|satire/i.test(keywords);
    
    // Special handling for space movies
    if (isSpaceQuery) {
      const [genreResults, keywordResults] = await Promise.all([
        searchByGenre(878), // Sci-Fi genre
        searchByKeywords(keywords)
      ]);
      
      const combined = [...genreResults, ...keywordResults]
        .filter((movie, index, self) =>
          index === self.findIndex(m => m.id === movie.id)
        );
      
      if (combined.length > 0) return combined.slice(0, 12);
      return await getPopularSpaceMovies();
    }

    // Default search flow
    const [directResults, discoverResults] = await Promise.all([
      searchMoviesDirect(keywords),
      searchByKeywords(keywords)
    ]);

    const allResults = [...directResults, ...discoverResults]
      .filter((movie, index, self) =>
        index === self.findIndex(m => m.id === movie.id)
      );

    return allResults
      .filter(movie => movie.poster_path)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 20);
  } catch (err) {
    console.error('Search error:', err);
    return [];
  }
};

const searchByGenre = async (genreId) => {
  const response = await axios.get(
    'https://api.themoviedb.org/3/discover/movie',
    {
      params: {
        api_key: process.env.REACT_APP_TMDB_KEY,
        with_genres: genreId,
        sort_by: 'popularity.desc',
        'vote_count.gte': 1000,
        include_adult: false
      }
    }
  );
  return response.data.results;
};

const searchByKeywords = async (keywords) => {
  const terms = keywords.split(/[, ]+/).filter(term => term.length > 0);
  const keywordIds = await Promise.all(terms.map(getKeywordId));
  
  const discoverResults = await Promise.all(
    keywordIds.map(keywordId =>
      axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: process.env.REACT_APP_TMDB_KEY,
          with_keywords: keywordId,
          sort_by: 'popularity.desc',
          include_adult: false
        }
      })
    )
  );

  return discoverResults.flatMap(res => res.data.results);
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
    27205,  // Inception
    49538,  // Moon
    68718,  // Elysium
    348,    // Alien
    78      // Blade Runner
  ];

  try {
    const movieRequests = spaceMovieIds.map(id =>
      axios.get(`https://api.themoviedb.org/3/movie/${id}`, {
        params: {
          api_key: process.env.REACT_APP_TMDB_KEY,
          append_to_response: 'keywords,similar'
        }
      })
    );

    const responses = await Promise.all(movieRequests);
    return responses
      .map(res => res.data)
      .filter(movie => movie.poster_path)
      .slice(0, 12);
  } catch (err) {
    console.error('Popular space movies error:', err);
    return [];
  }
};