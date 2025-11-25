// IMPORT EXPRESS (from MEAN slides)
const express = require("express");
const path = require("path");

// CREATE APP
const app = express();

// CONFIGURE VIEW ENGINE (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// BODY PARSER (needed for forms)
app.use(express.urlencoded({ extended: true }));



// SERVE STATIC FILES (CSS, images)
app.use(express.static(path.join(__dirname, "public")));


app.use(
  session({
    secret: "workit-secret-key",   // any random string
    resave: false,
    saveUninitialized: false,
  })
);

// make the current user available in all EJS views
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});


const signinRouter = require("./routes/signin");
const signupRouter = require("./routes/signup");

app.use("/", signinRouter);
app.use("/", signupRouter);


// IMPORT WORKOUT ROUTES
const workoutsRouter = require("./routes/index");


// HOME PAGE ROUTE
app.get("/", (req, res) => {
    res.render("dashboard"); 
});


// MOUNT WORKOUT ROUTES
app.use("/workouts", workoutsRouter);

// START SERVER
app.listen(3000, () => {
    console.log("Workit running on http://localhost:3000");
});

// IMPORT SIGNUP ROUTES
const signupRouter = require("./routes/signup");
app.use(signupRouter);



 

