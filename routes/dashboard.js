const express = require("express");
const router = express.Router(); // Use Router for modular route definitions

// Middleware to check admin authentication
function isAdminAuthenticated(req, res, next) {
  // Call `req.isAuthenticated()` and ensure `req.user` exists
  if (req.isAuthenticated() && req.user?.isAdmin) {
    return next();
  }
  res.redirect("/admin/login"); // Redirect if not authenticated or not admin
}

// Route protected by the middleware
router.get("/", isAdminAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user }); // Pass user data for the dashboard
});

router.get("/addmovieRoute", isAdminAuthenticated, (req,res) => {
  res.render("addmovie");
});

router.get("/updatemovieRoute",isAdminAuthenticated,(req,res)=>{
res.redirect("/editMovie")
})

router.get("/deletemovieRoute",isAdminAuthenticated,(req,res)=>{
res.redirect("/delete-movie")
})

module.exports = router;
