import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button,
  Box,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaStar, FaPlayCircle, FaInfoCircle } from 'react-icons/fa';

const MovieCard = ({ movie }) => {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/no-poster.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%' }}
    >
      <Card sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          transform: 'translateY(-4px)'
        }
      }}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="340"
            image={posterUrl}
            alt={movie.title}
            sx={{
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              objectFit: 'cover'
            }}
          />
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            p: 1.5,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)'
          }}>
            <Chip 
              label={movie.release_date?.substring(0, 4) || 'N/A'}
              color="primary"
              size="small"
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FaStar color="gold" size={14} />
              <Typography variant="body2" color="white" ml={0.5}>
                {movie.vote_average?.toFixed(1)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {movie.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {movie.overview || 'No description available.'}
          </Typography>
        </CardContent>

        <Box sx={{ p: 2, pt: 0 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<FaInfoCircle />}
            sx={{
              background: 'linear-gradient(45deg, #3a7bd5, #00d2ff)',
              borderRadius: '8px',
              color: 'white',
              '&:hover': {
                transform: 'translateY(-2px)'
              }
            }}
          >
            Details
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

export default MovieCard;