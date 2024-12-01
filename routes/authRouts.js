const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.model");

router.get("/docs", (req, res) => {
  res.json({
    "message": "API Documentation",
    "endpoints": [
      {
        "method": "GET",
        "path": "/",
        "description": "Check if the API is running."
      },
      {
        "method": "POST",
        "path": "/register",
        "description": "Register a new user.",
        "body": {
          "username": "string (required)",
          "password": "string (required)",
          "isAdmin": "boolean (optional, default: false)"
        },
        "response": {
          "success": "boolean",
          "user": "User object (if success is true)",
          "error": "string (if success is false)"
        }
      },
      {
        "method": "POST",
        "path": "/login",
        "description": "Login a user.",
        "body": {
          "username": "string (required)",
          "password": "string (required)"
        },
        "response": {
          "success": "boolean",
          "user": "User object (if success is true)",
          "message": "string (if success is false)",
          "error": "string (if any server-side error occurs)"
        }
      },
      {
        "method": "GET",
        "path": "/isAuthenticate",
        "description": "Check if the current user is authenticated.",
        "response": {
          "authenticated": "boolean (true if user is authenticated)",
          "user": "User object (if authenticated)"
        }
      },
      {
        "method": "POST",
        "path": "/fetchMovie",
        "description": "Fetch a list of movies based on a search term.",
        "body": {
          "searchTerm": "string (required) - The name of the movie to search for"
        },
        "response": {
          "success": "boolean",
          "movielist": "Array of movie objects (if success is true)",
          "error": "string (if no movies are found)"
        },
        "example": {
          "request": {
            "searchTerm": "Inception"
          },
          "response": {
            "success": true,
            "movielist": [
              {
                "id": "tt1375666",
                "title": "Inception",
                "year": 2010,
                "genres": ["Action", "Adventure", "Sci-Fi"]
              }
            ]
          }
        }
      },
      {
        "method": "GET",
        "path": "/addmovie/title/:movieId",
        "description": "Fetch movie details along with watch providers by IMDb ID (tconst).",
        "params": {
          "movieId": "string (required) - The IMDb movie ID (e.g., tt1375666)"
        },
        "response": {
          "movieDetails": "Object containing detailed information about the movie.",
          "watchProviders": "Array of watch provider links for the movie."
        },
        "example": {
          "request": {
            "movieId": "tt1375666"
          },
          "response": {
            "movieDetails": {
              "id": "tt1375666",
              "title": "Inception",
              "year": 2010,
              "genres": ["Action", "Adventure", "Sci-Fi"]
            },
            "watchProviders": [
              {
                "provider": "Netflix",
                "url": "https://www.netflix.com/watch/1375666"
              }
            ]
          }
        }
      },
      {
        "method": "POST",
        "path": "/add-movie-detail",
        "description": "Add movie details to the database if they don't already exist.",
        "body": {
          "movieID": "string (required) - The IMDb movie ID (e.g., tt1375666)",
          "title": "string (required) - Title of the movie",
          "primaryImage": "string (optional) - URL of the movie's primary image",
          "releaseYear": "number (required) - Release year of the movie",
          "releaseDate": "string (required) - Release date of the movie",
          "categories": "array (optional) - List of categories or genres",
          "runtime": "number (optional) - Runtime of the movie in seconds",
          "downloadLink": "string (optional) - Download link for the movie"
        },
        "response": {
          "success": "boolean - Indicates if the operation was successful",
          "message": "string - Success or error message",
          "data": "Object containing saved movie details (if successful)"
        },
        "example": {
          "request": {
            "movieID": "tt1375666",
            "title": "Inception",
            "primaryImage": "https://image.url/inception.jpg",
            "releaseYear": 2010,
            "releaseDate": "2010-07-16",
            "categories": ["Action", "Adventure", "Sci-Fi"],
            "runtime": 8880,
            "downloadLink": "https://downloadlink.com/inception"
          },
          "response": {
            "success": true,
            "message": "Movie saved successfully",
            "data": {
              "movieID": "tt1375666",
              "title": "Inception",
              "primaryImage": "https://image.url/inception.jpg",
              "releaseYear": 2010,
              "releaseDate": "2010-07-16",
              "categories": ["Action", "Adventure", "Sci-Fi"],
              "runtime": 8880,
              "downloadLink": "https://downloadlink.com/inception"
            }
          }
        }
      },
      {
        "method": "GET",
        "path": "/addmovie/title/:movieId",
        "description": "Fetch movie details by IMDb ID (tconst) and render a view with the data.",
        "params": {
          "movieId": "string (required) - The IMDb movie ID (e.g., tt1375666)"
        },
        "response": {
          "success": "boolean - Indicates if the operation was successful",
          "message": "string - Success or error message",
          "data": {
            "movieDetails": {
              "title": "string - Movie title",
              "releaseYear": "number - Release year of the movie",
              "releaseDate": "string - Release date of the movie",
              "categories": "string - Primary category/genre of the movie",
              "runtime": "number - Runtime in seconds",
              "primaryImage": "string - URL of the movie's primary image",
              "movieID": "string - IMDb movie ID"
            }
          }
        },
        "example": {
          "request": {
            "params": {
              "movieId": "tt1375666"
            }
          },
          "response": {
            "success": true,
            "message": "Movie details fetched successfully",
            "data": {
              "movieDetails": {
                "title": "Inception",
                "releaseYear": 2010,
                "releaseDate": "2010-07-16",
                "categories": "Sci-Fi",
                "runtime": 8880,
                "primaryImage": "https://image.url/inception.jpg",
                "movieID": "tt1375666"
              }
            }
          }
        }
      },{
        "method": "POST",
        "path": "/fetchMovie",
        "description": "Search for movies by title using IMDb API and render results to the template.",
        "params": {
          "searchTerm": "string (required) - The name of the movie to search for."
        },
        "response": {
          "success": "boolean - Indicates if the operation was successful.",
          "message": "string - Success or error message.",
          "data": {
            "movielist": [
              {
                "id": "string - IMDb movie ID (e.g., tt1375666)",
                "title": "string - Title of the movie.",
                "year": "number - Release year of the movie.",
                "image": "string - URL of the movie's primary image.",
                "titleType": "string - Type of the title (e.g., movie, series)."
              }
            ]
          }
        },
        "example": {
          "request": {
            "body": {
              "searchTerm": "Inception"
            }
          },
          "response": {
            "success": true,
            "message": "Movies found successfully.",
            "data": {
              "movielist": [
                {
                  "id": "tt1375666",
                  "title": "Inception",
                  "year": 2010,
                  "image": "https://image.url/inception.jpg",
                  "titleType": "movie"
                },
                {
                  "id": "tt1234567",
                  "title": "Inception 2",
                  "year": 2023,
                  "image": "https://image.url/inception2.jpg",
                  "titleType": "movie"
                }
              ]
            }
          }
        }
      },{
        "functionName": "isAdminAuthenticated",
        "description": "Middleware to ensure the user is authenticated and has admin privileges before accessing protected routes.",
        "parameters": {
          "req": "Express request object, containing user session data and authentication state.",
          "res": "Express response object, used for redirection in case of unauthorized access.",
          "next": "Express next function, called to proceed to the next middleware or route handler if authentication passes."
        },
        "logic": {
          "checkAuthentication": "Uses `req.isAuthenticated()` to verify if the user is logged in.",
          "checkAdminPrivileges": "Ensures `req.user` exists and the `isAdmin` property is true.",
          "proceedOnSuccess": "Calls `next()` if the user is authenticated and has admin privileges.",
          "redirectOnFailure": "Redirects to '/admin/login' if authentication or admin check fails."
        },
        "exampleUsage": {
          "route": {
            "path": "/admin/dashboard",
            "method": "GET",
            "middleware": ["isAdminAuthenticated"],
            "handler": "Renders the admin dashboard if the user passes authentication."
          }
        },
        "exampleImplementation": {
          "code": "router.get('/admin/dashboard', isAdminAuthenticated, (req, res) => { res.render('adminDashboard'); });"
        }
      },
      

      
      
      
    ]
  }
  );
});

