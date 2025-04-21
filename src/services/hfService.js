import axios from 'axios';
import { searchMoviesDirect } from './tmdbService'; 

export const interpretQuery = async (userQuery) => {
  // First expand the query with common synonyms
  const expandedQuery = expandQuery(userQuery);
  
  try {
    // Try with TMDB's search first
    const directResults = await searchMoviesDirect(expandedQuery);
    if (directResults.length > 0) return expandedQuery;

    // If no results, use AI interpretation
    const interpreted = await interpretWithAI(userQuery);
    return interpreted;
  } catch (err) {
    console.error('Interpretation error:', err);
    return expandedQuery; // Fallback to expanded query
  }
};

const expandQuery = (query) => {
  const synonymMap = {
    'space': 'sci-fi,astronaut,alien,spaceship,galaxy,NASA,cosmos,interstellar',
    'movie': '',
    'watch': '',
    'about': '',
    'films': ''
  };

  // Add space movie titles as keywords
  const spaceMovies = [
    'The Martian', 'Interstellar', 'Gravity', 'Apollo 13',
    '2001: A Space Odyssey', 'Star Trek', 'Star Wars',
    'Arrival', 'Contact', 'Ad Astra'
  ].join(',');

  const expanded = query.toLowerCase()
    .split(/\s+/)
    .map(word => synonymMap[word] || word)
    .join(' ');

  return expanded.includes('space') ? `${expanded},${spaceMovies}` : expanded;
};

const interpretWithAI = async (query) => {
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
    {
      inputs: query,
      parameters: {
        candidate_labels: [
          'sci-fi', 'action', 'comedy', 'drama', 'horror', 
          'war', 'aviation', 'space', 'fantasy', 'adventure'
        ]
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HF_API_KEY}`
      }
    }
  );
  
  return response.data.labels.slice(0, 2).join(',');
};