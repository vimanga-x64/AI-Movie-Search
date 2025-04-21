import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { styles } from './styles';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <Card sx={styles.card}>
      <CardMedia
        component="img"
        sx={styles.media}
        image={posterUrl}
        alt={movie.title}
      />
      <CardContent>
        <Typography variant="h6" component="div">
          {movie.title} {movie.release_date && `(${movie.release_date.substring(0, 4)})`}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.overview?.substring(0, 100)}...
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;