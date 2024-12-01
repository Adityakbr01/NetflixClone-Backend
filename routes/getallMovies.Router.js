const express = require("express");
const router = express.Router();

const Movie = require("../models/movie.model");

router.get("/getMovies/:genreID?", async (req, res) => {
  try {
    const genraID = req.params.genreID;

    if (genraID) {
      if (genraID === "Netflix") {
        const movieByWatchProvider = await Movie.find({
          watchProviders: { $in: [genraID] },
        });
        res.json(movieByWatchProvider);
      } else {
        const movieByGenraID = await Movie.find({ genreIDS: genraID });
        res.json(movieByGenraID);
      }
    } else {
      const allMovies = await Movie.find();
      res.json(allMovies);
    }
  } catch (error) {
    console.error(error);

    res.status(500).send("Internal Server Error");
  }
});

router.get("/getsimilarMovies/:movieID", async (req, res) => {
  try {
    const { movieID } = req.params;
    const selectedMovie = await Movie.findById(movieID);
    if (!selectedMovie) {
      return res.status(400).json({ error: "Movie Not Found" });
    }

    const similarMovies = await Movie.find({
      genreIDS: { $in: selectedMovie.genreIDS },
      _id: { $ne: movieID },
    });

    res.status(200).json(similarMovies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Inernal Server Error");
  }
});

router.get("/searchMovies/:movieName", async (req, res) => {
  try {
    const { movieName } = req.params;
    const matchingmovies = await Movie.find({
      title: { $regex: new RegExp(movieName, "i") },
    });

    res.status(200).json(matchingmovies);
  } catch (error) {
    console.error(error);
    res.status(500).send("Inernal Server Error");
  }
});

module.exports = router;
