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

