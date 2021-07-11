const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateLogin, validateCreateUser } = require('../utils/user-validators');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);
router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use(() => {
  throw new NotFoundError('Ресурс не найден. Проверьте URL и метод запроса');
});

module.exports = router;
