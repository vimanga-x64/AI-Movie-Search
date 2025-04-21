import axios from 'axios';
import { searchMoviesDirect } from './tmdbService';

export const interpretQuery = async (userQuery) => {
  try {
    // Step 1: Semantic expansion
    const semanticResponse = await axios.post(
      'https://api-inference.huggingface.co/models/sentence-transformers/all-mpnet-base-v2',
      {
        inputs: {
          source_sentence: userQuery,
          sentences: [
            "science fiction space movie",
            "aviation and airplane films",
            "comedy movies",
            "horror films",
            "action adventure",
            "romantic drama"
          ]
        }
      },
      {
        headers: { Authorization: `Bearer ${process.env.REACT_APP_HF_API_KEY}` }
      }
    );

    // Step 2: Combine with keyword extraction
    const keywords = expandQuery(userQuery);
    const semanticKeywords = semanticResponse.data
      .map((score, index) => score > 0.5 ? [
        "science fiction",
        "aviation",
        "comedy",
        "horror",
        "action",
        "drama"
      ][index] : null)
      .filter(Boolean)
      .join(',');

    return `${keywords},${semanticKeywords}`;
  } catch (err) {
    console.error('Semantic interpretation failed, using fallback:', err);
    return expandQuery(userQuery);
  }
};

const expandQuery = (query) => {
  const conceptMap = {
    'space': 'sci-fi,astronaut,alien,spaceship,galaxy,NASA,cosmos,interstellar',
    'plane': 'aviation,pilot,aircraft,flight,jet,airplane',
    'funny': 'comedy,humor,witty,satire',
    'scary': 'horror,thriller,terror,fear',
    'romantic': 'romance,love,relationship',
    // Add more mappings as needed
  };

  // Remove common stop words
  const stopWords = new Set(['movie', 'film', 'watch', 'see', 'about', 'like']);
  
  return query.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .map(word => conceptMap[word] || word)
    .join(',');
};