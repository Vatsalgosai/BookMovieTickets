import adminService from "../services/adminService.js";
import MovieTicket from "../models/MovieTicket.js";
import Movie from "../models/Movie.js";

const getMovies = async (req, res, next) => {
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

const bookMovieTicket = async (req, res, next) => {
  const movieId = req.params.movieId;
  const userId = req.userId;
  const seat = req.body.seat;
  const showTime = new Date(req.body.showTime);

  const movie = await Movie.findById(movieId);
  try {
    const releaseDate = movie.releaseDate;
    const currentDate = new Date();
    if (currentDate.getTime() < releaseDate.getTime()) {
      return res.status(422).json({
        message: "Can not booked Ticket Of Upcomming movies",
      });
    }
    const currentTime = Date.now();
    if (showTime.getTime() < currentTime) {
      return res.status(422).json({
        message: "show time is not available right now ",
      });
    }
    const showtimes = movie.shows;
    let seatValue;
    let index;
    for (let i = 0; i < showtimes.length; i++) {
      if (showTime.toString() == showtimes[i].time.toString()) {
        seatValue = showtimes[i];
        index = i;
      }
    }
    if (!seatValue) {
      return res.status(422).json({
        message: "Show is Not Available",
      });
    } else {
      if (seatValue.totalseat === 0) {
        return res.status(422).json({
          message: "Seats is not available",
        });
      }
      if (seatValue.seats[`${seat}`].seat === 0) {
        return res.status(422).json({
          message: "seat is not available",
        });
      }

      movie.shows[index].availableseats -= 1;
      movie.shows[index].seats[`${seat}`].seat -= 1;
      await movie.save();
      const movieTicket = new MovieTicket({
        movie: movie._id,
        showtime: showTime,
        user: userId,
        price: seatValue.seats[`${seat}`].price,
        seat: seat,
      });
      await movieTicket.save();
      res.status(422).json({
        message: "movie ticket is Booked successful",
        movietitle: movie.title,
        movieTicket: movieTicket,
      });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const cancelMovieTicket = async (req, res, next) => {
  const ticketId = req.params.ticketId;
  if (!ticketId) {
    res.status(422).json({
      message: "ticket Id is not found ",
    });
  }
  const movieticket = await MovieTicket.findById(ticketId);
  const movieId = movieticket.movie;
  const seat = movieticket.seat;
  const showTime = movieticket.showtime;

  try {
    let index;
    const movie = await Movie.findById(movieId);
    const showtimes = movie.shows;
    for (let i = 0; i < showtimes.length; i++) {
      if (showTime.toString() == showtimes[i].time.toString()) {
        index = i;
      }
    }
    console.log(index);
    movie.shows[index].availableseats += 1;
    movie.shows[index].seats[`${seat}`].seat += 1;
    await movie.save();
    await MovieTicket.findByIdAndDelete(ticketId);
    return res.status(204).json({
      message: "ticket Canceled Successful",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const getUpcomingMovies = async (req, res, next) => {
  const currentTime = new Date();
  const movies = await Movie.find({ releaseDate: { $gt: currentTime } }).sort({
    releaseDate: 1,
  });
  if (!movies) {
    res.status(402).json({
      message: "Movies Not Found",
    });
  } else {
    res.status(200).json({
      movies: movies,
    });
  }
};

const getCurrentMovieShortByShows = async (req, res, next) => {
  const currentTime = new Date();
  const movies = await Movie.find({ releaseDate: { $lte: currentTime } }).sort({
    "shows.time": 1,
  });
  if (!movies) {
    res.status(402).json({
      message: "Movies Not Found",
    });
  } else {
    res.status(200).json({
      movies: movies,
    });
  }
};
export default {
  getMovies,
  bookMovieTicket,
  cancelMovieTicket,
  getUpcomingMovies,
  getCurrentMovieShortByShows,
};
