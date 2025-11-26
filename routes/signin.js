// routes/signin.js
const express = require("express");
const router = express.Router();
const User = require("../models/users.models");

// GET /signin – show the sign in form
router.get("/signin", (req, res) => {
  res.render("signin", { message: "" });
});

// POST /signin – handle sign in submit
router.post("/signin", async (req, res, next) => {
  const { username, password } = req.body;

  // LOG OUT ROUTE
router.get("/signout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/signin");
    });
});


  // basic validation
  if (!username || !password) {
    return res.render("signin", { message: "Both fields are required.", session: req.session });

  }

  try {
    // look up user in MongoDB
    const user = await User.findOne({ username: username.trim() }).exec();

    // if no user or wrong password
    if (!user || user.password !== password) {
      return res.render("signin", { message: "Invalid username or password." });
    }

    // success → store user info in session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    // go to dashboard or workouts
    return res.redirect("/workouts");   // or "/dashboard" if you prefer
  } catch (err) {
    console.error("Signin error:", err);
    return res.render("signin", { message: "Something went wrong." });
  }
});
//Signout route
router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/signin");
  });
});
 
module.exports = router;
