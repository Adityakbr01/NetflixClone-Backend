const express = require("express");
const router = express.Router();
const Movie = require("../models/movie.model");

router.get("/editMovie", async (req, res) => {
  try {
    // Fetch all movies from the database
    const movies = await Movie.find();

    // Debugging: Log the fetched movies
    console.log("Fetched Movies:", movies);

    // Render the template and pass the movies data
    res.render("editmovieList", { Movies: movies }); // Ensure "Movies" matches the template variable
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching movies:", error);

    // Send a user-friendly response
    res.status(500).send("Internal Server Error. Please try again later.");
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    // Check if movie exists
    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    // Render template with movie details
    res.render("updatemovieDetails", { movie });
  } catch (error) {
    console.error("Error fetching movie details:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/update-movie/:id", async (req, res) => {
    try {
      // Find the movie by its ID and update the specified fields
      const updateMovie = await Movie.findByIdAndUpdate(
        req.params.id,  // Use `findByIdAndUpdate` for updating by ID
        {
          movieID: req.body.movieID,
          image: req.body.image,
          title: req.body.title,
          downloadLink: req.body.daunloadlink
        },
        { new: true } // Return the updated document
      );
  
      // Render the updated movie details
      res.render("updatemovieDetails", {
        movie: updateMovie,
        successMessage: "Movie update successful"
      });
    } catch (error) {
      console.error("Error updating movie details:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

module.exports = router;
