const express = require("express");
const router = express.Router();
const User = require("../models/users.models");

// GET /signup
router.get("/signup", (req, res) => {
    // Pass error so EJS never crashes
    res.render("signup", { error: "" });
});

// POST /signup
router.post("/signup", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // basic required fields
    if (!username || !email || !password || !confirmPassword) {
        return res.render("signup", { error: "All fields are required." });
    }

    // check passwords match
    if (password !== confirmPassword) {
        return res.render("signup", { error: "Passwords do not match." });
    }

    try {
        // your own helper, or adjust to use User.findOne if needed
        const emailTaken = await checkEmailExists(email);

        if (emailTaken) {
            return res.render("signup", { error: "Email already in use." });
        }

        const newUser = {
            username,
            email,
            password,
        };

        // your helper to save, or use new User(newUser).save()
        await saveNewUser(newUser);

        // after signup, go to sign in page
        res.redirect("/signin");
    } catch (err) {
        console.error(err);
        res.render("signup", { error: "Something went wrong." });
    }
});

module.exports = router;
