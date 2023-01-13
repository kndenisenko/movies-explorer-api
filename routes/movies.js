const router = require('express').Router();

const { getAllMovies, addMovie, deleteMovie } = require('../controllers/movies');
const { postMovies, deleteMovies } = require('../utils/moviesValidation');

router.get('/movies', getAllMovies);

router.post('/movies', postMovies, addMovie);

router.delete('/movies/:movieId', deleteMovies, deleteMovie);

module.exports = router;
