const isProd = process.env.NODE_ENV === "production";

const express = require("express");
const router = express.Router();
const User = require("../model/usersModel.js");
const passport = require("passport");

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const reguser = await User.register(newUser, password);
    res.locals.user = reguser;

    return res
      .status(200)
      .json({ message: "User registered successfully", user: reguser });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    return res.status(400).json({ message: `Something went wrong: ${err}` });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Server error during login" });
    }
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || "Invalid credentials" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed" });
      }
      return res.json({
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

// Logout
router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("connect.sid", {
        path: "/",
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
      });

      return res.json({ message: "Logged out" });
    });
  });
});

// Current user
router.get("/me", async (req, res) => {
  try {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.json({
        user: {
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
        },
      });
    } else {
      return res.status(401).json({ error: "Not authenticated" });
    }
  } catch (err) {
    console.error("Error in /auth/me:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
