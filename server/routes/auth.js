const express = require('express');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const router = express.Router();

router.use(cookieParser());

// Login
router.post('/login', async (req, res) => {
    const { password } = req.body;

    const MASTER_PASSWORD_HASH = process.env.MASTER_PASSWORD_HASH;

    const isValid = await bcrypt.compare(password, MASTER_PASSWORD_HASH);
    if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    res.cookie("session", "loggedIn", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({ success: true, message: "Login successful" });
});



// Logout
router.post('/logout', (req, res) => {
    res.clearCookie("session");
    res.json({ success: true, message: "Logged out" });
});

module.exports = router;



