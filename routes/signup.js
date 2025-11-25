const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Import database functions
const { saveNewUser, checkEmailExists } = require("../database/userModel");

// GET /signup : show signup page
router.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

// POST /signup : handle signup form submission
router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render("signup", { error: "All fields are required." });
    }
// Check if email already exists
    try {
        const emailTaken = await checkEmailExists(email);

        if (emailTaken) {
            return res.render("signup", { error: "Email already in use." });
        }

// Hash the password before saving
        const hashed = await bcrypt.hash(password, 10);

        // Create the user object to send to the DB handler
        const newUser = {
            username,
            email,
            password: hashed,
        };

        await saveNewUser(newUser);

        // Redirect to login
        res.redirect("/login");
    } catch (err) {
        console.error(err);
        res.render("signup", { error: "Something went wrong." });
    }
});
// Export the router
module.exports = router;
