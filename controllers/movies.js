const Movie = require('../models/movies');
const { NotFoundError } = require('../errors/NotFoundError');
const { NoPermissionError } = require('../errors/NoPermissionError');
const { ConflictError } = require('../errors/ConflictError');
const { ValidationError } = require('../errors/ValidationError');
const { CastError } = require('../errors/CastError');
const { constants } = require('../const/const');

// Получить список фильмов из БД только от текущего юзера
module.exports.getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }) // owner: req.user._id - опредееляет текущуего юзера
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => next(err));
};

// Добавить фильм в БД
module.exports.addMovie = (req, res, next) => {
  // const {
  //   country,
  //   director,
  //   duration,
  //   year,
  //   description,
  //   image,
  //   trailerLink,
  //   nameRU, nameEN,
  //   thumbnail,
  //   movieId,
  // } = req.body;

  Movie.findOne({ ...req.body, owner: req.body.movieId + req.user._id })
    .then((item) => {
      if (!item) {
        Movie.create({ ...req.body, owner: req.body.movieId + req.user._id })
          .then((movie) => {
            res.status(201).send(movie);
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new ValidationError(constants.MOVIE_VALIDATION_FAILED));
            }
            next(err);
          });
      } else {
        next(new ConflictError(constants.MOVIE_ALREADY_CREATED));
      }
    })
    .catch((err) => {
      next(err);
    });
};

// Удалить фильм из БД
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new Error('NoValidId'))
    .then(async (movie) => {
      if (movie.owner.toHexString() === req.user._id) {
        await Movie.findByIdAndRemove(req.params.movieId);
        res.status(200).send({ message: 'Фильм удален' });
      } else {
        throw new NoPermissionError(constants.CANT_DELETE_OTHER_MOVIES);
      }
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        next(new NotFoundError(constants.ID_NOT_FOUND));
      } else if (err.name === 'CastError') {
        next(new CastError(constants.MOVIE_ID_VALIDATION_FAILED));
      } else {
        next(err);
      }
    });
};
