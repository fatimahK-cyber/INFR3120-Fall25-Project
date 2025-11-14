// IMPORT EXPRESS (from MEAN slides)
const express = require("express");
const path = require("path");

// CREATE APP
const app = express();

// CONFIGURE VIEW ENGINE (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// SERVE STATIC FILES (CSS, images)
app.use(express.static(path.join(__dirname, "public")));

// HOME PAGE ROUTE
// This matches Express routing concepts (MEAN slides)
app.get("/", (req, res) => {
    res.render("home");
});

// START SERVER
app.listen(3000, () => {
    console.log("Workit running on http://localhost:3000");
});
