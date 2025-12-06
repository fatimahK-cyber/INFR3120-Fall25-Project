// ------------------- DEPENDENCIES -------------------
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

// ------------------- ENV & MODELS -------------------
require("dotenv").config();
const DB = require("./config/db");
const User = require("./models/users.models");

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

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ------------------- GOOGLE STRATEGY -------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
          user = new User({
            username: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            password: undefined, // OAuth users don't need a password
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// ------------------- GITHUB STRATEGY -------------------
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = new User({
            username: profile.username,
            displayName: profile.displayName || profile.username,
            githubId: profile.id,
            email: profile.emails?.[0]?.value || "",
            password: undefined, // OAuth users don't need a password
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);


//microsoft

const MicrosoftStrategy = require("passport-microsoft").Strategy;

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: process.env.MICROSOFT_CALLBACK_URL,
      scope: ["user.read", "openid", "profile", "email"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // fallback if email is not provided
        const email = profile.emails?.[0]?.value || `${profile.id}@microsoft.com`;

        let user = await User.findOne({ email });
        if (!user) {
          user = new User({
            username: profile.id,
            displayName: profile.displayName || profile.username || profile.id,
            email: email
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);


//microsoft routes

// Start Microsoft OAuth
app.get(
  "/auth/microsoft",
  passport.authenticate("microsoft")
);

// Callback
app.get(
  "/auth/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/signin" }),
  (req, res) => {
    res.redirect("/workouts");
  }
);



// ------------------- ROUTES -------------------
const indexRouter = require("./routes/index");
const workoutsRouter = require("./routes/workouts");
const signinRouter = require("./routes/signin");
const signupRouter = require("./routes/signup");



app.use("/", indexRouter);
app.use("/workouts", workoutsRouter);
app.use("/", signinRouter);
app.use("/", signupRouter);



// ------------------- GOOGLE OAUTH ROUTES -------------------
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req, res) => res.redirect("/dashboard")
);

// ------------------- GITHUB OAUTH ROUTES -------------------
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/signin" }),
  (req, res) => res.redirect("/dashboard")
);

// ------------------- HOME -------------------
app.get("/", (req, res) => {
  res.redirect("/dashboard");
});

// ------------------- SERVER -------------------
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
