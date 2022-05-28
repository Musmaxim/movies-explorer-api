const router = require('express').Router();
const routerMovies = require('./movies');
const routerUsers = require('./users');
const { validateUser, validateLogin } = require('../middlewares/validations');
const auth = require('../middlewares/auth');
const {
  login,
  createUser,
} = require('../controllers/users');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validateUser, createUser);

router.post('/signin', validateLogin, login);

router.use(auth);

router.use('/users', routerUsers);

router.use('/movies', routerMovies);

router.use(() => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
