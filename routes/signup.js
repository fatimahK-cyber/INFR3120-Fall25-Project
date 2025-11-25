const express = require("express");
const router = express.Router();

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
;

        const newUser = {
            username,
            email,
            password,
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
