// ------------------- DEPENDENCIES -------------------
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const passwordRoutes = require("./routes/password"); // adjust path


// LOAD ENV VARIABLES
require('dotenv').config();

// IMPORT DB CONFIG
const DB = require('./config/db');

// ------------------- APP SETUP -------------------
const app = express();

mongoose.connect(DB.URI);
const mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
    console.log('Connected to MongoDB');
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// SERVE UPLOADED PROFILE PICTURES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SERVE UPLOADED PROFILE PICTURES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "workit-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// ------------------- PASSPORT -------------------
app.use(passport.initialize());
app.use(passport.session());

// After passport.session()
app.use((req, res, next) => {
  if (req.user) {
    req.session.user = {
      _id: req.user._id,
      username: req.user.username,
      displayName: req.user.displayName,
      email: req.user.email
    };
  }
  res.locals.session = req.session;
  next();
});




// Make session available in all EJS templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ROUTES
const signupRouter = require("./routes/signup");
const signinRouter = require("./routes/signin");
const signoutRouter = require("./routes/signout");
const indexRouter = require("./routes/index");
const workoutsRouter = require("./routes/workouts");
const signinRouter = require("./routes/signin");
const signupRouter = require("./routes/signup");



app.use("/", indexRouter);
app.use("/workouts", workoutsRouter);
app.use("/signin", signinRouter);
app.use("/signup", signupRouter);
app.use("/signout", signoutRouter);
app.use("/password", passwordRoutes);

// HOME PAGE ROUTE
app.get("/", (req, res) => {
    res.render("dashboard", { session: req.session });
});

// START SERVER
app.listen(3000, () => {
    console.log("Workit running on http://localhost:3000");
});
