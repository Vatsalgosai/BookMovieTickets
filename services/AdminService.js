import Movie from "../models/Movie.js";

const createMovie = async (movievalue) => {
  try {
    const movieData = await movievalue.save();
    return movieData;
  } catch (err) {
    throw new Error(err);
  }
};

const findAllMovie = async () => {
  try {
    const movies = await Movie.find();
    return movies;
  } catch (err) {
    throw new Error(err);
  }
};

const findById = async (movieId) => {
  try {
    const movieValue = await Movie.findById(movieId);
    return movieValue;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteById = async (movieId) => {
  try {
    const result = await Movie.findByIdAndDelete(movieId);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};
export default { createMovie, findAllMovie, findById, deleteById };