router.post("/register", async (req, res) => {
  try {
    const isAdmin = req.body.isAdmin === true;
    const user = await User.register(
      new User({ username: req.body.username, isAdmin }),
      req.body.password
    );
    passport.authenticate("local")(req, res, () => {
      res.json({ success: true, user });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!user) {
      return res.json({ success: false, message: "Authentication failed" });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .json({ success: false, error: loginErr.message });
      }
      return res.json({ success: true, user });
    });
  })(req, res, next);
});

router.get("/isAuthenticate", (req, res) => {
  console.log("User Authenticated:", req.isAuthenticated());
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false, user: null });
  }
});

router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.json({ success: true });
  });
});

//Admin

router.get("/admin/register", (req, res) => {
  res.render("adminRegister");
});
router.post("/admin/register", async (req, res) => {
    try {
      const secretCode = req.body.secretCode;
  
      // Check secret code validity
      if (secretCode !== "abcd") {
        return res.render("adminRegister", {
          errorMessage: "Invalid secret code",
        });
      }
  
      const isAdmin = true;
  
      // Register the user
      const user = await User.register(
        new User({ username: req.body.username, isAdmin }),
        req.body.password
      );
  
      // Authenticate and log the user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).render("adminRegister", {
            errorMessage: "Error logging in after registration.",
          });
        }
        return res.redirect("/admin/login"); // Change this to the appropriate post-login route
      });
    } catch (error) {
      return res.status(500).render("adminRegister", {
        errorMessage: error.message,
      });
    }
  });
  
router.get("/admin/login", (req, res) => {
  res.render("adminLogin");
});

router.post("/admin/login", async(req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!user) {
      return res.render("adminLogin", {
        errorMessage: "Authentication failed",
      });
    }
    if (!user.isAdmin) {
      return res.render("adminLogin", { errorMessage: "You are not an admin" });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return res
          .status(500)
          .json({ success: false, error: loginErr.message });
      }
      res.redirect("/")
    });
  })(req, res, next);
});

router.get("/admin/logout",(req,res)=>{
  req.logOut(err=>{
    if(err){
      return res.json({success:false,error:err.message})
    }
  })
})

module.exports = router;
