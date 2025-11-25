const express = require("express");
const router = express.Router();
const User = require("../models/users.models.js");

// GET /signin – show the sign in form
router.get("/signin", (req, res) => {
  res.render("signin", { message: "" });
});

// POST /signin – handle sign in submit
router.post("/signin", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // look up user in MongoDB
    const user = await User.findOne({ username }).exec();

    // if no user or wrong password
    if (!user || user.password !== password) {
      return res.render("signin", { message: "Invalid username or password." });
    }

    // success → store user info in session
    req.session.user = {
      _id: user._id,
      username: user.username,
    };

    // go to dashboard or workouts
    res.redirect("/dashboard"); // or "/" or "/workouts"
  } catch (err) {
    next(err);
  }
});

module.exports = router;
