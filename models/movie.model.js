const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  movieID: { type: String },
  backDropPath: { type: String },
  image: { type: String },
  budget: { type: Number },
  genres: { type: [String] },
  genreIDS: { type: [Number] },
  originTitle: { type: String },
  overview: { type: String },
  popularity: { type: Number },
  posterPath: { type: String },
  productionCompanies: { type: [String] },
  releaseDate: {
    type: {
      year: String,
      month: String,
      day: String,
    },
  },
  revenue: { type: Number },
  runTime: { type: Number },
  status: { type: String },
  title: { type: String },
  watchProviders: { type: [String] },
  logos: { type: String },
  downloadLink: { type: String },
  rating: { type: Number },
});

const movie = mongoose.model("movie", movieSchema);

module.exports = movie;
