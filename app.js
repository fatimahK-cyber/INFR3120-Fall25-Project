// IMPORT EXPRESS AND OTHER DEPENDENCIES
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const passwordRoutes = require("./routes/password"); // adjust path


// LOAD ENV VARIABLES
require("dotenv").config();

// IMPORT DB CONFIG
const DB = require("./config/db");

// IMPORT ROUTES
const signupRouter = require("./routes/signup");
const signinRouter = require("./routes/signin");
const signoutRouter = require("./routes/signout");
const indexRouter = require("./routes/index");
const workoutsRouter = require("./routes/workouts");
const profileRoutes = require("./routes/profile"); // profile routes

// CREATE APP
const app = express();

// TEST DB CONNECTION
mongoose.connect(DB.URI);

const mongoDB = mongoose.connection;
mongoDB.on("error", console.error.bind(console, "Connection Error:"));
mongoDB.once("open", () => {
  console.log("Connected to MongoDB");
});

// CONFIGURE VIEW ENGINE (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// BODY PARSER (needed for forms)
app.use(express.urlencoded({ extended: true }));

// SERVE STATIC FILES (CSS, images)
app.use(express.static(path.join(__dirname, "public")));

// SERVE UPLOADED PROFILE PICTURES
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SESSION CONFIG
app.use(
  session({
    secret: "workit-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// MAKE SESSION AVAILABLE IN EJS
app.use((req, res, next) => {
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

// HOME PAGE ROUTE
app.get("/", (req, res) => {
  res.render("dashboard", { session: req.session });
});

// START SERVER
app.listen(3000, () => {
  console.log("Workit running on http://localhost:3000");
});
