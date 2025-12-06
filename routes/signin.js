const express = require("express");
const router = express.Router();
const User = require("../models/users.models");

// GET /signin – show the sign in form
router.get("/signin", (req, res) => {
  res.render("signin", { message: "", session: req.session });
});

// POST /signin – handle sign in submit
router.post("/signin", async (req, res, next) => {
  const { username, password } = req.body;

  // basic validation
  if (!username || !password) {
    return res.render("signin", { message: "Both fields are required.", session: req.session });
  }

  try {
    // look up user in MongoDB
    const user = await User.findOne({ username: username.trim() }).exec();

    // if no user or wrong password
    if (!user || user.password !== password) {
      return res.render("signin", { message: "Invalid username or password.", session: req.session });
    }

    // success → store user info in session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName || user.username
    };

    // go to dashboard or workouts
    return res.redirect("/workouts");
  } catch (err) {
    console.error("Signin error:", err);
    return res.render("signin", { message: "Something went wrong.", session: req.session });
  }
});

// GET /signout – logout
router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/signin");
  });
});

module.exports = router;
