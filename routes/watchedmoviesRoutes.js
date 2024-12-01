const express = require("express");
const router = express.Router();
const isLoggedIn = require("../routes/isLoggIn");
const Movie = require("../models/movie.model");

router.post("/update-watched-time/:movieId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const movieId = req.params.movieId;
    const watchedTime = req.body.watchedTime;

    // Find if the movie already exists in the watchedMovies array
    const movieToUpdate = user.watchedMovies.find((item) =>
      item.movie.equals(movieId)
    );

    if (movieToUpdate) {
      // Update watched time if the movie already exists
      movieToUpdate.watchedTime = watchedTime;

      const movieDetails = await Movie.findById(movieId);
      if (movieDetails) {
        // Update uploadTime if movie details are found
        movieToUpdate.uploadTime = Date.now();
      }
    } else {
      // If movie does not exist, push it into the watchedMovies array
      const movieDetails = await Movie.findById(movieId);
      if (movieDetails) {
        user.watchedMovies.push({
          movie: movieId,
          watchedTime: watchedTime,
          uploadTime: Date.now(),
        });
      }
    }

    // Save the updated user data
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/remove-watched-movie/:movieId", async (req, res) => {
  try {
    const user = req.user;
    const movieIdToRemove = req.params.movieId;
    const movieIndexToRemove = user.watchedMovies.findIndex((item) =>
      item.movie.equals(movieIdToRemove)
    );

    if (movieIndexToRemove !== -1) {
      user.watchedMovies.splice(movieIndexToRemove, 1);
      await user.save();
      res.json({
        success: true,
        message: "Movie removed from watched list succsessfully",
      });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Movie not found in wathed list!" });
    }
  } catch (error) {
    res.status(500).json({ success: true, error: error.message });
  }
});

router.post("/remove-all-watcheds-movies", async (req, res) => {
  try {
    const user = req.user;
    //clear the watchedmovies array
    user.watchedMovies = [];
    await user.save();

    res.json({
      success: true,
      message: "All watched movies removed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/watched-time/:movieId", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const movieId = req.params.movieId;

    // Find the movie in the user's watchedMovies list and retrieve the watched time
    const movieWatchTime = user.watchedMovies.find((item) =>
      item.movie.equals(movieId)
    );

    if (movieWatchTime) {
      // Movie found, return the watchedTime
      res.json({ success: true, watchedTime: movieWatchTime.watchedTime });
    } else {
      // Movie not found, return watchedTime as 0
      res.json({ success: true, watchedTime: 0 });
    }
  } catch (error) {
    // Handle errors
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/watched-movies", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;
    const watchedMovies = await Promise.all(
      user.watchedMovies.map(async ({ movie, watchedTime, uploadTime }) => {
        const movieDetails = await Movie.findById(movie);

        return {
          movie: movieDetails,
          watchedTime,
          uploadTime,
        };
      })
    );
    watchedMovies.sort((a, b) => b.uploadTime - a.uploadTime);

    res.json({success:true,watchedMovies})
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});




module.exports = router;


//Ye bhi use kar sakte ho //gpt

/*router.get("/watched-movies", isLoggedIn, async (req, res) => {
  try {
    const user = req.user;

    // Fetch details for each watched movie and prepare the response
    const watchedMovies = await Promise.all(
      user.watchedMovies.map(async ({ movie, watchedTime, uploadTime }) => {
        const movieDetails = await Movie.findById(movie);

        // Ensure movieDetails exists before including it in the response
        if (movieDetails) {
          return {
            movie: movieDetails,
            watchedTime,
            uploadTime,
          };
        }
        return null;
      })
    );

    // Filter out null entries (in case a movie doesn't exist in the database)
    const filteredWatchedMovies = watchedMovies.filter((movie) => movie !== null);

    // Sort movies by uploadTime in descending order
    filteredWatchedMovies.sort((a, b) => b.uploadTime - a.uploadTime);

    // Send the response
    res.json({ success: true, watchedMovies: filteredWatchedMovies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
*/