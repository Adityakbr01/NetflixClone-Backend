require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { json } = require("body-parser");
const { parse } = require("dotenv");
const router = express.Router();
const movie = require("../models/movie.model");

// Endpoint to fetch movie list based on search term
router.post("/fetchMovie", async (req, res) => {
  const searchTerm = req.body.searchTerm; // Movie name from the request body
  console.log("Search Term:", searchTerm);

  const apiKey = "cf0c849be3mshe7fea6679ca4cebp1cfce8jsn221d53500e9f"; // Your RapidAPI key
  const apiHost = "imdb8.p.rapidapi.com"; // IMDb API host

  try {
    const options = {
      method: "GET",
      url: `https://${apiHost}/title/find?q=${encodeURIComponent(searchTerm)}`,
      headers: {
        "X-RapidAPI-Key": process.env.IMDBRAPID_KEY,
        "X-RapidAPI-Host": apiHost,
      },
    };

    // Make the API request
    const response = await axios.request(options);
    const data = response.data;

    // Check if movies are found
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: "No movies found with this name" });
    }

    // Send the response to the template
    res.render("addmovie", { movielist: data.results });
    // res.status(200).json({data:data.results})
    console.log(data.results[0].id);
  } catch (error) {
    console.error("Error fetching movie details:", error.message);

    if (error.response) {
      console.error("API Error:", error.response.data);
      return res
        .status(error.response.status)
        .json({ error: error.response.data.message || "API Error" });
    } else if (error.request) {
      console.error("No response received from API");
      return res.status(500).json({ error: "No response from IMDb API" });
    } else {
      console.error("Error Setting up Request:", error.message);
      return res.status(500).json({ error: "Failed to fetch movie details" });
    }
  }
});

// Endpoint to fetch movie details by IMDb ID
router.get(`/addmovie/title/:movieId`, async (req, res) => {
  const movieId = req.params.movieId; // Get IMDb ID from the URL
  console.log(movieId); // Log the movie ID for debugging

  const apiHost = "imdb8.p.rapidapi.com"; // IMDb API host

  try {
    // Correct API request format
    const options = {
      method: "GET",
      url: `https://${apiHost}/title/v2/get-details`, // Full URL
      params: {
        tconst: movieId, // tconst is the IMDb ID (e.g., tt0120338)
        country: "US",
        language: "en-US",
      },
      headers: {
        "x-rapidapi-key": process.env.IMDBRAPID_KEY,
        "x-rapidapi-host": apiHost,
      },
    };

    // Make the API request to fetch movie details
    const response = await axios.request(options);
    const movieDetails = response.data;

    // Check if movie details are returned
    if (movieDetails) {
      // If data is valid, format it and send to the template
      const movieDetailsData = {
        title: movieDetails.data.title.titleText.text,
        releaseYear: movieDetails.data.title.releaseYear.year,
        releaseDate: movieDetails.data.title.releaseDate,
        categories: movieDetails.data.title.titleType.categories[0],
        runtime: movieDetails.data.title.runtime.seconds,
        primaryImage: movieDetails.data.title.primaryImage.url,
        movieID: movieDetails.data.title.id,
      };

      // Render the movie details view with the formatted data
      console.log(movieDetails);
      res.render("moviedetails", movieDetailsData);
      // res.json(movieDetails)
    } else {
      // If no movie found, send a 404 error
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (error) {
    console.error("Error fetching movie details:", error.message);

    if (error.response) {
      console.error("API Error:", error.response.data);
      return res
        .status(error.response.status)
        .json({ error: error.response.data.message || "API Error" });
    } else if (error.request) {
      console.error("No response received from API");
      return res.status(500).json({ error: "No response from IMDb API" });
    } else {
      console.error("Error setting up request:", error.message);
      return res.status(500).json({ error: "Failed to fetch movie details" });
    }
  }
});

router.post("/add-movie-detail", async (req, res) => {
  try {
    const movieDetail = req.body;
    console.log("Received movie details:", movieDetail.title);
    const movieDetailsData = {
      title: movieDetail.title,
      releaseYear: movieDetail.releaseYear,
      releaseDate: movieDetail.releaseDate,
      categories: movieDetail.categories,
      runtime: movieDetail.runtime,
      primaryImage: movieDetail.primaryImage,
      movieID: movieDetail.movieID,
    };
    console.log(movieDetailsData);

    // Check if the movie already exists in the database
    const existingMovie = await movie.findOne({ movieID: movieDetail.movieID });
    if (existingMovie) {
      console.log(
        `Movie with movie ID: ${movieDetail.movieID} already exists. Skipping...`
      );
      return res.status(400).json({
        error: `Movie with movieID ${movieDetail.movieID} already exists. Skipping...`,
      });
    }

    // Create a new movie object
    const newMovie = new movie({
      movieID: movieDetail.movieID,
      title: movieDetail.title,
      image: movieDetail.primaryImage || "", // Fallback to an empty string if not provided
      downloadLink: movieDetail.daunloadlink || "", // Handle missing download link
      runTime: movieDetail.runtime || null, // Handle optional fields
      releaseDate : movieDetail.releaseDate,
    });

    // Save the movie to the database
    const savedMovie = await newMovie.save();
    console.log(`Movie saved successfully: ${savedMovie.title}`);

    // Render success response
    res.redirect("/");
  } catch (error) {
    console.error("Error while saving movie details:", error);

    // Send error response
    res.status(500).json({
      error: "An error occurred while saving the movie details.",
      details: error.message,
    });
  }
});

module.exports = router;
