import mongoose from "mongoose";

const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  releaseDate: {
    type: Date,
    required: true,
  },

  castName: {
    type: [String],
    required: true,
  },

  directorsName: {
    type: [String],
    required: true,
  },

  choreographers: {
    type: [String],
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  shows: [
    {
      time: {
        type: Date,
        required: true,
      },
      totalseat: {
        type: Number,
        required: true,
      },
      availableseats: {
        type: Number,
        required: true,
      },
      seats: {
        gold: {
          price: {
            type: Number,
            required: true,
          },
          seat: {
            type: Number,
            required: true,
          },
        },
        silver: {
          price: {
            type: Number,
            required: true,
          },
          seat: {
            type: Number,
            required: true,
          },
        },
        platinum: {
          price: {
            type: Number,
            required: true,
          },
          seat: {
            type: Number,
            required: true,
          },
        },
      },
    },
  ],
});

export default mongoose.model("Movie", movieSchema);
