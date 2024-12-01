const express = require("express");
const router = express.Router();
const isLoggedIn = require("./isLoggIn");
const Movie = require("../models/movie.model");

router.post("/add-to-mylist/:movieId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;

    // Check if the movie is already in the user's mylist
    if (user.mylist.includes(req.params.movieId)) {
      return res
        .status(400)
        .json({ success: false, message: "Movie already in your list" });
    }

    // Add the movie to the mylist
    user.mylist.push(req.params.movieId);
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error adding to mylist:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/remove-to-mylist/:movieId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const Id = req.params.movieId;

    // Check if the movie is in the user's mylist
    if (!user.mylist.includes(Id)) {
      return res
        .status(400)
        .json({ success: false, message: "Movie not found in your list" });
    }

    // Remove the movie from the mylist
    user.mylist = await user.mylist.filter((movieId) => movieId != Id);
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error removing from mylist:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/mylist", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const moviesInMyList = await Movie.find({ _id: { $in: user.mylist } });
    res.json({ success: true, moviesInMyList });
  } catch (error) {
    console.error("Error from mylist:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
