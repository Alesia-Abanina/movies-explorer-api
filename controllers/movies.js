const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const WrongUserError = require('../errors/wrong-user-err');
const getError = require('../errors/error-handler');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies.reverse()))
    .catch((err) => next(getError(err)));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send(movie))
    .catch((err) => next(getError(err)));
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      } else if (String(movie.owner._id) !== req.user._id) {
        throw new WrongUserError('Можно удалять только собственные фильмы');
      }

      Movie.findByIdAndRemove(req.params.movieId)
        .then((removedMovie) => {
          if (!removedMovie) {
            throw new NotFoundError('Фильм с указанным _id не найден');
          }
          res.send({ message: 'Фильм удалён' });
        });
    })
    .catch((err) => next(getError(err)));
};
