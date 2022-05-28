const router = require('express').Router();
const { validateMovie, validateMovieId } = require('../middlewares/validations');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateMovie, createMovie);
router.delete('/:Id', validateMovieId, deleteMovie);

module.exports = router;
