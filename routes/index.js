const express = require("express");
const router = express.Router();
const passport = require("passport");



// Middleware to require login
function requireLogin(req, res, next) {
  if (!req.user) return res.redirect("/signin");
  next();
}

// Dashboard
router.get("/dashboard", requireLogin, (req, res) => {
  res.render("dashboard"); // You can pass session automatically
});



// ------------------- GOOGLE LOGIN -------------------
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req, res) => {
    res.redirect("/workouts"); // after successful login
  }
);

// ------------------- GITHUB LOGIN -------------------
router.get("/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/signin" }),
  (req, res) => {
    res.redirect("/workouts"); // after successful login
  }
);

// SIGNOUT
router.get("/signout", (req, res) => {
  req.logout(() => {
    res.redirect("/signin");
  });
});

module.exports = router;
