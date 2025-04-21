import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton
} from '@mui/material';
import { useMovieSearch } from './hooks/useMovieSearch';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Create a theme context
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  const { query, setQuery, movies, loading, error, handleSearch } = useMovieSearch();
  const [mode, setMode] = React.useState('light');

  // Create a toggle for dark/light mode
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  // Create theme based on mode
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode colors
                primary: {
                  main: '#3a7bd5',
                },
                secondary: {
                  main: '#00d2ff',
                },
                background: {
                  default: '#f5f7fa',
                  paper: '#ffffff',
                },
              }
            : {
                // Dark mode colors
                primary: {
                  main: '#3a7bd5',
                },
                secondary: {
                  main: '#00d2ff',
                },
                background: {
                  default: '#121212',
                  paper: '#1e1e1e',
                },
                text: {
                  primary: '#ffffff',
                  secondary: 'rgba(255, 255, 255, 0.7)',
                },
              }),
        },
        typography: {
          fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
          h3: {
            fontWeight: 600,
            letterSpacing: '-0.5px',
          },
        },
        shape: {
          borderRadius: 12,
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4
          }}>
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #3a7bd5, #00d2ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
            >
              AI Movie Search
            </Typography>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
          
          <SearchBar 
            query={query}
            setQuery={setQuery}
            loading={loading}
            handleSearch={handleSearch}
          />
          
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ marginBottom: 24 }}
              >
                <Typography 
                  color="error" 
                  align="center"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255,0,0,0.1)' 
                      : 'rgba(255,0,0,0.05)'
                  }}
                >
                  {error}
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
          
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 8 
            }}>
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: "linear"
                }}
              >
                <img 
                  src="/movie-reel.svg" 
                  alt="Loading" 
                  width="80" 
                  height="80" 
                />
              </motion.div>
            </Box>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, 
                gap: 4,
                mt: 4
              }}>
                <AnimatePresence>
                  {movies.map((movie) => (
                    <motion.div
                      key={movie.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MovieCard movie={movie} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
              
              {movies.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: 'center', marginTop: '40px' }}
                >
                  <Typography variant="h6" color="textSecondary">
                    No movies found. Try a different search.
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Suggestions: "space adventure", "funny comedies", "classic dramas"
                  </Typography>
                </motion.div>
              )}
            </motion.div>
          )}
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;