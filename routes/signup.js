const express = require("express");
const router = express.Router();
const User = require("../models/users.models");

// GET /signup  → show form
router.get("/signup", (req, res) => {
    res.render("signup", { error: "" });
});

// POST /signup  → handle form submit
router.post("/signup", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // 1) basic required fields
    if (!username || !email || !password || !confirmPassword) {
        return res.render("signup", { error: "All fields are required." });
    }

    // 2) password match
    if (password !== confirmPassword) {
        return res.render("signup", { error: "Passwords do not match." });
    }

    try {
        // 3) check if username OR email already exists
        const existingUser = await User.findOne({
            $or: [
                { username: username.trim() },
                { email: email.toLowerCase().trim() }
            ],
        });

        if (existingUser) {
            return res.render("signup", { error: "Username or email already in use." });
        }

        // 4) create and save new user
        const newUser = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password, // plain text for this assignment
        });

        await newUser.save();

        // 5) signup success → go to Sign In page
        return res.redirect("/signin");
    } catch (err) {
        console.error("Signup error:", err);
        return res.render("signup", { error: "Something went wrong." });
    }
});

module.exports = router;
