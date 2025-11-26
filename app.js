// IMPORT EXPRESS (from MEAN slides)
const express = require("express");
const path = require("path");
let mongoose = require('mongoose');
let DB = require('./config/db');
const session = require("express-session");




// CREATE APP
const app = express();

//test DB connection
mongoose.connect(DB.URI);
let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
    console.log('Connected to MongoDB');
});



// CONFIGURE VIEW ENGINE (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// BODY PARSER (needed for forms)
app.use(express.urlencoded({ extended: true }));



// SERVE STATIC FILES (CSS, images)
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "workit-secret",   // any string
    resave: false,
    saveUninitialized: false,
  })
);

// IMPORT SIGNUP ROUTES
const signupRouter = require("./routes/signup");
app.use("/",signupRouter);

//signin routes 
const signinRouter = require("./routes/signin");
app.use("/", signinRouter);



// IMPORT WORKOUT ROUTES
const indexRouter = require("./routes/index");
// IMPORT WORKOUT ROUTES
const workoutsRouter = require("./routes/workouts");


// HOME PAGE ROUTE
app.get("/", (req, res) => {
    res.render("dashboard"); 
});


// MOUNT WORKOUT ROUTES
app.use("/dashboard", indexRouter);
app.use("/workouts", workoutsRouter);
//app.use('/', signinRouter);



// START SERVER
app.listen(3000, () => {
    console.log("Workit running on http://localhost:3000");
});






 

