import mongoose from "mongoose";

const Schema = mongoose.Schema;

const movieTicket = new Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  showtime: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seat: {
    type: String,
    required: true,
  },
});

export default mongoose.model("MovieTicket", movieTicket);
