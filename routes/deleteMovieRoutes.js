const express = require("express")
const router = express.Router();
const Movie = require("../models/movie.model")
const User = require("../models/user.model");
const movie = require("../models/movie.model");


router.get("/delete-movie",async(req,res)=>{
    try {
const movies = await Movie.find()
        res.render("deleteMovie",{movies})
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error")
    }
})

router.post("/delete-movie/:id", async (req, res) => {
    try {
      // Delete the movie from the Movie collection
      const deletedMovie = await Movie.findOneAndDelete({ _id: req.params.id });
  
      if (!deletedMovie) {
        return res.status(404).send("Movie not found");
      }
  
      // Remove the movie from all users' `mylist`
      await User.updateMany({}, { $pull: { mylist: req.params.id } });
  
      // Remove the movie from all users' `watchedMovies`
      await User.updateMany(
        {},
        { $pull: { watchedMovies: { movie: req.params.id } } }
      );
  
      // Fetch the updated list of movies to render
      const movies = await Movie.find();
  
      // Render the deleteMovie page with a success message
      res.render("deleteMovie", {
        movies,
        successMessage: "Movie deleted successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  


module.exports = router;