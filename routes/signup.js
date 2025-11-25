const express = require("express");
const router = express.Router();
const User = require("../models/users.models.js");

// GET /signup
router.get("/signup", (req, res) => {
    // use "message" because your EJS is using message
    res.render("signup", { message: "" });
});

// POST /signup
router.post("/signup", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // basic required fields
    if (!username || !email || !password || !confirmPassword) {
        return res.render("signup", { message: "All fields are required." });
    }

    // check passwords match
    if (password !== confirmPassword) {
        return res.render("signup", { message: "Passwords do not match." });
    }

    try {
        const emailTaken = await checkEmailExists(email);

        if (emailTaken) {
            return res.render("signup", { message: "Email already in use." });
        }

        const newUser = {
            username,
            email,
            password
        };

        await saveNewUser(newUser);

        res.redirect("/signin");
    } catch (err) {
        console.error(err);
        res.render("signup", { message: "Something went wrong." });
    }
});

module.exports = router;
