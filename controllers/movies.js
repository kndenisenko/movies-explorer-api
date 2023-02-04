const Movie = require('../models/movies');
const { NoFoundError } = require('../errors/NoFoundError');
const { NoPermissionError } = require('../errors/NoPermissionError');
const { ConflictError } = require('../errors/ConflictError');
const { ValidationError } = require('../errors/ValidationError');
const { CastError } = require('../errors/CastError');

// Получить список фильмов из БД
module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => next(err));
};

// Добавить фильм в БД
module.exports.addMovie = (req, res, next) => {
  const {
    movieId,
  } = req.body;

  Movie.findOne({ movieId: `${movieId + req.user._id}` })
    .then((item) => {
      if (!item) {
        Movie.create({ ...req.body, owner: req.user._id })
          .then((movie) => {
            res.status(201).send(movie);
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new ValidationError('400 - Переданы некорректные данные при создании фильма'));
            }
            next(err);
          });
      } else {
        next(new ConflictError('409 - Такой фильм уже существует'));
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
        throw new NoPermissionError('403 — Нельзя удалять чужие фильмы');
      }
    })
    .catch((err) => {
      if (err.message === 'NoFoundError') {
        next(new NoFoundError('404 - Фильм с указанным id не найден'));
      } else if (err.name === 'CastError') {
        next(new CastError('400 - Передан неверный id'));
      } else {
        next(err);
      }
    });
};
