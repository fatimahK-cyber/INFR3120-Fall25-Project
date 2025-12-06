// ------------------- DEPENDENCIES -------------------
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
<<<<<<< HEAD
const passwordRoutes = require("./routes/password"); // adjust path


// LOAD ENV VARIABLES
=======
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const MicrosoftStrategy = require("passport-microsoft").Strategy;

// ------------------- ENV & MODELS -------------------
>>>>>>> 5b0261542fcea592f0f6b7a80ceedc11ee55ee86
require("dotenv").config();
const DB = require("./config/db");
const User = require("./models/users.models");

// ------------------- ROUTES -------------------
const signupRouter = require("./routes/signup");
const signinRouter = require("./routes/signin");
const signoutRouter = require("./routes/signout");
const indexRouter = require("./routes/index");
const workoutsRouter = require("./routes/workouts");
const profileRoutes = require("./routes/profile");
const passwordRoutes = require("./routes/password"); // adjust path if needed

// ------------------- APP SETUP -------------------
const app = express();

mongoose.connect(DB.URI);
const mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error:"));
mongoDB.once("open", () => console.log("Connected to MongoDB"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // for profile pics

// ------------------- SESSION -------------------
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

// Make session info available in EJS
app.use((req, res, next) => {
  if (req.user) {
    req.session.user = {
      _id: req.user._id,
      username: req.user.username,
      displayName: req.user.displayName,
      email: req.user.email,
    };
  }
  res.locals.session = req.session;
  next();
});

app.use("/",passwordRoutes);
 

// ROUTES
/*const signupRouter = require("./routes/signup");
const signinRouter = require("./routes/signin");
const signoutRouter = require("./routes/signout");
const indexRouter = require("./routes/index");
const workoutsRouter = require("./routes/workouts");*/

// USE ROUTES
app.use("/", signupRouter);
app.use("/", signinRouter);
app.use("/", signoutRouter);
app.use("/dashboard", indexRouter);
app.use("/workouts", workoutsRouter);
app.use(profileRoutes); // profile routes (they use /profile inside)
// ------------------- OAUTH ROUTES -------------------
// Google
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req, res) => res.redirect("/dashboard")
);

// GitHub
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/signin" }),
  (req, res) => res.redirect("/dashboard")
);

// Microsoft
app.get("/auth/microsoft", passport.authenticate("microsoft"));
app.get(
  "/auth/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/signin" }),
  (req, res) => res.redirect("/dashboard")
);

// ------------------- ROUTES -------------------
app.use("/", passwordRoutes);
app.use("/", indexRouter);
app.use("/workouts", workoutsRouter);
app.use("/", signinRouter);
app.use("/", signupRouter);
app.use(profileRoutes);

// ------------------- DASHBOARD ROUTE -------------------
app.get("/dashboard", (req, res) => {
  res.render("dashboard", { session: req.session });
});

// ------------------- HOME REDIRECT -------------------
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// ------------------- SERVER -------------------
app.listen(3000, () => {
  console.log("Workit running on http://localhost:3000");
});
