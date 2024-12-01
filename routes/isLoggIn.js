function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) { // Correct method for passport.js
    return next();
  }
  res.status(401).json({ success: false, message: "Unauthorized" });
}

module.exports = isLoggedIn;
