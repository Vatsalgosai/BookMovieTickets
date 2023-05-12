import Movie from "../models/Movie.js";
import adminService from "../services/adminService.js";

const saveMovie = async (req, res, next) => {
  try {
    const {
      title,
      releaseDate,
      castName,
      directorsName,
      choreographers,
      shows,
    } = req.body;

    const date = new Date(releaseDate);
    const movie = new Movie({
      title: title,
      releaseDate: date,
      castName: castName,
      directorsName: directorsName,
      choreographers: choreographers,
      createdBy: req.userId,
      shows: shows,
    });
    for (let i = 0; i < shows.length; i++) {
      movie.shows[i].totalseat =
        movie.shows[i].seats.gold.seat +
        movie.shows[i].seats.silver.seat +
        movie.shows[i].seats.platinum.seat;
      movie.shows[i].availableseats = movie.shows[i].totalseat;
    }

    const movieData = await adminService.createMovie(movie);

    res.status(201).json({
      message: "Movie create successful",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const findAllMovie = async (req, res, next) => {
  try {
    const movies = await adminService.findAllMovie();
    if (movies) {
      res.status(200).json({
        movies: movies,
      });
    } else {
      const err = new Error("Movies Not Found");
      err.statusCode = 404;
      throw err;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const updateMovie = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const {
      title,
      releaseDate,
      castName,
      directorsName,
      choreographers,
      shows,
    } = req.body;
    const movie = await adminService.findById(movieId);

    if (!movie) {
      const err = new Error("Movie Not Found");
      err.statusCode = 404;
      throw err;
    }
    const date = new Date(releaseDate);
    movie.title = title;
    movie.releaseDate = date;
    movie.castName = castName;
    movie.directorsName = directorsName;
    movie.choreographers = choreographers;
    movie.createdBy = req.userId;
    movie.shows = shows;

    const movieData = await adminService.createMovie(movie);

    res.status(202).json({
      message: "Movie Updated successful",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const findById = async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movie = await adminService.findById(movieId);
    if (!movie) {
      const err = new Error("Movie Not found");
      err.statusCode = 404;
      throw err;
    } else {
      return res.status(200).json({
        movie: movie,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  const movieId = req.params.id;
  try {
    const result = await adminService.deleteById(movieId);
    if (!result) {
      const err = new Error("Movie not found");
      err.statusCode = 404;
      throw err;
    } else {
      return res.status(204).json({
        message: "Movie Deleted Successful",
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
export default { saveMovie, findAllMovie, updateMovie, findById, deleteMovie };
